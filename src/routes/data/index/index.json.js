import directoryTree from 'directory-tree'
import { dataDir } from '$lib/util'

export async function get() {
  return {
    body: directoryTree(dataDir, { attributes: ['path'] })
  }
}
