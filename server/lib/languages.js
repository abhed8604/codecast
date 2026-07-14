/**
 * Languages accepted across the API. Must stay in sync with:
 *  - the client LANGUAGES keys (client/src/lib/types.js)
 *  - the DB CHECK constraint (server/db/schema.sql)
 *  - the runner image (runner/Dockerfile) + execute route (server/routes/execute.js)
 */
export const SUPPORTED_LANGUAGES = ['python', 'cpp', 'sql']
