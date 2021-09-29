import fs from 'fs'
import path from 'path' 

const dataDir = './node_modules/corpora/data'

function getCategoriesAndFiles(...segments) {
  const dirName = path.resolve(dataDir, ...segments)
  console.log('can i see this', dirName)
  return fs.readdirSync(dirName).map(name => {
    return { 
      name: name.replace('.json', ''), 
      isDirectory: !name.endsWith('.json') 
    }
  })
}

function getFile(...segments) {
  const fileName = path.resolve(dataDir, ...segments)
  console.log('can i see this', fileName)
  return JSON.parse(fs.readFileSync(fileName))
}

export {
  getCategoriesAndFiles,
  getFile
}