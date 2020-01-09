<script>
import StructuredToken from './StructuredToken.svelte'

export let data, open
</script>

<style>
ul {
  margin: var(--gap) 0;
  padding: 0;
}

@media screen and (max-width: 40rem) {
  ul {
    max-height: 50vh;
    overflow: auto;
  }
}

li {
  display: inline-block;
  padding: 0 var(--shim);
  border-radius: 0.2rem;
  margin: var(--shim);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
  background: var(--color-fg);
  color: var(--color-primary-light);
}
</style>

<details bind:open>
  <summary>{data.length} items</summary>
  <ul>
    {#each data as item}
    <li>
      {#if typeof item !== 'object'}
        {item}
      {:else}
        <StructuredToken token={item} />
      {/if}
    </li>
    {/each}
  </ul>
</details>
