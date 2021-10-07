<script>
  import Corpus from '../models/Corpus'

  import FilePicker from './FilePicker.svelte'
  import DataPicker from './DataPicker.svelte'

  export let fileTree, filePath = ['']

  let corpus = null

  async function loadCorpus(url) {
    const res = await fetch(url)
    const json = await res.json()

    return new Corpus({
      rawData: json,
      filePath
    })
  }

  $: {
    if (filePath[filePath.length - 1].endsWith('.json')) {
      loadCorpus(`/data/${filePath.join('/')}`).then(c => corpus = c)
    }
    else {
      corpus = null
    }
  }
</script>

<h2>Corpora Explorer</h2>

<FilePicker
  type="category"
  tree={fileTree}
  bind:path={filePath}
/>

{#key corpus}
  {#if corpus}
    <DataPicker 
      {corpus} 
      on:addToGrammar
    />
  {/if}
{/key}
