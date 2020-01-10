<script>
import { createEventDispatcher } from 'svelte'

import Corpus from '../models/Corpus'

import Picker from './Picker.svelte'
import CorpusSummary from './CorpusSummary.svelte'

const dispatch = createEventDispatcher()

export let categories = []

let name = '', detailsOpen = true

let filePath = [
  {
    name: 'category',
    options: categories,
    selected: ''
  }
]

let dataPath = [], data = []

let corpus = null

async function onFilePickerChange(e, pickerIndex) {
  const selected = e.target.value
  filePath[pickerIndex].selected = selected
  filePath = filePath.slice(0, pickerIndex + 1)

  dataPath = [], data = []

  const path = filePath.map(x => x.selected).join('/')
  const res = await fetch(`/corpora/data/${path}.json`)
  const json = await res.json()

  if (Array.isArray(json) && json[0].hasOwnProperty('isDirectory')) {
    filePath = [...filePath, {
      name: 'subcategory',
      options: json.map(x => x.name),
      selected: ''
    }]

    corpus = null
  } 

  else {
    corpus = new Corpus({
      rawData: json,
      filePath: filePath.map(x => x.selected),
    })

    dataPath = corpus.path
    data = corpus.data
  }
}

function onDataPickerChange(e, pickerIndex) {
  const selected = e.target.value

  dataPath[pickerIndex].selected = selected
  dataPath = dataPath.slice(0, pickerIndex + 1)

  dataPath = corpus.updatePath(dataPath)
  data = corpus.data
}

function convertToStructured(e, pickerIndex) {
  dataPath = dataPath.slice(0, pickerIndex + 1)
  dataPath[pickerIndex] = {
    name: 'filter',
    options: [],
    selected: 'all'
  }

  console.log('path before', dataPath)
  console.log('data before', data)

  dataPath = corpus.updatePath(dataPath)
  data = corpus.data

  console.log('path after', dataPath)
  console.log('data after', data)
}

function addToGrammar(e) {
  name = name ? name : corpus.placeholder || prompt('What are you calling this token?')

  if (name) {
    dispatch('addToGrammar', { name, corpus })
    name = ''
  }
}
</script>

<style>
.description {
  font-style: italic;
  overflow-wrap: anywhere;
  margin: var(--gap) 0;
  font-size: var(--font-smaller);
}

.add-to-grammar {
  display: flex;
  flex-basis: 1 1 auto;
  margin: var(--gap) 0;
}

.add-to-grammar input {
  min-width: 6rem;
  margin-right: var(--gap);
  background: var(--color-bg);
  border: 0.1rem solid var(--color-primary-mid);
  border-radius: 0.2rem;
  padding: var(--shim) var(--gap);
}

.add-to-grammar input:focus {
  border-color: var(--color-primary-dark);
}
</style>

<h2>Corpora Explorer</h2>

{#each filePath as { name, options, selected }, i}
  <Picker
    {name}
    {selected}
    on:change={e => onFilePickerChange(e, i)}
    >
    {#each options as option}
      <option value={option}>{option.replace(/_/g, ' ')}</option>
    {/each}
  </Picker>
{/each}

{#each dataPath as { name, options, selected }, i}
  {#if options.length > 1}
    <Picker
      {name}
      {selected}
      on:change={e => onDataPickerChange(e, i)}
      includePlaceholder={name !== 'filter'}
      >
      {#if name === 'filter'}
        <option value='all'>all (structured)</option>
      {/if}
      {#each options as option}
        <option value={option}>{option.replace(/_/g, ' ')}</option>
      {/each}
    </Picker>

    {#if name === 'key' && selected === '' && i == corpus.path.length - 1}
      ...or <button on:click={e => convertToStructured(e, i)}>convert to structured data</button>
    {/if}
  {/if}
{/each}

{#if corpus}
  <div class="description">
    {#if corpus.description}
      {corpus.description}
    {/if}

    {#if corpus.source}
      {@html corpus.description ? '<br>' : ''}
      {#if corpus.source.startsWith('http')}
        <a href={corpus.source}>{corpus.source}</a>
      {:else}
        {corpus.source}
      {/if}
    {/if}
  </div>

  {#if data.length > 0}
    <form class="add-to-grammar" on:submit|preventDefault={addToGrammar}>
      <input
        placeholder={corpus.placeholder}
        bind:value={name}
        >

      <button type="submit">add&nbsp;token</button>
    </form>

    <div class="summary">
      <CorpusSummary
        data={data}
        bind:open={detailsOpen}
        />
    </div>
  {/if}
{/if}