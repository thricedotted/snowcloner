import { getCategoriesAndFiles } from 'corpora'

export async function get() {
  const files = getCategoriesAndFiles()

  return {
    body: files.map(f => f.name)
  }
}