"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.getPosts = void 0;
const db_1 = __importStar(require("../db"));
const getPosts = async (req, res) => {
    try {
        const db = await (0, db_1.default)();
        const posts = db.exec('SELECT id, title, excerpt, cover, created_at FROM posts ORDER BY created_at DESC');
        res.json({ posts: posts[0]?.values?.map((row) => ({
                id: row[0],
                title: row[1],
                excerpt: row[2],
                cover: row[3],
                created_at: row[4]
            })) || [] });
    }
    catch (error) {
        res.status(500).json({ error: '获取文章列表失败' });
    }
};
exports.getPosts = getPosts;
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.default)();
        const result = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
        const rows = result[0]?.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: '文章不存在' });
        }
        const row = rows[0];
        const post = {
            id: row[0],
            title: row[1],
            content: row[2],
            excerpt: row[3],
            slug: row[4],
            cover: row[5],
            views: row[6],
            created_at: row[7],
            updated_at: row[8]
        };
        db.run(`UPDATE posts SET views = views + 1 WHERE id = ${id}`);
        await (0, db_1.saveDb)();
        res.json({ post });
    }
    catch (error) {
        res.status(500).json({ error: '获取文章详情失败' });
    }
};
exports.getPostById = getPostById;
const createPost = async (req, res) => {
    try {
        const { title, content, excerpt, slug, cover } = req.body;
        if (!title || !content || !excerpt || !slug) {
            return res.status(400).json({ error: '标题、内容、摘要和 slug 不能为空' });
        }
        const db = await (0, db_1.default)();
        const now = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
        db.run('INSERT INTO posts (title, content, excerpt, slug, cover, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, content, excerpt, slug, cover || null, now, now]);
        // 使用 MAX(id) 获取刚插入的记录ID
        const maxIdResult = db.exec('SELECT MAX(id) FROM posts');
        const lastId = maxIdResult[0]?.values?.[0]?.[0];
        if (!lastId) {
            return res.status(500).json({ error: '创建文章失败' });
        }
        const queryResult = db.exec(`SELECT * FROM posts WHERE id = ${lastId}`);
        const row = queryResult[0]?.values?.[0];
        if (!row) {
            return res.status(500).json({ error: '创建文章失败' });
        }
        await (0, db_1.saveDb)();
        const newPost = {
            id: row[0],
            title: row[1],
            content: row[2],
            excerpt: row[3],
            slug: row[4],
            cover: row[5],
            views: row[6],
            created_at: row[7],
            updated_at: row[8]
        };
        res.status(201).json({ post: newPost });
    }
    catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'slug 已存在' });
        }
        console.error('创建文章错误:', error);
        res.status(500).json({ error: '创建文章失败' });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, cover } = req.body;
        const db = await (0, db_1.default)();
        const existingResult = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
        if (!existingResult[0]?.values?.length) {
            return res.status(404).json({ error: '文章不存在' });
        }
        const fields = [];
        const values = [];
        if (title !== undefined) {
            fields.push('title = ?');
            values.push(title);
        }
        if (content !== undefined) {
            fields.push('content = ?');
            values.push(content);
        }
        if (excerpt !== undefined) {
            fields.push('excerpt = ?');
            values.push(excerpt);
        }
        if (cover !== undefined) {
            fields.push('cover = ?');
            values.push(cover);
        }
        const now = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
        fields.push('updated_at = ?');
        values.push(now);
        db.run(`UPDATE posts SET ${fields.join(', ')} WHERE id = ${id}`, values);
        await (0, db_1.saveDb)();
        const updatedResult = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
        const row = updatedResult[0]?.values?.[0];
        if (!row) {
            return res.status(500).json({ error: '更新文章失败' });
        }
        const updatedPost = {
            id: row[0],
            title: row[1],
            content: row[2],
            excerpt: row[3],
            slug: row[4],
            cover: row[5],
            views: row[6],
            created_at: row[7],
            updated_at: row[8]
        };
        res.json({ post: updatedPost });
    }
    catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'slug 已存在' });
        }
        res.status(500).json({ error: '更新文章失败' });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.default)();
        const existingResult = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
        if (!existingResult[0]?.values?.length) {
            return res.status(404).json({ error: '文章不存在' });
        }
        db.run(`DELETE FROM posts WHERE id = ${id}`);
        await (0, db_1.saveDb)();
        res.json({ message: '删除成功' });
    }
    catch (error) {
        res.status(500).json({ error: '删除文章失败' });
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postController.js.map