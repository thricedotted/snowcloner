import { replaceAll } from 'core-js'

import { dev } from '$app/env'

// project root-relative location of data
// in production, we `cp -r` to the Vercel function's container
const DATA_DIR = dev
                 ? './node_modules/corpora/data'
                 : './corpora/data'

function formatCorpusName(s) {
  return s.replace('.json', '')
          .replaceAll('_', ' ')
}

export {
  DATA_DIR,
  formatCorpusName
}
