export type Result<ErrorType, Result>
  = | { type: 'error', error: ErrorType }
    | { type: 'result', result: Result }
