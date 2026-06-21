"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.saveDb = saveDb;
const sql_js_1 = __importDefault(require("sql.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '../../../database/blog.db');
const wasmPath = path_1.default.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm');
let db = null;
async function getDb() {
    if (db)
        return db;
    const SQL = await (0, sql_js_1.default)({
        locateFile: () => wasmPath
    });
    if (fs_1.default.existsSync(dbPath)) {
        const buffer = fs_1.default.readFileSync(dbPath);
        db = new SQL.Database(buffer);
    }
    else {
        db = new SQL.Database();
    }
    return db;
}
async function saveDb() {
    const database = await getDb();
    const data = database.export();
    const dataDir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
    fs_1.default.writeFileSync(dbPath, Buffer.from(data));
}
exports.default = getDb;
//# sourceMappingURL=index.js.map