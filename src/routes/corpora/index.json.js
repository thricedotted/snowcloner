<script context="module">
	export const prerender = true
</script>

import fs from 'fs'
import appRoot from 'app-root-path'

export async function get() {
  const directory = `${appRoot}/corpora/data`

  const files = fs.readdirSync(directory)

  return {
    body: files
  }
}