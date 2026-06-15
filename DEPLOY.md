# 个人博客部署指南

## 项目信息

- **仓库地址**: https://github.com/payours778/blog-test
- **服务器IP**: 120.77.201.34
- **项目路径**: /var/www/blog

---

## 一、服务器初始配置

连接服务器：
```bash
ssh root@120.77.201.34
```

### 1. 安装必要软件

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 验证安装
node -v
npm -v

# 安装 PM2（进程管理器）
npm install -g pm2

# 安装 Nginx（反向代理）
apt install -y nginx
```

### 2. 克隆项目并启动

```bash
# 创建项目目录
mkdir -p /var/www/blog
cd /var/www/blog

# 克隆 GitHub 仓库
git clone https://github.com/payours778/blog-test.git .

# 安装依赖
npm install

# 构建项目
npm run build

# 使用 PM2 启动
pm2 start npm --name "blog" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 3. 配置 Nginx 反向代理

```bash
# 编辑 Nginx 配置
nano /etc/nginx/sites-available/default
```

将内容替换为：
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 测试并重启 Nginx
nginx -t
systemctl restart nginx
```

### 4. 开放端口

在阿里云控制台 → 安全组 → 添加入站规则：
- 端口：**80**
- 授权对象：**0.0.0.0/0**

---

## 二、访问网站

打开浏览器访问：**http://120.77.201.34**

---

## 三、后续更新网站

### 本地修改代码后

```bash
# 进入项目目录
cd e:\data\blog

# 添加修改的文件
git add .

# 提交更新
git commit -m "更新描述"

# 推送到 GitHub
git push
```

### 服务器上更新

```bash
# 进入项目目录
cd /var/www/blog

# 拉取最新代码
git pull

# 重新构建
npm run build

# 重启服务
pm2 restart blog
```

---

## 四、常用命令

### PM2 命令
```bash
pm2 status          # 查看状态
pm2 logs blog       # 查看日志
pm2 restart blog    # 重启服务
pm2 stop blog       # 停止服务
pm2 delete blog     # 删除服务
```

### Nginx 命令
```bash
nginx -t            # 测试配置
systemctl restart nginx   # 重启 Nginx
systemctl stop nginx      # 停止 Nginx
```

### Git 命令
```bash
git status          # 查看状态
git log            # 查看提交历史
git pull           # 拉取最新代码
```

---

## 五、一键部署脚本

在 `/root/deploy.sh` 创建脚本：

```bash
#!/bin/bash
cd /var/www/blog
git pull
npm run build
pm2 restart blog
echo "部署完成！"
```

使用前添加执行权限：
```bash
chmod +x /root/deploy.sh
```

之后服务器更新只需运行：
```bash
/root/deploy.sh
```

---

## 六、常见问题

### 1. 网站无法访问
- 检查 PM2 状态：`pm2 status`
- 检查端口是否开放：阿里云安全组
- 检查 Nginx 是否运行：`systemctl status nginx`

### 2. PM2 进程消失
```bash
pm2 startup          # 重新配置开机自启
pm2 save            # 保存当前状态
```

### 3. 构建失败
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

---

## 七、域名配置（可选）

如果需要绑定域名：

1. 在域名服务商添加 DNS 记录：
   - 类型：A
   - 主机记录：@
   - 记录值：120.77.201.34

2. 修改 Nginx 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. 重启 Nginx：
```bash
nginx -t
systemctl restart nginx
```

4. 申请 SSL 证书（使用 Let's Encrypt）：
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```
