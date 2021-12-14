import { dev, browser } from '$app/env'

// project root-relative location of data
// in production, we `cp -r` to the Vercel function's container
const DATA_DIR = dev
                 ? './node_modules/corpora/data'
                 : './corpora/data'

const STORE_KEY = 'snowcloneStore'

function formatCorpusName(s) {
  return s.replace('.json', '')
          .replace(/_/g, ' ')
}

function encodeObject(object) {
	const stringified = JSON.stringify(object)
	return browser
					? btoa(stringified)
					: Buffer.from(stringified).toString('base64')
}

function decodeObject(object) {
	try {
		const s = browser 
							? decodeURIComponent(atob(decodeURIComponent(object)))
							: Buffer.from(object, 'base64').toString()

		return JSON.parse(s)
	}
	catch {
		return null
	}
}

function encodeSpecialChars(s) {
	try {
		const specialCharMap = {
			// for tracery
			':': '&colon;',
			',': '&comma;',
			// for user input
			'<': '&lt;',
			'>': '&gt;',
		}

		const regex = new RegExp(Object.keys(specialCharMap).join('|'), 'g')

		return s.replace(regex, match => {
			return specialCharMap[match]
		})
	}
	catch {
		// we're probably here because s isn't a string
		return s
	}
}

export {
  DATA_DIR,
  STORE_KEY,
  formatCorpusName,
  encodeObject,
  decodeObject,
	encodeSpecialChars
}
