<script>
  import { createEventDispatcher } from 'svelte'

  import DataSummary from './DataSummary.svelte'

  export let corpus, data

  let name = ''

  const dispatch = createEventDispatcher()

  function sanitizeTokenName(s) {
    return s.replace(/\./g, '-')
            .replace(/\#/g, '')
            .replace(/^_+/, '')
  }

  function addToGrammar() {
    name = name ? name : corpus.placeholder || prompt('What are you calling this token?')

    if (name) {
      // . is a special character in Tracery -- can't allow it in token names
      dispatch('addToGrammar', { 
        name: sanitizeTokenName(name), 
        corpus 
      })
      name = ''
    }
  }

  function embedLink(s) {
    try {
      return s.replace(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 
        `<a href="$&">$&</a>`
      )
    } 
    catch {
      return s
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

  .description :global(a) {
    text-decoration: underline;
    box-shadow: none;
  }

  .description :global(a:hover), 
  .description :global(a:focus), 
  .description :global(a:active) {
    text-decoration-color: var(--color-accent);
  }
</style>

<div class="description">
  {#if corpus.description}
    {@html embedLink(corpus.description)}
  {/if}

  {#if corpus.source}
    {@html embedLink(corpus.description) ? '<br>' : ''}
    {@html embedLink(corpus.source)}
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