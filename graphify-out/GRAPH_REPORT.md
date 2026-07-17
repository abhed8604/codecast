# Graph Report - .  (2026-07-17)

## Corpus Check
- Corpus is ~19,648 words - fits in a single context window. You may not need a graph.

## Summary
- 332 nodes · 635 edges · 19 communities (17 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Client API & Shared UI
- Checkpoint & Demo Components
- Server & Docker Execution
- ESLint Config
- Production Dependencies
- App Shell & Navigation
- Dev Dependencies & Linting
- Landing Page Sections
- Package Manifest & Scripts
- Code Editor & Monaco
- Project Docs & Concepts
- Grading Engine
- Prettier Config
- Recording Engine
- OpenCode Config
- Graphify Plugin

## God Nodes (most connected - your core abstractions)
1. `react` - 19 edges
2. `formatDuration()` - 13 edges
3. `useTutorialStore` - 13 edges
4. `scripts` - 9 edges
5. `CodeCast README` - 9 edges
6. `FlagIcon()` - 8 edges
7. `useGrading()` - 8 edges
8. `useReplayer()` - 7 edges
9. `LANGUAGES` - 7 edges
10. `CheckpointEditor()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Graphify Instructions (AGENTS.md)` --conceptually_related_to--> `CodeCast README`  [INFERRED]
  AGENTS.md → README.md
- `Client Entry HTML` --conceptually_related_to--> `CodeCast README`  [INFERRED]
  client/index.html → README.md
- `Runner Service (docker-compose)` --conceptually_related_to--> `Express API Server`  [INFERRED]
  docker-compose.yml → README.md
- `Express API Server` --conceptually_related_to--> `Client Entry HTML`  [INFERRED]
  README.md → client/index.html
- `Execution (stateless docker exec)` --references--> `Runner Service (docker-compose)`  [EXTRACTED]
  README.md → docker-compose.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **npm run dev single-origin stack** — client_index_html, readme_server, docker_compose_runner, readme_codecast [INFERRED 0.85]

## Communities (19 total, 2 thin omitted)

### Community 0 - "Client API & Shared UI"
Cohesion: 0.11
Nodes (36): api, formatDuration(), langStyles, LanguageBadge(), StatusBadge(), CheckpointForm(), EmptyState(), ArrowLeftIcon() (+28 more)

### Community 1 - "Checkpoint & Demo Components"
Cohesion: 0.06
Nodes (31): CodeTypingDemoBase(), COLORS, highlight(), CHECKS, reveal, STREAM, StreamOutput(), reveal (+23 more)

### Community 2 - "Server & Docker Execution"
Cohesion: 0.11
Nodes (19): db, __dirname, schema, app, __dirname, cleanStderr(), dockerExec(), dockerExecWithRetry() (+11 more)

### Community 3 - "ESLint Config"
Cohesion: 0.07
Nodes (28): jsx, env, browser, es2022, node, extends, ignorePatterns, parserOptions (+20 more)

### Community 4 - "Production Dependencies"
Cohesion: 0.08
Nodes (25): better-sqlite3, compression, dotenv, express, framer-motion, monaco-editor, @monaco-editor/react, dependencies (+17 more)

### Community 5 - "App Shell & Navigation"
Cohesion: 0.10
Nodes (16): App(), CheckpointEditor, pageVariants, Record, Watch, Card(), Header(), BookIcon() (+8 more)

### Community 6 - "Dev Dependencies & Linting"
Cohesion: 0.09
Nodes (23): autoprefixer, concurrently, cross-env, eslint, eslint-plugin-react, eslint-plugin-react-hooks, devDependencies, autoprefixer (+15 more)

### Community 7 - "Landing Page Sections"
Cohesion: 0.16
Nodes (13): CountUp(), BentoFeatures(), FinalCTA(), Hero(), LANGS, rise, HowItWorks(), STATS (+5 more)

### Community 8 - "Package Manifest & Scripts"
Cohesion: 0.12
Nodes (16): description, engines, node, name, private, scripts, build, client (+8 more)

### Community 9 - "Code Editor & Monaco"
Cohesion: 0.26
Nodes (9): baseOptions, CodeEditor(), diffOptions, DiffView(), ReplayEditor(), replayOptions, currentThemeName(), defineCodecastTheme() (+1 more)

### Community 10 - "Project Docs & Concepts"
Cohesion: 0.24
Nodes (12): Graphify Instructions (AGENTS.md), Client Entry HTML, Runner Service (docker-compose), CodeCast README, Execution (stateless docker exec), Grading (client-side deterministic), Recording (keystroke log), Replay (RAF clock) (+4 more)

### Community 11 - "Grading Engine"
Cohesion: 0.42
Nodes (8): useGrading(), getBaselineOutputAt(), gradeRun(), normalize(), suggestDelta(), firstEventAfter(), firstIndexAfter(), lastIndexAtOrBefore()

### Community 12 - "Prettier Config"
Cohesion: 0.25
Nodes (7): arrowParens, jsxSingleQuote, printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 14 - "OpenCode Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **97 isolated node(s):** `root`, `browser`, `node`, `es2022`, `ecmaVersion` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Checkpoint & Demo Components` to `Client API & Shared UI`, `ESLint Config`, `App Shell & Navigation`, `Landing Page Sections`, `Code Editor & Monaco`, `Grading Engine`, `Recording Engine`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `plugins` connect `ESLint Config` to `Checkpoint & Demo Components`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Production Dependencies` to `Package Manifest & Scripts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `root`, `browser`, `node` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Client API & Shared UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11041229909154437 - nodes in this community are weakly interconnected._
- **Should `Checkpoint & Demo Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06292517006802721 - nodes in this community are weakly interconnected._
- **Should `Server & Docker Execution` be split into smaller, more focused modules?**
  _Cohesion score 0.11494252873563218 - nodes in this community are weakly interconnected._