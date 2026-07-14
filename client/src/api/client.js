/**
 * Centralized fetch wrapper. Every request goes through here so error handling
 * and JSON parsing live in one place. Paths are relative (/api/*) — Vite proxies
 * to the backend in dev, same origin in prod.
 */

async function request(path, { method = 'GET', body, signal } = {}) {
  const opts = { method, signal, headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`/api${path}`, opts)
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('Network error — is the server running?', 0)
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(payload?.error || `Request failed (${res.status})`, res.status)
  }
  return payload
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = {
  // Tutorials
  listTutorials: (status) =>
    request(`/tutorials${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  getTutorial: (id, signal) => request(`/tutorials/${id}`, { signal }),
  createTutorial: (data) => request('/tutorials', { method: 'POST', body: data }),
  updateTutorial: (id, data) => request(`/tutorials/${id}`, { method: 'PATCH', body: data }),
  deleteTutorial: (id) => request(`/tutorials/${id}`, { method: 'DELETE' }),

  // Checkpoints
  createCheckpoint: (data) => request('/checkpoints', { method: 'POST', body: data }),
  updateCheckpoint: (id, data) => request(`/checkpoints/${id}`, { method: 'PATCH', body: data }),
  deleteCheckpoint: (id) => request(`/checkpoints/${id}`, { method: 'DELETE' }),

  // Execution
  execute: (code, language) => request('/execute', { method: 'POST', body: { code, language } }),
}
