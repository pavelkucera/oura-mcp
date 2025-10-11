import { inspect } from 'node:util'

/** Wraps any value in an Error, or returns the value if it is already an Error */
export const wrapError = (error: unknown): Error =>
  error instanceof Error
    ? error
    : new Error('', { cause: error })

/** Returns error messages from an Error and all its predecessors */
export const errorMessages = (value: unknown): string[] => {
  if (value instanceof Error) {
    const previous = value.cause != null ? errorMessages(value.cause) : []
    return [value.message, ...previous]
  }
  else {
    return [inspect(value)]
  }
}
