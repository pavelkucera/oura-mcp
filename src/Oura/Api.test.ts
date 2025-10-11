import assert from 'node:assert'
import { describe, it } from 'node:test'
import { parseResponse } from './Api.ts'

void describe('Oura API', () => {
  void describe('Response parsing', () => {
    it('Returns parsed JSON', async () => {
      const response = new Response(JSON.stringify({ data: [1, 2, 3] }))
      const result = await parseResponse(response)

      assert.strictEqual(result.type, 'result')
      assert.deepStrictEqual(result.result, { data: [1, 2, 3] })
    })

    it('Returns an error when response is not a JSON object', async () => {
      const responseArray = new Response(JSON.stringify([1, 2, 3]))
      const resultArray = await parseResponse(responseArray)
      assert.strictEqual(resultArray.type, 'error')

      const responseNull = new Response(JSON.stringify(null))
      const resultNull = await parseResponse(responseNull)
      assert.strictEqual(resultNull.type, 'error')
    })

    it('Returns an error when response is not a valid JSON', async () => {
      const response = new Response('not valid json')
      const result = await parseResponse(response)

      assert.strictEqual(result.type, 'error')
    })
  })
})
