import { dev } from '$app/env'

// project root-relative location of data
// in production, we `cp -r` to the Vercel function's container
export const dataDir = dev
                       ? './node_modules/corpora/data'
                       : './corpora/data'