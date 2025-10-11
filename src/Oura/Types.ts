import type { Result } from '../Types.ts'

export type OuraResult<T> = Result<string, T>

export type OuraResponseData<T = Record<string, unknown>> = {
  data: Array<T>
  next_token?: string | null
}
