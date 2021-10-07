<script>
  export let corpus

  let dataPath = corpus.path
  let data = corpus.data
  
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

    dataPath = corpus.updatePath(dataPath)
    data = corpus.data
  }
</script>

{#each dataPath as { name, options, selected }, i}
  {#if options.length > 1}
    <select
      {name}
      on:change={e => onDataPickerChange(e, i)}
      >

      {#if name === 'filter'}
        <option value="all">all (structured)</option>
      {:else}
        <option value="" disabled selected>Select a {name}</option>
      {/if}

      {#each options as option}
        <option value={option}>{option.replace(/_/g, ' ')}</option>
      {/each}

    </select>

    {#if name === 'key' && selected === '' && i == corpus.path.length - 1}
      ...or <button on:click={e => convertToStructured(e, i)}>convert to structured data</button>
    {/if}
  {/if}
{/each}