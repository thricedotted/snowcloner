<script>
  import examples from '$lib/examples'
</script>

{#each examples as example}
  {JSON.stringify(example)}
{/each}