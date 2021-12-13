<script>
  import Details from '$lib/components/Details.svelte'
  import SavedSnowcloneList from '$lib/components/SavedSnowcloneList.svelte'

  import examples from '$lib/examples'
</script>

<style>
  .content {
    background: var(--color-bg);
    padding: var(--double-gap);
    border-radius: 0.2rem;
    margin-top: var(--gap);
  }

  h3 {
    margin: 0;
  }
</style>

<Details>
  <h2 slot="summary">Saved Snowclones + Examples</h2>

  <div class="content">
    <h3>Saved Snowclones</h3>
    <p>You don't have any saved snowclones!</p>

    <h3>Examples</h3>

    <SavedSnowcloneList
      savedSnowclones={examples}
      on:loadTokens
    />
  </div>

</Details>
