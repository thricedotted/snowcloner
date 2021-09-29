import fs from 'fs'
import path from 'path' 
import { dev } from '$app/env'

const dataDir = dev ? './node_modules/corpora/data' : './corpora/data'

function getCategoriesAndFiles(...segments) {
  const dirName = path.resolve(dataDir, ...segments)
  return fs.readdirSync(dirName).map(name => {
    return { 
      name: name.replace('.json', ''), 
      isDirectory: !name.endsWith('.json') 
    }
  })
}

function getFile(...segments) {
  const fileName = path.resolve(dataDir, ...segments)
  return JSON.parse(fs.readFileSync(fileName))
}

export {
  getCategoriesAndFiles,
  getFile
}