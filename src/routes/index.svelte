<script context="module">
	import qs from 'qs'

	import { browser } from '$app/env'

	import examples from '$lib/examples'
	import Corpus from '$lib/models/Corpus'

	const defaultTokens = examples[0].data

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

	async function loadCorpus(key, paths, fetch) {
		const { f, d } = paths

		const res = await fetch(`/data/${f.join('/')}`)
		const json = await res.json()

		const corpus = new Corpus({
			rawData: json,
			filePath: f,
			path: d
		})

		return [key, corpus]
	}

	async function loadCorpora(corporaTokens, fetch) {
		const rawGrammar = {}

		const promises = await Promise.all(Object.entries(corporaTokens).map(async ([k, v]) => {
			if (k === '$TEMPLATE$') return [k, v]

			return await loadCorpus(k, v, fetch)
		}))

		promises.forEach(([k, v]) => rawGrammar[k] = v)

		return rawGrammar
	}

	export async function load({ page, fetch }) {
		const { query } = page

		const corporaTokens = decodeObject(query.get('g')) || defaultTokens

		const initialGrammar = await loadCorpora(corporaTokens, fetch)

		const fileTree = await fetch('/data/index.json').then(data => data.json())

		return {
			props: { 
				fileTree,
				corporaTokens, 
				initialGrammar 
			}
		}
	}
</script>

<script>
import tracery from 'tracery-grammar'

import { onMount, tick } from 'svelte'
import { writable, derived } from 'svelte/store'
import { page } from '$app/stores'

import CorporaPicker from '$lib/components/CorporaPicker.svelte'
import GrammarSummary from '$lib/components/GrammarSummary.svelte'
import ShareSnowclone from '$lib/components/ShareSnowclone.svelte'
import Examples from '$lib/components/Examples.svelte'

export let corporaTokens
export let initialGrammar = {}
export let fileTree, filePath = ['']

let generated = ''

const rawGrammar = writable({})

function setupRawGrammar(newGrammar) {
	$rawGrammar = {
		$TEMPLATE$: [newGrammar['$TEMPLATE$'] || 'Hello!'],
		$ORIGIN$: ['#[#$ACTIONS$#]$TEMPLATE$#']
	}

	Object.entries(newGrammar).forEach(([name, corpus]) => {
		if (name !== '$TEMPLATE$') {
			addToGrammar({ name, corpus })
		}
	})
}

setupRawGrammar(initialGrammar)

const grammar = derived(rawGrammar, $rawGrammar => {
	// clean out any keys that have been removed
	Object.keys($rawGrammar).forEach(k => {
		if ($rawGrammar[k] === undefined) {
			delete $rawGrammar[k]
		}
	})

	const actionKeys = Object.keys($rawGrammar)
										 .filter(k => k.startsWith('_'))
										 .map(k => `[#${k}#]`)

	const g = tracery.createGrammar({
		...$rawGrammar,
		$ACTIONS$: [actionKeys.join('')]
	})

	g.addModifiers({
		...tracery.baseEngModifiers,
		lowercase: s => s.toLowerCase(),
		uppercase: s => s.toUpperCase(),
		formatNumber: s => isNaN(s) ? s : parseInt(s).toLocaleString()
	})

	return g
})

function addToGrammar({ name, corpus }) {
	const { filePath, path, data } = corpus

	// we have to clone these arrays, or they will point to corpus refs that will change!
	corporaTokens[name] = { 
		f: [...filePath],
		d: [...path]
	}

	const flattenStructured = (o, keyName) => {
		let flattenedObject = {}

		const _flatten = (obj, keyName) => {
			Object.keys(obj).forEach(key => {
				const newKey = `${keyName}-${key}` 
				if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
					_flatten(obj[key], newKey);
				} else {
					flattenedObject[newKey] = obj[key];
				}
			})
		}

		_flatten(o, keyName)

		return flattenedObject
	}

	if (typeof data[0] === 'object') {
		const actionName = `_${name}`
		const mapped = data.map(choice => {
			return Object.entries(flattenStructured(choice, name))
						 .map(([k, v]) => `[${k}:${v}]`)
						 .join('')
		})

		$rawGrammar[actionName] = mapped
	}

	else {
		$rawGrammar[name] = data
	}
}

function removeFromGrammar(key) {
	// using "delete" doesn't trigger reactivity. setting to undefined does. 
	$rawGrammar[key] = undefined
	delete corporaTokens[key]
}

async function loadFromTokens(tokens) {
	corporaTokens = tokens
	initialGrammar = await loadCorpora(corporaTokens, fetch)
	setupRawGrammar(initialGrammar)
	generated = await clone()
}

$: shareUrl = `${$page.host}?${qs.stringify({g: encodeObject({...corporaTokens, $TEMPLATE$: $rawGrammar.$TEMPLATE$[0]})})}`

async function clone() {
	await tick()
	return $grammar.flatten('#$ORIGIN$#')
}

onMount(async () => {
	generated = await clone()
})
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

.compose > :global(*) {
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
	padding: 1rem 1rem 0 1rem;
	border-radius: 0.2rem;
}

.generated {
	white-space: pre-wrap;
}

.editor {
	margin-top: calc(3 * var(--double-gap));
}

.editor::before {
	content: ' ';
	font-size: 1.2rem;
	position: relative;
	display: block;
	width: 100%;
	text-align: center;
	margin: auto;
	border: 1px dashed var(--color-primary-dark);
	margin-bottom: calc(2 * var(--double-gap));
	opacity: 0.5;
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
	margin: auto;
	top: 1rem;
	padding: var(--shim) var(--double-gap);
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
		<CorporaPicker
			{fileTree}
			bind:filePath
			on:addToGrammar={e => addToGrammar(e.detail)}
			/>
	</div>

	<div class="compose">
		<div class="generate">
			<div class="generated">{generated}</div>
			<button on:click={async () => generated = await clone()}>generate!</button>
		</div>

		<div class="editor">
			<div class="grammar">
				<GrammarSummary 
					rawGrammar={$rawGrammar} 
					{corporaTokens}
					on:removeFromGrammar={e => removeFromGrammar(e.detail)}
					on:jumpToCorpus={e => filePath = e.detail}
					/>
			</div>

			<textarea
				bind:value={$rawGrammar.$TEMPLATE$[0]}
				spellcheck="false"
				></textarea>
		</div>

		<ShareSnowclone {shareUrl} />

		<Examples 
			on:logTokens={() => console.log(corporaTokens)}
			on:loadTokens={e => loadFromTokens(e.detail)}
		/>

	</div>
</div>