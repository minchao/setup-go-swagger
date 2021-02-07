import * as nock from 'nock'

import { getSwaggerLatestVersion } from '../src/util'

describe('get swagger latest version', () => {
  let mock: nock.Interceptor

  beforeEach(() => {
    mock = nock('https://api.github.com')
      .get('/repos/go-swagger/go-swagger/releases/latest')
  })

  it('should be ok', async () => {
    mock.reply(200, {
      tag_name: 'v0.26.1'
    })

    const version = await getSwaggerLatestVersion()

    expect(version).toBe('v0.26.1')
  })

  it('should throw an error if github response invalid json', async () => {
    mock.reply(200, 'invalid-json')

    await expect(getSwaggerLatestVersion())
      .rejects
      .toThrow('Invalid json')
  })

  it('should throw an error if github response invalid version', async () => {
    mock.reply(200, { tag_name: 'invalid-version' })

    await expect(getSwaggerLatestVersion())
      .rejects
      .toThrow('Invalid version')
  })

  it('should throw an error if github response 404', async () => {
    mock.reply(404, {})

    await expect(getSwaggerLatestVersion())
      .rejects
      .toThrow('Failed to get latest version')
  })
})
