<script context="module">
	export const prerender = true
</script>

import fs from 'fs'
import appRoot from 'app-root-path'

export async function get({ params }) {
  const { path } = params

  const filePath = `${appRoot}/corpora/data/${path}`

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