import * as corpora from 'corpora-project'

export async function get() {
  const files = corpora.getCategories()

  return {
    body: files
  }
}