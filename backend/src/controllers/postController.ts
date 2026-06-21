import { Request, Response } from 'express';
import getDb, { saveDb } from '../db';
import { CreatePostRequest, UpdatePostRequest } from '../models';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const posts = db.exec('SELECT id, title, excerpt, cover, created_at FROM posts ORDER BY created_at DESC');
    res.json({ posts: posts[0]?.values?.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      excerpt: row[2],
      cover: row[3],
      created_at: row[4]
    })) || [] });
  } catch (error) {
    res.status(500).json({ error: '获取文章列表失败' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
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
    await saveDb();
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: '获取文章详情失败' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, slug, cover } = req.body as CreatePostRequest;
    
    if (!title || !content || !excerpt || !slug) {
      return res.status(400).json({ error: '标题、内容、摘要和 slug 不能为空' });
    }
    
    const db = await getDb();
    const now = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
    db.run(
      'INSERT INTO posts (title, content, excerpt, slug, cover, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, content, excerpt, slug, cover || null, now, now]
    );
    
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
    
    await saveDb();
    
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
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'slug 已存在' });
    }
    console.error('创建文章错误:', error);
    res.status(500).json({ error: '创建文章失败' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, cover } = req.body as UpdatePostRequest;
    
    const db = await getDb();
    const existingResult = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
    
    if (!existingResult[0]?.values?.length) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (content !== undefined) { fields.push('content = ?'); values.push(content); }
    if (excerpt !== undefined) { fields.push('excerpt = ?'); values.push(excerpt); }
    if (cover !== undefined) { fields.push('cover = ?'); values.push(cover); }
    
    const now = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
    fields.push('updated_at = ?');
    values.push(now);
    
    db.run(`UPDATE posts SET ${fields.join(', ')} WHERE id = ${id}`, values);
    await saveDb();
    
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
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'slug 已存在' });
    }
    res.status(500).json({ error: '更新文章失败' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const existingResult = db.exec(`SELECT * FROM posts WHERE id = ${id}`);
    
    if (!existingResult[0]?.values?.length) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    db.run(`DELETE FROM posts WHERE id = ${id}`);
    await saveDb();
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
};
