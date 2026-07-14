# CodeCast

Interactive coding tutorials where instructors record themselves **typing** (a keystroke
log, not a video), drop checkpoints at key moments, and students watch the code
type itself out — then write real code at each checkpoint before playback resumes.
Checkpoints are graded by comparing the student's program output against a short
expected-output snippet. No hidden test cases.

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

Then open **http://localhost:5174**.

`npm run dev` is the only command you need. It starts three things together via `concurrently`:

| Name     | What it does                                            |
| --------- | ---------------------------------------------------------- |
| `runner` | builds & runs the sandbox container (`docker compose up`) |
| `server` | the Express API on `http://localhost:3002`            |
| `client` | the Vite dev server on `http://localhost:5174`     |

The Vite dev server proxies `/api/*` to the backend, so there is no CORS setup and
everything shares one origin.

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
**Execution still depends on the sandbox container** — `docker compose up --build` (the
`runner` script) must be running, and `server/tmp` must exist (it is created by
the repo and bind-mounted into the container). `npm start` with no runner → the
execute endpoint 500s.

---

## How it works

- **Recording** captures Monaco content-change deltas + run outputs, each timestamped from the
  start of the recording, with occasional full-value keyframes for cheap scrubbing.
- **Replay** applies those deltas to a read-only Monaco model driven by a
  `requestAnimationFrame` clock. Forward scrubbing is incremental; backward scrubbing
  rebuilds from the nearest keyframe. Checkpoint times are found with a binary search
  so long recordings stay smooth.
- **Grading** is 100% client-side and deterministic. For each checkpoint we compute the
  *baseline output* (the most recent recorded run output at that timestamp) and compare the
  student's new-output delta against the instructor's expected delta — trimmed,
  newline- and case-normalized.
- **Execution** is stateless: the API writes the code to a uuid-named temp file,
  runs it via `docker exec` with `ulimit` (128MB) + `timeout` (5s) caps, and
  deletes the temp file afterward. No queue, no ports, no HTTP server inside the container.

## Project layout

```
client/   React + Vite + Tailwind + Monaco + Framer Motion + Zustand
  src/lib/      framework-free, independently testable:
                  recorder, replayer, seek, grading, checkpoints, constants, motion
  src/hooks/   the only place those libs meet React (useRecorder, useReplayer, useGrading)
  src/components/, src/pages/
server/   Express + better-sqlite3 (WAL) + the docker-exec helper
  lib/       languages.js (shared allow-list), dockerExec.js, errorHandler.js
  routes/    tutorials, checkpoints, execute
  db/        init.js (SQLite), schema.sql
runner/   Dockerfile for the sandbox (python3 + g++ + sqlite3)
```

`client/src/lib/` is framework-free and the natural home for unit tests.

## Fonts

Space Grotesk / Inter / JetBrains Mono are loaded from Google Fonts (`display=swap`).
To cut the external request later, swap the `<link>` in `client/index.html` for
self-hosted variable-font files.

## Adding a language

The allow-list is **centralized** in `server/lib/languages.js` (`SUPPORTED_LANGUAGES`)
and reused by the `tutorials` and `execute` routes. To add a language you must keep
**five** places in sync:

1. Install its toolchain in `runner/Dockerfile`.
2. Add a branch in `server/routes/execute.js` (write file + `docker exec` command).
3. Add the key to `LANGUAGES` in `client/src/lib/types.js` (label + Monaco id + ext).
4. Add it to `SUPPORTED_LANGUAGES` in `server/lib/languages.js`.
5. Add it to the `CHECK(language IN (...))` constraint in `server/db/schema.sql`.

## Environment variables (`.env`)

All have safe defaults — you only set them to override.

| Variable               | Default            | Purpose                                        |
| ---------------------- | ------------------ | ---------------------------------------------- |
| `PORT`                | `3002`            | Server listen port (Vite proxies `/api` here).  |
| `DB_PATH`             | `./codecast.db`   | SQLite file, **relative to `server/db`** (so the server works from any working directory). |
| `RUNNER_CONTAINER`   | `codecast-runner`  | Container name used for `docker exec`.       |
| `RUNNER_TIME_LIMIT_S`| `5`               | Per-run wall-clock cap (applied inside the container). |
| `RUNNER_MEM_LIMIT_KB`| `1048576` (1GB) | Per-run virtual-address-space cap (generous — C++ reserves large virtual ranges at startup). |
| `MAX_OUTPUT_BYTES`   | `51200` (50KB)   | Cap on returned stdout.                       |

## Running on podman

This environment uses **podman** with Docker CLI emulation, so the code is unchanged from
a standard Docker setup. Two one-time notes:

- Make sure the podman API socket is running (the "Docker Desktop is running" equivalent):
  ```bash
  systemctl --user start podman.socket
  ```
- `docker compose`, `docker exec`, `container_name`, and bind mounts all work transparently
  through the emulation. The bind mount uses `:Z` in `docker-compose.yml`, which is a
  no-op on non-SELinux hosts and keeps rootless podman happy on SELinux hosts.

---

## What this intentionally does not include

No auth, no video recording, no hidden test-case grading, no submission persistence, no
multi-service execution backend, and no WebGL/3D anywhere.
