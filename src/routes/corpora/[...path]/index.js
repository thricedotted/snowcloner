import { getCategories, getFiles, getFile } from 'corpora-project'

export async function get({ params }) {
  const { path } = params

  let results = undefined

  try {
    const category = path.split('/').slice(0, -1).join('/')
    const filename = path.split('/').slice(-1)[0].replace('.json', '')
    results = getFile(category, filename)
  }

  catch {
    const category = path.replace('.json', '')

    const categories = getCategories(category)
    const files = getFiles(category).map(f => f.name)

    results = [
      ...categories.map(name => { return { name, isDirectory: true }}),
      ...files.map(name => { return { name, isDirectory: false }})
    ].sort((a, b) => a.name.localeCompare(b.name)) 
  }

  return {
    body: results
  }
}