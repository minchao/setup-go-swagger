import * as httpm from '@actions/http-client'
import * as toolCache from '@actions/tool-cache'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export async function downloadSwagger (toolName: string, version: string): Promise<string> {
  let cachedToolPath = toolCache.find(toolName, version)
  let downloadPath = ''
  if (cachedToolPath === '') {
    try {
      downloadPath = await toolCache.downloadTool(getSwaggerDownloadURL(version))
    } catch (e) {
      throw new Error('Failed to download swagger')
    }

    cachedToolPath = await toolCache.cacheFile(downloadPath, toolName + getExecutableExtension(), toolName, version)
  }

  const swaggerPath = path.join(cachedToolPath, toolName + getExecutableExtension())
  fs.chmodSync(swaggerPath, '777')
  return swaggerPath
}

function getExecutableExtension (): string {
  if (os.type().match(/^Win/) !== null) {
    return '.exe'
  }
  return ''
}

function getSwaggerDownloadURL (version: string): string {
  const baseURL = 'https://github.com/go-swagger/go-swagger/releases/download/'

  switch (os.type()) {
    case 'Darwin':
      return `${baseURL}${version}/swagger_darwin_amd64`
    case 'Windows_NT':
      return `${baseURL}${version}/swagger_windows_amd64.exe`
    case 'Linux':
    default:
      return `${baseURL}${version}/swagger_linux_amd64`
  }
}

export async function getSwaggerLatestVersion (): Promise<string> {
  const res = await (new httpm.HttpClient('setup-go-swagger'))
    .get('https://api.github.com/repos/go-swagger/go-swagger/releases/latest')
  if (res.message.statusCode !== 200) {
    throw new Error('Failed to get latest version')
  }

  const body = await res.readBody()
  let releases: { tag_name: string }
  try {
    releases = JSON.parse(body)
  } catch (e) {
    throw new Error('Invalid json')
  }
  if (!releases.tag_name.startsWith('v')) {
    throw new Error('Invalid version')
  }

  return releases.tag_name
}
