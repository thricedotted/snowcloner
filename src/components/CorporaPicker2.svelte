<script>
import { createEventDispatcher } from 'svelte'

import Picker from './Picker.svelte'
import CorpusSummary from './CorpusSummary.svelte'

export let categories = []

let name = '', detailsOpen = true

let filePath = [
  {
    name: 'category',
    options: categories,
    selected: ''
  }
]

let corpus = {
  description: '',
  source: '',
  rawData: [],
  path: [],
  data: [],

  get placeholder() {
    const sel = this.path.filter(x => x.selected && x.selected !== 'all')
    return (sel.length > 0 ? sel[0] : filePath.slice(-1)[0]).selected
  },

  _processObj(d, pathIdx) {
    let data = d

    const dataKeys = filterDataKeys(d)

    const entries = Object.entries(d).filter(([k, v]) => dataKeys.includes(k))

    const childTypes = new Set(entries.map(([k, v]) => Array.isArray(v) ? 'array' : typeof v))
    const grandchildTypes = new Set(entries.flatMap(([k, v]) => v).map(v => Array.isArray(v) ? 'array' : typeof v))

    // console.log(childTypes, grandchildTypes)

    let sharedStructure = false

    if (childTypes.size == 1 && childTypes.has('object')) {
      const keys = entries.map(([k, v]) => Object.keys(v))

      for (let i = 1; i < keys.length; i++) {
        const keyset = keys[i]
        const prevKeyset = keys[i-1]
        const [ longerKeyset, shorterKeyset ] = keyset.length > prevKeyset.length 
                                                ? [ keyset, prevKeyset ] : [ prevKeyset, keyset ]

        sharedStructure = true
        for (let k of shorterKeyset) {
          if (!longerKeyset.includes(k)) {
            sharedStructure = false
            break
          }
        }

        if (!sharedStructure) {
          break
        }
      }
    }

    // console.log(sharedStructure, grandchildTypes)

    if (sharedStructure || (this.path[pathIdx + 1] && this.path[pathIdx + 1].name === 'filter')) {
      data = entries.reduce((arr, [id, etc]) => {
        if (typeof etc === 'object' && !Array.isArray(etc)) {
          return [...arr, { id, ...etc }]
        }
        else {
          return [...arr, { id, data: etc }]
        }
      }, [])
    }
    // else if (grandchildTypes.size == 1 && grandchildTypes.has('string')) {
    //   console.log('ughhh!!!')
    // }

    return data
  },

  updateData() {
    let d = this.rawData

    if (this.path.length > 0 && this.path[0].name === 'filter') {
      d = this._processObj(d, 0)
    }

    this.path.forEach(({ name, options, selected }, i) => {
      if (name === 'key' && selected) {
        d = d[selected]
      }

      else if (name === 'filter' && selected && selected != 'all') {
        d = d.flatMap(x => x[selected]).filter(x => x)
      }

      // postprocess non-array data
      if (!Array.isArray(d)) {
        d = this._processObj(d, i)
      }

    })

    while (!Array.isArray(d) && typeof d === 'object') {
      const dataKeys = filterDataKeys(d)

      if (dataKeys.length == 1) {
        this.path = [...this.path, {
          name: 'key',
          options: dataKeys,
          selected: dataKeys[0]
        }]

        d = d[dataKeys[0]]
      }

      else if (dataKeys.length > 1) {
        const data = this._processObj(d)

        if (data != d) {
          d = data
        }

        else {
          this.path = [...this.path, {
            name: 'key',
            options: dataKeys,
            selected: '',
          }]

          break
        }
      }
      else {
        // this is some weird empty object. let's heck out of here.
        d = ['(empty data)']
      }
    }

    // update path from data 
    if (Array.isArray(d)) {
      const item = d[0]
      const keys = [...new Set(Object.values(d).flatMap(v => typeof v === 'object' ? Object.keys(v) : []))]

      const lastPicker = this.path.length > 0 ? this.path.slice(-1)[0] : {}

      if (lastPicker.name === 'filter' && lastPicker.options.length == 0) {
        this.path[this.path.length - 1] = {
          name: 'filter',
          options: keys,
          selected: 'all',
        }
      }

      else if (!Array.isArray(item) && typeof item === 'object' && lastPicker.selected !== 'all') {
        this.path = [...this.path, {
          name: 'filter',
          options: keys,
          selected: 'all'
        }]
      }

    }

    this.data = d
  },

  reset() {
    this.description = ''
    this.source = ''
    this.rawData = []
    this.path = []
    this.data = []
  }
}

function filterDataKeys(data) {
	return Object.keys(data).filter(k => {
    return ['source', 'sources', 'description', 'license'].every(n => k.toLowerCase() !== n)
  })
}

async function onFilePickerChange(e, pickerIndex) {
  const selected = e.target.value

  filePath[pickerIndex].selected = selected
  filePath = filePath.slice(0, pickerIndex + 1)

  corpus.reset()
  corpus.path = []

  const path = filePath.map(x => x.selected).join('/')
  const res = await fetch(`/corpora/data/${path}.json`)
  const data = await res.json()

  if (Array.isArray(data) && data[0].hasOwnProperty('isDirectory')) {
    filePath = [...filePath, {
      name: 'subcategory',
      options: data.map(x => x.name),
      selected: ''
    }]
  }

  else {

    corpus.description = data.description || data.Description
    corpus.source = data.source
    corpus.rawData = data

    corpus.updateData()
  }
}

function onDataPickerChange(e, pickerIndex) {
  const selected = e.target.value

  // console.log(selected)

  corpus.path[pickerIndex].selected = selected
  corpus.path = corpus.path.slice(0, pickerIndex + 1)

  // console.log(corpus.path)

  corpus.updateData()

  // console.log(corpus.data)
}

function togglePicker(e, pickerIndex) {
  const oldPicker = corpus.path[pickerIndex]

  corpus.path = corpus.path.slice(0, pickerIndex + 1)

  corpus.path[pickerIndex] = {
    name: 'filter',
    options: [],
    selected: 'all'
  }

  corpus.updateData()
}

function addToGrammar(e) {

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

{#each corpus.path as { name, options, selected }, i}
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
      ...or <button on:click={e => togglePicker(e, i)}>convert to structured data</button>
    {/if}

  {/if}
{/each}

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


{#if corpus.data.length > 0}

  <form class="add-to-grammar" on:submit|preventDefault={addToGrammar}>
    <input
      placeholder={corpus.placeholder}
      bind:value={name}
      >

    <button type="submit">add&nbsp;token</button>
  </form>

  <div class="summary">
    <CorpusSummary
      data={corpus.data}
      bind:open={detailsOpen}
      />
  </div>
{/if}