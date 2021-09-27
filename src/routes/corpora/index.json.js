import fs from 'fs'

export async function get() {
  const directory = `${import.meta.url.split('/').slice(0, -3).join('/')}/_corpora/data`

  const files = fs.readdirSync(directory)

  return {
    body: files
  }
}