<script>
  import { createEventDispatcher } from 'svelte'

  import DataSummary from './DataSummary.svelte'

  export let corpus, data

  let name = ''

  const dispatch = createEventDispatcher()

  function addToGrammar() {
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
  <form 
    class="add-to-grammar" 
    on:submit|preventDefault={addToGrammar}
    >
    <input
      placeholder={corpus.placeholder}
      bind:value={name}
      >
    <button type="submit">add&nbsp;token</button>
  </form>

  <DataSummary {data} />
{/if}