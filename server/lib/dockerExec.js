import { execFile } from 'node:child_process'

const CONTAINER = process.env.RUNNER_CONTAINER || 'codecast-runner'
const TIME_LIMIT_S = 5
const MEM_LIMIT_KB = 131072 // 128MB

/**
 * Run a shell command inside the runner container via `docker exec`.
 * Wall-clock time and virtual memory are capped inside the container.
 *
 * @param {string} innerCmd - shell command to run inside /sandbox
 * @param {{ limited?: boolean }} [opts] - when limited=false, skip ulimit/timeout
 *   (used for the C++ compile step, which is not the timed/measured phase).
 * @returns {Promise<{stdout: string, stderr: string, failed: boolean}>}
 */
export function dockerExec(innerCmd, opts = {}) {
  const { limited = true } = opts
  const wrapped = limited
    ? `ulimit -v ${MEM_LIMIT_KB}; timeout -s KILL ${TIME_LIMIT_S} ${innerCmd}`
    : innerCmd

  return new Promise((resolve) => {
    execFile(
      'docker',
      ['exec', CONTAINER, 'sh', '-c', wrapped],
      { maxBuffer: 1024 * 1024 * 8 },
      (err, stdout, stderr) => {
        resolve({ stdout: stdout || '', stderr: cleanStderr(stderr), failed: !!err })
      }
    )
  })
}

/**
 * Strip noise that some Docker-compatible runtimes (e.g. podman's CLI emulation)
 * print to stderr, so it never surfaces as a fake "error" in the output panel.
 */
function cleanStderr(stderr) {
  if (!stderr) return ''
  return stderr
    .split('\n')
    .filter(
      (line) =>
        !/Emulate Docker CLI using podman/i.test(line) &&
        !/Create \/etc\/containers\/nodocker/i.test(line)
    )
    .join('\n')
    .trim()
}

/**
 * Same as dockerExec, but retries a couple of times with a short delay so the
 * very first request after `npm run dev` doesn't fail while the container image
 * is still building / starting up.
 */
export async function dockerExecWithRetry(innerCmd, opts = {}) {
  const attempts = 3
  const delayMs = 1500
  let last = { stdout: '', stderr: 'runner unavailable', failed: true }

  for (let i = 0; i < attempts; i++) {
    const res = await dockerExec(innerCmd, opts)
    // A missing/not-running container surfaces as an exec-level failure with an
    // empty stdout and a docker-side error on stderr. Only retry those.
    const containerDown =
      res.failed && !res.stdout && /no such container|is not running|Cannot connect/i.test(res.stderr)
    if (!containerDown) return res
    last = res
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs))
  }
  return last
}
