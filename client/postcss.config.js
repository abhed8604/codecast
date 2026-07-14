export default {
  plugins: {
    // Explicit config path + repo-root-relative content globs, because the dev
    // and build scripts run Vite from the repo root (`vite client/`), so Tailwind's
    // CWD is the repo root, not this folder.
    tailwindcss: { config: './client/tailwind.config.js' },
    autoprefixer: {},
  },
}
