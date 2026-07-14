# CodeCast

Interactive coding tutorials where instructors record themselves **typing** (a keystroke
log, not a video), drop checkpoints at key moments, and students watch the code type itself
out — then write real code at each checkpoint before playback resumes. Checkpoints are graded
by comparing the student's program output against a short expected-output snippet. No hidden
test cases.

- **Student Mode** — watch a lesson replay, solve each checkpoint, compare against the instructor.
- **Studio Mode** — record keystrokes, drop checkpoints, self-test, and publish.

Visual identity: black-and-violet, rounded surfaces, frosted pop-out panels, restrained motion.

---

## Prerequisites

- **Node.js 18+**
- **Docker Desktop** running in the background — used only for sandboxed code execution.
  (On this machine it is **podman** emulating the Docker CLI; see *Running on podman* below.)

## Getting started

```bash
git clone <repo> codecast
cd codecast
npm install
cp .env.example .env
npm run dev
```

Then open **http://localhost:5173**.

`npm run dev` is the only command you need. It starts three things together via `concurrently`:

| Name     | What it does                                             |
| -------- | ------------------------------------------------------- |
| `runner` | builds & runs the sandbox container (`docker compose up`) |
| `server` | the Express API on `http://localhost:3001`               |
| `client` | the Vite dev server on `http://localhost:5173`           |

The Vite dev server proxies `/api/*` to the backend, so there is no CORS setup and everything
shares one origin.

> **First run takes ~30–60s longer** while the sandbox image builds (installing
> `python3` / `g++` / `sqlite3`). After that it is cached and starts instantly.

> **Recordings are lightweight JSON event logs, not video.** A recording is an array of
> timestamped keystroke deltas and run outputs, stored as a single JSON blob per tutorial.

## Production build

```bash
npm run build      # builds client/dist
npm start          # NODE_ENV=production node server/index.js — serves the API + client/dist
```

In production the Express server serves the built SPA directly (one server, no separate host).

---

## How it works

- **Recording** captures Monaco content-change deltas + run outputs, each timestamped from the
  start of the recording, with occasional full-value keyframes for cheap scrubbing.
- **Replay** applies those deltas to a read-only Monaco model driven by a `requestAnimationFrame`
  clock. Forward scrubbing is incremental; backward scrubbing rebuilds from the nearest keyframe.
- **Grading** is 100% client-side and deterministic. For each checkpoint we compute the
  *baseline output* (the most recent recorded run output at that timestamp) and compare the
  student's new output delta against the instructor's expected delta — trimmed, newline- and
  case-normalized.
- **Execution** is stateless: the API writes the code to a uuid-named temp file (bind-mounted
  into the container), runs it via `docker exec` with `ulimit` (128MB) + `timeout` (5s) caps,
  and deletes the temp file afterward. No queue, no ports, no HTTP server inside the container.

## Project layout

```
client/   React + Vite + Tailwind + Monaco + Framer Motion + Zustand
server/   Express + better-sqlite3 (WAL) + the docker-exec helper
runner/   Dockerfile for the sandbox (python3 + g++ + sqlite3)
```

`client/src/lib/` is framework-free and independently testable (`recorder`, `replayer`,
`grading`, `seek`). `client/src/hooks/` is the only place those libs meet React.

## Fonts

Space Grotesk / Inter / JetBrains Mono are loaded from Google Fonts (`display=swap`). To cut
FOUT later, swap the `<link>` in `client/index.html` for self-hosted variable-font files.

## Adding a language

1. Install its toolchain in `runner/Dockerfile`.
2. Add a branch in `server/routes/execute.js`.
3. Add an entry to `LANGUAGES` in `client/src/lib/types.js`.

---

## Running on podman

This environment uses **podman** with Docker CLI emulation, so the code is unchanged from a
standard Docker setup. Two one-time notes:

- Make sure the podman API socket is running (the "Docker Desktop is running" equivalent):
  ```bash
  systemctl --user start podman.socket
  ```
- `docker compose`, `docker exec`, `container_name`, and bind mounts all work transparently
  through the emulation. The bind mount uses `:Z` in `docker-compose.yml`, which is a no-op on
  non-SELinux hosts and keeps rootless podman happy on SELinux hosts.

## Environment variables (`.env`)

```
PORT=3001
DB_PATH=./server/db/codecast.db
RUNNER_CONTAINER=codecast-runner
```

## What this intentionally does not include

No auth, no video recording, no hidden test-case grading, no submissions persistence, no
multi-service execution backend, and no WebGL/3D anywhere.
