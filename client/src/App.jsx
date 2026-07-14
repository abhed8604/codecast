import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Header from './components/Header.jsx'
import ToastHost from './components/Toast.jsx'
import { EditorSkeleton } from './components/Skeleton.jsx'

// Eager — these never pull in Monaco, so they stay tiny and load instantly.
import Home from './pages/Home.jsx'
import LectureHub from './pages/LectureHub.jsx'
import StudentList from './pages/StudentList.jsx'
import StudioList from './pages/StudioList.jsx'

// Lazy — the only routes that need Monaco. Code-split so the bundle above stays small.
const Record = lazy(() => import('./pages/Record.jsx'))
const CheckpointEditor = lazy(() => import('./pages/CheckpointEditor.jsx'))
const Watch = lazy(() => import('./pages/Watch.jsx'))

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function Page({ children }) {
  return (
    <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-[100dvh] bg-void text-ink">
      <Header />
      <Suspense fallback={<EditorSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
            <Route
              path="/lecture"
              element={
                <Page>
                  <LectureHub />
                </Page>
              }
            />
            <Route
              path="/lecture/student"
              element={
                <Page>
                  <StudentList />
                </Page>
              }
            />
            <Route
              path="/lecture/student/:id"
              element={
                <Page>
                  <Watch mode="student" />
                </Page>
              }
            />
            <Route
              path="/lecture/studio"
              element={
                <Page>
                  <StudioList />
                </Page>
              }
            />
            <Route
              path="/lecture/studio/record"
              element={
                <Page>
                  <Record />
                </Page>
              }
            />
            <Route
              path="/lecture/studio/:id/checkpoints"
              element={
                <Page>
                  <CheckpointEditor />
                </Page>
              }
            />
            <Route
              path="/lecture/studio/:id/watch"
              element={
                <Page>
                  <Watch mode="studio" />
                </Page>
              }
            />
            <Route
              path="*"
              element={
                <Page>
                  <Home />
                </Page>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <ToastHost />
    </div>
  )
}
