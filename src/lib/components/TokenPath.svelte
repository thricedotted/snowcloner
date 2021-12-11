<script>
  import { createEventDispatcher } from 'svelte'
  import { formatCorpusName } from '$lib/util'

  export let token

  const { f, d } = token

  const dispatch = createEventDispatcher()
</script>

<style>
  button {
    background: unset;
    border: unset;
    box-shadow: unset;
    padding: unset;

    font-size: var(--font-smallest);
    font-weight: normal;

    text-decoration: underline dotted;
    
  }

  button:hover, button:active, button:focus {
    transform: none;
    text-decoration: underline solid;
  }
</style>

{#each f as segment, i}
  {#if i > 0}&nbsp;›&nbsp;{/if}
  <button
    title="Jump to &ldquo;{formatCorpusName(segment)}&rdquo; in corpora explorer"
    on:click={() => dispatch('jumpToCorpus', f.slice(0, i + 1))}
    >
    {formatCorpusName(segment)}
  </button>
{/each}