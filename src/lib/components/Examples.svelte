<script>
  import { createEventDispatcher } from 'svelte' 

  import examples from '$lib/examples'

  const dispatch = createEventDispatcher()
</script>

{#each examples as example}
  <button on:click={() => dispatch('loadTokens', example.data)}>
    load {example.name}
  </button>
{/each}

<button on:click={() => dispatch('logTokens')}>log tokens</button>