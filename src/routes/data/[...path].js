import fs from 'fs'

import { resolve } from 'path' 
import { dataDir } from '$lib/util'

export async function get({ params }) {
  const { path } = params
  const fileName = resolve(dataDir, path)

  return {
    body: JSON.parse(fs.readFileSync(fileName))
  }
}