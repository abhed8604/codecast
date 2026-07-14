import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { writeFile, unlink } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dockerExecWithRetry } from '../lib/dockerExec.js'
import { httpError } from '../middleware/errorHandler.js'
import { SUPPORTED_LANGUAGES } from '../lib/languages.js'

const router = Router()

const __dirname = dirname(fileURLToPath(import.meta.url))
// server/tmp is bind-mounted to /sandbox inside the runner container.
const TMP_DIR = resolve(__dirname, '../tmp')

const MAX_OUTPUT_BYTES = Number(process.env.MAX_OUTPUT_BYTES) || 50 * 1024

function truncate(str) {
  if (str.length <= MAX_OUTPUT_BYTES) return str
  return str.slice(0, MAX_OUTPUT_BYTES) + '\n...[output truncated]'
}

async function safeUnlink(path) {
  try {
    await unlink(path)
  } catch {
    /* best-effort cleanup */
  }
}

/** Forward async rejections to the Express error handler (Express 4 doesn't). */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/**
 * POST /api/execute — { code, language } -> { output, error, status }
 * Stateless: write code to a uuid file, docker exec into the runner, clean up.
 */
router.post('/', asyncHandler(async (req, res) => {
  const { code, language } = req.body || {}
  if (typeof code !== 'string') throw httpError(400, 'code is required')
  if (!SUPPORTED_LANGUAGES.includes(language)) throw httpError(400, 'Invalid language')

  const stamp = uuid()
  const created = []

  try {
    if (language === 'python') {
      const file = `${stamp}.py`
      await writeFile(resolve(TMP_DIR, file), code)
      created.push(file)
      const result = await dockerExecWithRetry(`python3 /sandbox/${file}`)
      return res.json(formatResult(result))
    }

    if (language === 'sql') {
      const file = `${stamp}.sql`
      await writeFile(resolve(TMP_DIR, file), code)
      created.push(file)
      const result = await dockerExecWithRetry(`sqlite3 :memory: < /sandbox/${file}`)
      return res.json(formatResult(result))
    }

    if (language === 'cpp') {
      const src = `${stamp}.cpp`
      const bin = `${stamp}.out`
      await writeFile(resolve(TMP_DIR, src), code)
      created.push(src)

      // Compilation is not the timed/limited step.
      const compile = await dockerExecWithRetry(
        `g++ -O2 -o /sandbox/${bin} /sandbox/${src} 2>&1`,
        { limited: false }
      )
      if (compile.failed) {
        return res.json({
          output: '',
          error: truncate(compile.stdout || compile.stderr || 'Compilation failed'),
          status: 'error',
        })
      }
      created.push(bin)
      const result = await dockerExecWithRetry(`/sandbox/${bin}`)
      return res.json(formatResult(result))
    }
  } finally {
    await Promise.all(created.map((f) => safeUnlink(resolve(TMP_DIR, f))))
  }
}))

function formatResult(result) {
  const output = truncate(result.stdout || '')
  const stderr = truncate(result.stderr || '')
  if (result.failed) {
    // `timeout -s KILL` and OOM kills surface as a bare "Killed" (exit 137).
    const isLimit = !stderr || /^killed$/i.test(stderr)
    return {
      output,
      error: isLimit ? 'Time or memory limit exceeded (5s / 128MB).' : stderr,
      status: 'error',
    }
  }
  return { output, error: stderr || '', status: 'success' }
}

export default router
