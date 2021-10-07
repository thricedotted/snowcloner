import fs from 'fs'

import { resolve } from 'path' 
import { DATA_DIR } from '$lib/util'

export async function get({ params }) {
  const { path } = params
  const fileName = resolve(DATA_DIR, path)

  return {
    body: JSON.parse(fs.readFileSync(fileName))
  }
}