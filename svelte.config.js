import glob from 'glob'
import vercel from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: vercel(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		prerender: {
			entries: 
				[
					"/",
					"/corpora.json",
					...glob.sync('**', { cwd: 'corpora/data' })
								.map(path => `/corpora/${path.endsWith('.json') ? path : path + '.json'}`)
				]
		}
	}
};

export default config;