<script context="module">
import qs from 'qs'

const defaultGrammar = {
	$TEMPLATE$: '~ #animal.s.capitalize# can have a little #veggie# as a treat ~ #cute#',

	animal: {
		category: 'animals',
		subcategoryOrFile: 'common',
		file: '',
		key: 'animals'
	},

	veggie: {
		category: 'foods',
		subcategoryOrFile: 'vegetables',
		file: '',
		key: 'vegetables'
	},

	cute: {
		category: 'words',
		subcategoryOrFile: 'emoji/',
		file: 'cute_kaomoji',
		key: 'cuteKaomoji'
	}
}

export async function preload(page, session) {
	let preloadGrammar = qs.parse(page.query)

	if (Object.entries(preloadGrammar).length === 0) {
		preloadGrammar = defaultGrammar
	}

	const queryGrammar = {}

	// if (Object.entries(preloadGrammar).length > 0) {
		const promises = await Promise.all(Object.entries(preloadGrammar).map(async ([k, v]) => {
			if (k === '$TEMPLATE$') return [k, [v]]
			const { category, subcategoryOrFile, file, key, objectKey } = v
			const data = await this.fetch(`/corpora/data/${category}/${subcategoryOrFile}${file}.json`)
			const json = await data.json()

			let corpus = json

			if (key === 0) key = Object.keys(json)[0]

			if (key) corpus = json[key]

			if (objectKey && objectKey !== 'all') {
				corpus = corpus.filter(x => x[objectKey]).flatMap(x => x[objectKey]) 
			}

			return [k, corpus]
		}))

		promises.forEach(([k, v]) => queryGrammar[k] = v)
	// }

	const data = await this.fetch('/corpora/data.json')
	const categories = await data.json()

	return { categories, preloadGrammar, queryGrammar }
}
</script>

<script>
import tracery from 'tracery-grammar'
import { onMount, tick } from 'svelte'
import { writable, derived } from 'svelte/store'

import CorporaPicker from '../components/CorporaPicker.svelte'
import CorporaPicker2 from '../components/CorporaPicker2.svelte'
import GrammarSummary from '../components/GrammarSummary.svelte'

export let categories, preloadGrammar = {}, queryGrammar = {}

let generated = ''

const corporaTokens = preloadGrammar

const rawGrammar = writable({
	$TEMPLATE$: [preloadGrammar.$TEMPLATE$ || 'Hello!'],
	$ORIGIN$: ['#[#$ACTIONS$#]$TEMPLATE$#']
})

Object.entries(queryGrammar).forEach(([name, corpus]) => {
	addToGrammar({ name, corpus })
})

const grammar = derived(rawGrammar, $rawGrammar => {
	// clean out any keys that have been removed
	Object.keys($rawGrammar).forEach(k => {
		if (typeof $rawGrammar[k] === 'undefined') {
			delete $rawGrammar[k]
			corporaTokens[k] = undefined
		}
	})

	const actionKeys = Object.keys($rawGrammar)
										 .filter(k => k.startsWith('_'))
										 .map(k => `[#${k}#]`)

	const g = tracery.createGrammar({
		...$rawGrammar,
		$ACTIONS$: [actionKeys.join('')]
	})

	g.addModifiers(tracery.baseEngModifiers)

	return g
})

function addToGrammar({ name, selected, corpus }) {
	if (selected) corporaTokens[name] = selected

	if (typeof corpus[0] === 'object') {
		const actionName = `_${name}`
		const mapped = corpus.map(choice => {
			return Object.entries(choice)
						 .map(([k, v]) => `[${name}-${k}:${v}]`)
						 .join('')
		})

		$rawGrammar[actionName] = mapped
		// $rawGrammar.actions[0] += `[#${actionName}#]`
	}

	else {
		$rawGrammar[name] = corpus
	}

}

async function clone() {
	await tick()
	return $grammar.flatten('#$ORIGIN$#')
}

onMount(async () => generated = await clone())
</script>

<style>
.grid {
	display: grid;	
	grid-template-rows: auto 1fr;
	grid-template-columns: 20rem 1fr;
	width: 100vw;
	height: 100vh;
}

@media screen and (max-width: 40rem) {
	.grid {
		display: block;
		position: relative;
		top: 2rem;
	}

	header {
		position: fixed;
		top: 0;
	}
}

header {
	grid-column: 1 / -1;
	width: 100%;
	background: var(--color-primary-dark);
	color: var(--color-bg);
	margin: 0;
	border-bottom: 0.2rem solid var(--color-fg);
}

h1 {
	font-size: 1rem;
	padding: 0;
	margin: var(--gap);
	text-align: center;
	text-transform: lowercase;
}

.explorer, .compose {
	padding: 1rem;
	overflow: auto;
}

.explorer {
	background:
		url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23f1f2ea' fill-opacity='0.5' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E"),
		var(--color-primary-mid);
	color: var(--color-fg);
	border-right: 0.1rem solid currentColor;
}

.compose > * {
	position: relative;
	margin: 0 auto var(--double-gap) auto;
	max-width: 36rem;
}

.grammar {
	font-size: var(--font-smallest);
}

.generate {
	background: var(--color-primary-dark);
	color: var(--color-bg);
	padding: 1rem;
	border-radius: 0.2rem;
	white-space: pre-wrap;
}

textarea {
	width: 100%;
	height: 8rem;
	border: 0.1rem solid var(--color-primary-mid);
	box-shadow: inset 0 0 0 0.1rem transparent;
}

textarea:focus {
	border-color: var(--color-accent);
	box-shadow: inset 0 0 0 0.1rem var(--color-accent);
}

button {
	position: relative;
	display: block;
	margin: var(--double-gap) auto calc(var(--double-gap) + 0.2rem) auto;
}

button::before, button::after {
	content: '↓';
	margin: 0 var(--shim);
	opacity: 0.9;
}
</style>

<svelte:head>
	<title>Snowcloner</title>
</svelte:head>

<div class="grid">
	<header>
		<h1>make me a snowclone</h1>
	</header>

	<div class="explorer">
		<CorporaPicker2
			{categories}
			on:addToGrammar={e => addToGrammar(e.detail)}
			/>
	</div>

	<div class="compose">
		<div class="grammar">
			<GrammarSummary 
				rawGrammar={$rawGrammar} 
				{corporaTokens}
				on:removeFromGrammar={e => $rawGrammar[e.detail] = undefined}
				/>
		</div>

		<div class="template">
			<h2>Template</h2>
			<textarea
				bind:value={$rawGrammar.$TEMPLATE$[0]}
				spellcheck="false"
				></textarea>
			<button on:click={async () => generated = await clone()}>generate!</button>
		</div>

		<div class="generate">
			<div class="generated">{generated}</div>
		</div>

		<p style="text-align: center"><a href={`?${qs.stringify({$TEMPLATE$: $rawGrammar.$TEMPLATE$[0], ...corporaTokens})}`}>permalink to tokens + template<br>(copy to share)</a></p>
	</div>
</div>