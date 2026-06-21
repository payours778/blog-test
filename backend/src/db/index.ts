import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../../../database/blog.db');
const wasmPath = path.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm');

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;
  
  const SQL = await initSqlJs({
    locateFile: () => wasmPath
  });
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

export async function saveDb(): Promise<void> {
  const database = await getDb();
  const data = database.export();
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export default getDb;
