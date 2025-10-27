import { type RequestId } from '@modelcontextprotocol/sdk/types.js'
import { log } from '../Logger.ts'
import type { Result } from '../Types.ts'
import type { OuraResponseData } from './Types.ts'
import { wrapError } from '../Error.ts'

const OURA_API_BASE = 'https://api.ouraring.com/v2'

/** Exhaustively fetches data from an Oura endpoint, supporting pagination using `next_token`. */
export const fetchOuraData = async <T extends OuraResponseData>(
  accessToken: string,
  path: string,
  requestId: RequestId,
  init?: RequestInit,
): Promise<Result<Error, T['data']>> => {
  let url: string | null = `${OURA_API_BASE}/${path}`

  // Fetch data in a loop -- allow for pagination by changing url
  const results: T['data'] = []
  while (url != null) {
    // Fetch data
    log.info('Sending a request to Oura', { requestId, path })
    const result = await makeOuraRequest<OuraResponseData>(requestId, new Request(
      url,
      {
        ...init,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Request-Id': requestId.toString(),
        },
      },
    ))
    log.info('Received response from Oura', { requestId })

    // Stop processing on error
    if (result.type === 'error') {
      log.error('Could not fetch data from Oura', { requestId, error: result.error })
      return {
        type: 'error',
        error: result.error,
      }
    }

    // Prep for fetching another page
    if (result.result.next_token != null) {
      log.info('Found reference to a next page', { requestId, next_token: result.result.next_token })
      const urlNextPage = new URL(`${OURA_API_BASE}/${path}`)
      urlNextPage.searchParams.append('next_token', result.result['next_token'])

      url = urlNextPage.toString()
    }
    else {
      url = null
    }

    // Collect result
    results.push(...result.result.data)
  }

  return {
    type: 'result',
    result: results,
  }
}

/** Fetches data from Oura and parses JSON. */
const makeOuraRequest = async <T>(
  requestId: RequestId,
  request: Request,
): Promise<Result<Error, T>> => {
  log.debug('Sending HTTP request to Oura', { requestId, request })

  // Fetch data
  let response: Response
  try {
    response = await fetch(request)
    log.debug('Received response from Oura', { requestId, response })
  }
  catch (error: unknown) {
    log.debug('Failed to fetch Oura data', { requestId, error })
    return {
      type: 'error',
      error: wrapError(error),
    }
  }

  // Non-OK status code
  if (!response.ok) {
    log.debug('Unexpected HTTP status', { requestId, response })

    const body = await response.text()
    let bodyParsed: unknown = null
    try {
      bodyParsed = JSON.parse(body) as unknown
    }
    catch (error) {
      log.error('Oura error response is not JSON', { requestId, error })
    }

    return {
      type: 'error',
      error: new Error('Unexpected HTTP status', { cause: { requestId, response, bodyParsed, body } }),
    }
  }

  log.debug('Parsing JSON', { requestId })
  const result = await parseResponse<T>(response)

  if (result.type === 'error') {
    log.debug('Failed parsing Oura response', { requestId, error: result.error, response })
    return result
  }

  log.debug('Parsed response', { requestId, response: result.result })
  return result
}

/** Parses a response into JSON. */
export const parseResponse = async <T>(response: Response): Promise<Result<Error, T>> => {
  try {
    const parsedJson: unknown = await response.json()

    // Ensure JSON is an object -- being extremely careful
    if (typeof parsedJson !== 'object' || Array.isArray(parsedJson) || parsedJson == null) {
      return {
        type: 'error',
        error: new Error('Received a non-object response from Oura', { cause: { parsedJson } }),
      }
    }

    return {
      type: 'result',
      result: parsedJson as T,
    }
  }
  catch (error: unknown) {
    log.debug('Failed to parse JSON', { error, response })

    return {
      type: 'error',
      error: wrapError(error),
    }
  }
}
