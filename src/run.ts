import * as core from '@actions/core'
import * as path from 'path'

import { downloadSwagger, getSwaggerLatestVersion } from './util'

const swaggerName = 'swagger'

export async function run (): Promise<void> {
  let version = core.getInput('version', { required: true })
  if (version.toLocaleLowerCase() === 'latest') {
    version = await getSwaggerLatestVersion()
  }
  const cachedPath = await downloadSwagger(swaggerName, version)

  core.addPath(path.dirname(cachedPath))

  console.log(`go-swagger version: '${version}' has been installed at ${cachedPath}`)
  core.setOutput('go-swagger-path', cachedPath)
}

run().catch(core.setFailed)
