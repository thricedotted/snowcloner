import { getCategoriesAndFiles, getFile } from '../_corpora'

export async function get({ params }) {
  const { path } = params
  const segments = path.split('/')

  let results = undefined

  try {
    results = getFile(...segments)
  }

  catch {
    results = getCategoriesAndFiles(
      ...segments.slice(0, -1), 
      segments[segments.length - 1].replace('.json', '')
    )
  }

  return {
    body: results
  }
}