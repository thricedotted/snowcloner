<script context="module">
import qs from 'qs'
import Corpus from '../models/Corpus'

const defaultGrammar = {
	$TEMPLATE$: '~ #animal.s.capitalize# can have a little #veggie# as a treat ~ #cute#',

	animal: {
		f: ['animals', 'common'],
		d: [{ name: 'key', selected: 'animals' }]
	},

	veggie: {
		f: ['foods', 'vegetables'],
		d: [{ name: 'key', selected: 'vegetables' }]
	},

	cute: {
		f: ['words', 'emoji', 'cute_kaomoji'],
		d: [{ name: 'key', selected: 'cuteKaomoji' }]
	}
}

function encodeObject(object) {
	return btoa(JSON.stringify(object))
}

function decodeObject(object) {
	if (process.browser)
		return JSON.parse(decodeURIComponent(atob(decodeURIComponent(object))))
	else
		return JSON.parse(Buffer.from(object, 'base64').toString())
}

export async function preload(page, session) {
	let query = qs.parse(page.query)
	let preloadGrammar = defaultGrammar

	if (query && query.g) {
		preloadGrammar = decodeObject(query.g)
	}

	const queryGrammar = {}

	const promises = await Promise.all(Object.entries(preloadGrammar).map(async ([k, v]) => {
		if (k === '$TEMPLATE$') return [k, v]
		const { f, d } = v

		const res = await this.fetch(`/corpora/data/${f.join('/')}.json`)
		const json = await res.json()
		
		const corpus = new Corpus({
			rawData: json,
			filePath: f,
			path: d
		})

		return [k, corpus]
	}))

	promises.forEach(([k, v]) => queryGrammar[k] = v)

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
import GrammarSummary from '../components/GrammarSummary.svelte'

export let categories, preloadGrammar = {}, queryGrammar = {}

let generated = ''

const corporaTokens = preloadGrammar

const rawGrammar = writable({
	$TEMPLATE$: [preloadGrammar['$TEMPLATE$'] || 'Hello!'],
	$ORIGIN$: ['#[#$ACTIONS$#]$TEMPLATE$#']
})

Object.entries(queryGrammar).forEach(([name, corpus]) => {
	if (name !== '$TEMPLATE$') {
		addToGrammar({ name, corpus })
	}
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
	g.addModifiers({
		lowercase: s => s.toLowerCase()
	})

	return g
})

function addToGrammar({ name, corpus }) {
	const { filePath, path, data } = corpus

	corporaTokens[name] = { 
		f: filePath,
		d: path.map(({ name, selected }) => ({ name, selected }))
	}

	if (typeof data[0] === 'object') {
		const actionName = `_${name}`
		const mapped = data.map(choice => {
			return Object.entries(choice)
						 .map(([k, v]) => `[${name}-${k}:${v}]`)
						 .join('')
		})

		$rawGrammar[actionName] = mapped
	}

	else {
		$rawGrammar[name] = data
	}
}

function copyToClipboard(e) {
	e.target.focus()
	e.target.select()
	document.execCommand('copy')
}

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

.share {
	font-size: var(--font-smallest);
}

.share input {
	width: 100%;
	user-select: all;
	text-overflow: ellipsis;
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
			{categories}
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
					on:removeFromGrammar={e => $rawGrammar[e.detail] = undefined}
					/>
			</div>

			<textarea
				bind:value={$rawGrammar.$TEMPLATE$[0]}
				spellcheck="false"
				></textarea>

		</div>

		{#if typeof location !== 'undefined'}
			<div class="share">
				<b>Wanna share your snowclone? Copy the link below!</b><br>
				<input 
					on:click={copyToClipboard}
					readonly 
					value={`${location.origin}?${qs.stringify({g: encodeObject({...corporaTokens, $TEMPLATE$: $rawGrammar.$TEMPLATE$[0]})})}`}
					>
			</div>
		{/if}
	</div>
</div>