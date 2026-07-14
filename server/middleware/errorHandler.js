/**
 * Central Express error handler. Produces a consistent { error } shape so the
 * frontend's api/client.js can rely on it.
 */
export function errorHandler(err, req, res, _next) {
  // eslint-disable-next-line no-console
  console.error(`[${req.method} ${req.originalUrl}]`, err)
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    error: err.publicMessage || err.message || 'Internal server error',
  })
}

/** Small helper to throw HTTP-aware errors from route handlers. */
export function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  err.publicMessage = message
  return err
}
