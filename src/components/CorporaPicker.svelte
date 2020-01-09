<script>
import { createEventDispatcher } from 'svelte'

import Picker from './Picker.svelte'
import CorpusSummary from './CorpusSummary.svelte'

export let categories

const dispatch = createEventDispatcher()

const selected = {
  category: '',
  subcategoryOrFile: '',
  file: '',
  key: '',
  objectKey: ''
}

let subcategories = [], files = [], fileData = {}
let name = ''
let detailsOpen = true

$: keys = Array.isArray(fileData) ? [] : filterDataKeys(fileData)
$: placeholder = selected.objectKey && selected.objectKey != 'all' ? `${selected.key}-${selected.objectKey}` : selected.key
$: corpus = getCorpus(fileData, selected.key)
$: filteredCorpus = selected.objectKey && selected.objectKey !== 'all'
                    ? corpus.filter(x => x[selected.objectKey]).flatMap(x => x[selected.objectKey]) 
                    : corpus

function getCorpus(data, key) {
  // TODO: ok there's some real slop one out stuff going on here.
  // the `key` arg is never used directly.
  // it is there so that this function updates reactively.
  // that is the only reason. :|
  let processed = []

  if (Array.isArray(data)) {
    processed = data
  }

  else if (filterDataKeys(data).length == 1) {
    selected.key = filterDataKeys(data)[0]
  }

  if (selected.key) {
    const keyedData = fileData[selected.key]

    if (Array.isArray(keyedData)) {
      processed = keyedData
    }

    else if (keyedData) {
      if (Object.entries(keyedData).every(x => Array.isArray(x))) {
        console.log('hi', keyedData)
      }

      const objToArray = []
      Object.entries(keyedData).forEach(([k, v]) => {
        objToArray.push({id: k, ...v})
      })
      processed = objToArray
    }
  }

  return processed
}

async function onCategoryChange(e) {
	const data = await fetch(`/corpora/data/${selected.category}.json`)
  subcategories = await data.json()

	selected.subcategoryOrFile = ''
  selected.file = ''
  selected.key = ''
  selected.objectKey = ''
  files = []
	fileData = {}
}

async function onSubcategoryChange(e) {
  const { category, subcategoryOrFile } = selected
  const isSubcategory = subcategoryOrFile.endsWith('/')
  const path = isSubcategory ? subcategoryOrFile.slice(0, -1) : subcategoryOrFile

  const data = await fetch(`/corpora/data/${category}/${path}.json`)
  const contents = await data.json()

  if (isSubcategory) {
    files = contents
    fileData = {}
    selected.key = ''
    selected.objectKey = ''
  }

  else {
    fileData = contents
    files = []
    selected.objectKey = 'all'

    const keys = Array.isArray(fileData) ? [] : filterDataKeys(fileData)
    if (keys.length == 1) {
      selected.key = keys[0]
    }
  }
}

async function onFileChange(e) {
  const { category, subcategoryOrFile, file } = selected
  const data = await fetch(`/corpora/data/${category}/${subcategoryOrFile}${file}.json`)
  fileData  = await data.json()
  selected.objectKey = 'all'
}

function filterDataKeys(data) {
	return Object.keys(data).filter(k => k.toLowerCase() !== 'source' && k.toLowerCase() !== 'description')
}

function addToGrammar() {
  const key = keys.length == 1 ? keys[0] : selected.key
  name = name ? name : placeholder || prompt('What are you calling this token?')

  if (name) {
    dispatch('addToGrammar', { 
      name: name.replace(/#/g, ''), 
      selected: {...selected, key}, 
      corpus: filteredCorpus 
    })
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
}
</style>

<div class="corpora-picker">

  <h2>Corpora Explorer</h2>

  <div class="selectors">
    <Picker
      name="category"
      bind:selected={selected.category}
      on:change={onCategoryChange}
      >
      {#each categories as name}
        <option value={name}>{name.split('_').join(' ')}</option>
      {/each}
    </Picker>

    {#if subcategories.length > 0}
      <!-- &#10093;  -->
      <Picker
        name="subcategory"
        bind:selected={selected.subcategoryOrFile}
        on:change={onSubcategoryChange}
        >

        {#each subcategories as { name, isDirectory }}
          <option value={`${name}${isDirectory ? '/' : ''}`}>{name.split('_').join(' ')}</option>
        {/each}
      </Picker>
    {/if}

    {#if files.length > 0}
      <!-- &#10093;  -->
      <Picker
        name="file"
        bind:selected={selected.file}
        on:change={onFileChange}
        >

        {#each files as { name, isDirectory }}
          <option value={name}>{name.split('_').join(' ')}</option>
        {/each}
      </Picker>
    {/if}

    {#if keys.length > 1}
      <!-- &#10093;  -->
      <Picker
        name="key"
        bind:selected={selected.key}
        >
        {#each keys as key}
          <option value={key}>{key}</option>
        {/each}
      </Picker>
    {/if}

    {#if corpus.length > 0 && typeof corpus[0] !== 'string' && Object.keys(corpus[0]).length > 1}
      <Picker
        name="object-key"
        bind:selected={selected.objectKey}
        includePlaceholder={false}
        >
        <option value="all" selected>all (structured)</option>
        {#each Object.keys(corpus[0]) as key}
          <option value={key}>{key}</option>
        {/each}
      </Picker>
    {/if}

  </div>

  <div class="description">
    {#if fileData.description}
      {fileData.description}
    {:else if fileData.Description}
      {fileData.Description}
    {/if}

    {#if fileData.source}
      {@html fileData.description || fileData.Description ? '<br>' : ''}
      {#if fileData.source.startsWith('http')}
      <a href={fileData.source}>{fileData.source}</a>
      {:else}
      {fileData.source}
      {/if}
    {/if}
  </div>

  {#if filteredCorpus.length > 0}
    <form class="add-to-grammar" on:submit|preventDefault={addToGrammar}>
      <input
        {placeholder}
        bind:value={name}
        >

      <button type="submit">add&nbsp;token</button>
    </form>

    <div class="summary">
      <CorpusSummary
        data={filteredCorpus}
        bind:open={detailsOpen}
        />
    </div>
  {/if}

</div>