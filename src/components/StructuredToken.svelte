<script>
export let token

function formatToken(t) {
  return typeof t === 'object' ? JSON.stringify(t) : t
}
</script>

<style>
:global(.token-property .token-property) {
  padding-left: 1rem;
}
</style>

{#if Array.isArray(token)}
  {token.map(formatToken).join(', ')}<br>
{:else}
  <div class="token-property">
  {#each Object.entries(token) as [key, value]}
    {#if typeof value === 'object'}
      <b>{key}</b>&nbsp;<svelte:self token={value} />
    {:else}
      <b>{key}</b>&nbsp;{value}<br>
    {/if}
  {/each}
  </div>
{/if}