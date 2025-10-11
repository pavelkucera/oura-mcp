import * as assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'
import { formatLogLine } from './Logger.ts'

void describe('Logger', () => {
  void describe('log line formatting', () => {
    // Make date deterministic
    beforeEach(() => {
      const OriginalDate = Date
      const fixedTime = '2024-01-01T00:00:00.000Z'

      mock.method(globalThis, 'Date', function () {
        return new OriginalDate(fixedTime)
      })
    })

    it('returns a simple message', () => {
      const logLine = formatLogLine('debug', 'Debug')
      assert.strictEqual(logLine, '{"timestamp":"2024-01-01T00:00:00.000Z","level":"debug","message":"Debug","details":{}}')
    })

    it('returns a message with details', () => {
      const logLine = formatLogLine('debug', 'Debug', { foo: 'bar' })
      assert.strictEqual(logLine, '{"timestamp":"2024-01-01T00:00:00.000Z","level":"debug","message":"Debug","details":{"foo":"bar"}}')
    })

    it('returns a message with nested details', () => {
      const logLine = formatLogLine('debug', 'Debug', { nested: { foo: 'bar' } })
      assert.strictEqual(logLine, '{"timestamp":"2024-01-01T00:00:00.000Z","level":"debug","message":"Debug","details":{"nested":{"foo":"bar"}}}')
    })

    it('returns a message with an error', () => {
      const logLine = formatLogLine('debug', 'Debug', { error: new Error('message', { cause: 42 }) })
      const parsedLogLine = JSON.parse(logLine)

      assert.strictEqual(parsedLogLine.timestamp, '2024-01-01T00:00:00.000Z')
      assert.strictEqual(parsedLogLine.level, 'debug')
      assert.strictEqual(parsedLogLine.message, 'Debug')
      assert.strictEqual(parsedLogLine.details.error.message, 'message')
      assert.strictEqual(parsedLogLine.details.error.cause, 42)
      assert.strictEqual(typeof parsedLogLine.details.error.stack, 'string')
    })
  })
})
