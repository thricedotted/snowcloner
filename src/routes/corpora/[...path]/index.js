import fs from 'fs'

export async function get({ params }) {
  const { path } = params

  const filePath = `${import.meta.url.split('/').slice(0, -4).join('/')}/_corpora/data/${path}`

  let results = undefined

  try {
    results = JSON.parse(fs.readFileSync(filePath))
  }

  catch {
    const dirPath = filePath.replace('.json', '')

    results = fs.readdirSync(dirPath)
                .map(name => {
                  return { 
                    name: name.replace('.json', ''),
                    isDirectory: !name.endsWith('.json')
                   }
                })
  }

  return {
    body: results
  }
}