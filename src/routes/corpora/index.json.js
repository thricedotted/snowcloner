import { getCategories } from 'corpora-project'

export async function get() {
  const files = getCategories()

  return {
    body: files
  }
}