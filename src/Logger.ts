type LogLevel = 'debug' | 'info' | 'error'

const MIN_LOG_LEVEL = process.env['MIN_LOG_LEVEL'] ?? 'info'

/** Turns instances of Error to a Record. */
const formatValue = (value: unknown): unknown => {
  if (value instanceof Error) {
    return {
      message: value.message,
      cause: formatValue(value.cause),
      stack: value.stack,
    }
  }
  else {
    return value
  }
}

/** Turns details record into a printable object; used to turn `Error`s into nice objects. */
const formatDetails = (details: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(details).map(([key, value]) => [key, formatValue(value)]),
  )

/** Takes log details and returns a structured log line. */
export const formatLogLine = (
  level: LogLevel,
  message: string,
  details?: Record<string, unknown>,
): string =>
  JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    details: details != null ? formatDetails(details) : {},
  })

/** Prints log information into stderr */
export const log = (
  level: LogLevel,
  message: string,
  details?: Record<string, unknown>,
) => {
  if (MIN_LOG_LEVEL === 'error' && level !== 'error') {
    return
  }
  if (MIN_LOG_LEVEL === 'info' && level === 'debug') {
    return
  }

  console.error(formatLogLine(
    level,
    message,
    details,
  ))
}
log.debug = log.bind(null, 'debug')
log.info = log.bind(null, 'info')
log.error = log.bind(null, 'error')
