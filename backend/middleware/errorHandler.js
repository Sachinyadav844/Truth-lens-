export function errorHandler(error, _request, response, _next) {
  const validationError = error.name === 'ValidationError' || error.name === 'CastError'
  const duplicateError = error.code === 11000
  const errorStatus = Number(error.statusCode || error.status || (duplicateError ? 409 : validationError ? 400 : 0))
  const status = errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500
  const message = status < 500 ? error.message : 'Internal server error'

  if (status >= 500) console.error(error)
  return response.status(status).json({
    error: true,
    message: message || 'Request failed'
  })
}
