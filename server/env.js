// Loaded as the very first import in server/index.js so environment variables
// are available before any other module (e.g. db/init.js reading DB_PATH) is
// evaluated. ESM hoists imports, so this must be imported before them.
import dotenv from 'dotenv'

dotenv.config()
