import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import type { Project } from '../types';

interface ProjectRow {
  data: string;
}

const dbPath = process.env.DATABASE_PATH || './data/persona-studio.db';
let db: Database.Database | undefined;

function getDb() {
  if (db) return db;

  const abs = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  db = new Database(abs);
  db.pragma('journal_mode = WAL');
  db.exec(
    `CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  );

  return db;
}

export function listProjects(): Project[] {
  const rows = getDb()
    .prepare('SELECT data FROM projects ORDER BY updated_at DESC')
    .all() as ProjectRow[];

  return rows.map((row) => JSON.parse(row.data) as Project);
}

export function getProject(id: string): Project | undefined {
  const row = getDb()
    .prepare('SELECT data FROM projects WHERE id=?')
    .get(id) as ProjectRow | undefined;

  return row ? (JSON.parse(row.data) as Project) : undefined;
}

export function saveProject(p: Project) {
  getDb()
    .prepare(
      'INSERT INTO projects(id,data,updated_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at',
    )
    .run(p.id, JSON.stringify(p), p.updatedAt);

  return p;
}

export function deleteProject(id: string) {
  getDb().prepare('DELETE FROM projects WHERE id=?').run(id);
}
