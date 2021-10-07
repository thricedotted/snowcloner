import directoryTree from 'directory-tree'
import { DATA_DIR } from '$lib/util'

export async function get() {
  return {
    body: directoryTree(DATA_DIR, { attributes: ['path'] })
  }
}
