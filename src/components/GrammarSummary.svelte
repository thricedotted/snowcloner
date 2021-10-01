<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let rawGrammar, corporaTokens

  let showDetails = false

  function extractSubkeys(value) {
    return value.match(/\[.+?:/g).map(s => `<b>#${s.slice(1, -1)}#</b>`)
  }

  function removeFromGrammar(key) {
    dispatch('removeFromGrammar', key) 
  }

  function formatCorporaLocation({ f, d }) {
    const j = ' › '
    // return [f.join(j), d.map(x => x.selected).join(j)].join(j)
    return f.join(j)
  }

  $: entries = Object.entries(rawGrammar).filter(([k, v]) => !/^\$[A-Z]+\$$/.test(k))
</script>

<style>
ul {
  margin: var(--shim) 0;
  padding: 0;
  list-style: none;
}

li {
  display: inline-block;
  margin: 0 var(--shim);
  padding: 0 var(--shim);
  border-radius: 0.2rem;
  /* max-height: 3rem; */
  overflow: auto;

  font-size: var(--font-smallest);
  border: 0.1rem solid currentColor;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

summary h2 {
  display: inline-block;
  margin: 0;
}

button {
  font-size: var(--font-smallest);
  padding: 0 var(--shim);
  margin: 0;
  border: 0;
  background: none;
  box-shadow: none;
  color: var(--color-accent);
}

button:hover, button:focus {
  transform: none;
  color: var(--color-primary-mid);
}

.empty-grammar::before {
  content: '← ';
}

@media screen and (max-width: 40rem) {
  .empty-grammar::before {
    content: '↑ ';
  }
}
</style>

<details open>
<summary><h2>Grammar</h2> ({entries.length})</summary>

{#if entries.length == 0}
  <p class="empty-grammar">Add tokens using the <b>corpora explorer</b>!</p>
{:else}
  <label>
    <input type="checkbox" bind:checked={showDetails}>
    Show corpus location?
  </label>
  <ul>
    {#each entries as [key, value]}
        <li>
          <button aria-label="Remove {key} from grammar" on:click={() => removeFromGrammar(key)}>×</button>
          {#if key.startsWith('_')}
            {@html extractSubkeys(value[0]).join(', ')} ({value.length})
          {:else}
            <b>#{key}#</b> ({value.length})
          {/if}

          {#if showDetails}
          <span class="location">
            {formatCorporaLocation(corporaTokens[key.startsWith('_') ? key.slice(1) : key])}
          </span>
          {/if}
        </li>
    {/each}
  </ul>
{/if}
</details>
