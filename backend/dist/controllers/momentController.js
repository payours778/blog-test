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
exports.likeMoment = exports.deleteMoment = exports.updateMoment = exports.createMoment = exports.getMomentById = exports.getMoments = void 0;
const db_1 = __importStar(require("../db"));
const parseImages = (imagesVal) => {
    if (imagesVal === null || imagesVal === undefined)
        return [];
    const imagesStr = String(imagesVal);
    if (!imagesStr)
        return [];
    try {
        const parsed = JSON.parse(imagesStr);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [imagesStr];
    }
};
const getMoments = async (req, res) => {
    try {
        const db = await (0, db_1.default)();
        const moments = db.exec('SELECT * FROM moments ORDER BY created_at DESC');
        res.json({ moments: moments[0]?.values?.map((row) => ({
                id: row[0],
                content: row[1],
                images: parseImages(row[2]),
                likes: row[3],
                created_at: row[4]
            })) || [] });
    }
    catch (error) {
        res.status(500).json({ error: '获取说说列表失败' });
    }
};
exports.getMoments = getMoments;
const getMomentById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.default)();
        const result = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        const rows = result[0]?.values;
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: '说说不存在' });
        }
        const row = rows[0];
        const moment = {
            id: row[0],
            content: row[1],
            images: parseImages(row[2]),
            likes: row[3],
            created_at: row[4]
        };
        res.json({ moment });
    }
    catch (error) {
        res.status(500).json({ error: '获取说说详情失败' });
    }
};
exports.getMomentById = getMomentById;
const createMoment = async (req, res) => {
    try {
        const { content, images } = req.body;
        if (!content) {
            return res.status(400).json({ error: '内容不能为空' });
        }
        const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
        const imagesJson = JSON.stringify(imagesArray);
        const db = await (0, db_1.default)();
        const now = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 19);
        db.run('INSERT INTO moments (content, images, created_at) VALUES (?, ?, ?)', [content, imagesJson, now]);
        const maxIdResult = db.exec('SELECT MAX(id) FROM moments');
        const lastId = maxIdResult[0]?.values?.[0]?.[0];
        if (!lastId) {
            return res.status(500).json({ error: '发布说说失败' });
        }
        const queryResult = db.exec(`SELECT * FROM moments WHERE id = ${lastId}`);
        const row = queryResult[0]?.values?.[0];
        if (!row) {
            return res.status(500).json({ error: '发布说说失败' });
        }
        await (0, db_1.saveDb)();
        const newMoment = {
            id: row[0],
            content: row[1],
            images: parseImages(row[2]),
            likes: row[3],
            created_at: row[4]
        };
        res.status(201).json({ moment: newMoment });
    }
    catch (error) {
        console.error('发布说说错误:', error);
        res.status(500).json({ error: '发布说说失败' });
    }
};
exports.createMoment = createMoment;
const updateMoment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, images } = req.body;
        const db = await (0, db_1.default)();
        const existingResult = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        if (!existingResult[0]?.values?.length) {
            return res.status(404).json({ error: '说说不存在' });
        }
        const fields = [];
        const values = [];
        if (content !== undefined) {
            fields.push('content = ?');
            values.push(content);
        }
        if (images !== undefined) {
            const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
            fields.push('images = ?');
            values.push(JSON.stringify(imagesArray));
        }
        db.run(`UPDATE moments SET ${fields.join(', ')} WHERE id = ${id}`, values);
        await (0, db_1.saveDb)();
        const updatedResult = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        const row = updatedResult[0]?.values?.[0];
        if (!row) {
            return res.status(500).json({ error: '更新说说失败' });
        }
        const updatedMoment = {
            id: row[0],
            content: row[1],
            images: parseImages(row[2]),
            likes: row[3],
            created_at: row[4]
        };
        res.json({ moment: updatedMoment });
    }
    catch (error) {
        res.status(500).json({ error: '更新说说失败' });
    }
};
exports.updateMoment = updateMoment;
const deleteMoment = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.default)();
        const existingResult = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        if (!existingResult[0]?.values?.length) {
            return res.status(404).json({ error: '说说不存在' });
        }
        db.run(`DELETE FROM moments WHERE id = ${id}`);
        await (0, db_1.saveDb)();
        res.json({ message: '删除成功' });
    }
    catch (error) {
        res.status(500).json({ error: '删除说说失败' });
    }
};
exports.deleteMoment = deleteMoment;
const likeMoment = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await (0, db_1.default)();
        const existingResult = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        if (!existingResult[0]?.values?.length) {
            return res.status(404).json({ error: '说说不存在' });
        }
        db.run(`UPDATE moments SET likes = likes + 1 WHERE id = ${id}`);
        await (0, db_1.saveDb)();
        const updatedResult = db.exec(`SELECT * FROM moments WHERE id = ${id}`);
        const row = updatedResult[0]?.values?.[0];
        if (!row) {
            return res.status(500).json({ error: '点赞失败' });
        }
        const updatedMoment = {
            id: row[0],
            content: row[1],
            images: parseImages(row[2]),
            likes: row[3],
            created_at: row[4]
        };
        res.json({ moment: updatedMoment });
    }
    catch (error) {
        res.status(500).json({ error: '点赞失败' });
    }
};
exports.likeMoment = likeMoment;
//# sourceMappingURL=momentController.js.map