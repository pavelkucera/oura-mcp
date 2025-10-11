import * as assert from 'node:assert'
import { describe, it } from 'node:test'
import { errorMessages } from './Error.ts'
import { inspect } from 'node:util'

void describe('Collecting error information', () => {
  it('returns the error message for a shallow error', () => {
    const messages = errorMessages(new Error('message'))
    assert.deepStrictEqual(messages, ['message'])
  })

  it('returns a list of all messages for nested errors', () => {
    const messages = errorMessages(new Error('message', { cause: new Error('nested') }))
    assert.deepStrictEqual(messages, ['message', 'nested'])
  })

  it('returns an inspected value for non-Error value', () => {
    const value = { hi: 'hello' }
    const messages = errorMessages(value)
    assert.deepStrictEqual(messages, [inspect(value)])
  })
})
