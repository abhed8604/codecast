import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_PATH = process.env.DB_PATH
  ? resolve(process.cwd(), process.env.DB_PATH)
  : resolve(__dirname, 'codecast.db')

const db = new Database(DB_PATH)

// WAL mode for smoother concurrent reads/writes; enforce FK cascades.
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Idempotent schema bootstrap.
const schema = readFileSync(resolve(__dirname, 'schema.sql'), 'utf-8')
db.exec(schema)

export default db
