<script>
  import examples from '$lib/examples'

  import Details from '$lib/components/Details.svelte'
  import ConfirmButton from '$lib/components/ConfirmButton.svelte'
  import SnowcloneLoader from '$lib/components/SnowcloneLoader.svelte'

  export let snowcloneStore

  // $: console.log($snowcloneStore)
</script>

<Details>
  <h2 slot="summary">Saved Snowclones + Examples</h2>

  <div class="content">
    <h3>Saved Snowclones</h3>

    <p>
      These snowclones are saved locally in your browser.
    </p>

    <ul>
    {#each $snowcloneStore as snowclone, i (snowclone.id)}
      <li>
        <SnowcloneLoader
          {snowclone}
          on:loadTokens
        />

        <ConfirmButton 
          let:confirming
          title="Delete &ldquo;{snowclone.name}&rdquo;"
          on:confirm={() => snowcloneStore.remove(i)}
          >{confirming ? 'delete?' : '×'}
        </ConfirmButton>
      </li>

    {:else}
      <p>You don't have any saved snowclones!</p>
    {/each}
    </ul>

    <h3>Examples</h3>

    <p>
      Need some inspiration? Check out these examples!
    </p>

    <ul>
    {#each examples as snowclone}
      <li>
        <SnowcloneLoader
          {snowclone}
          on:loadTokens
        />
      </li>
    {/each}
    </ul>

  </div>

</Details>

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

  h3:not(:first-of-type) {
    margin-top: var(--double-gap);
  }

  ul {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: var(--gap);
    list-style: square inside;
    /* columns: 16em; */
  }

  li {
    margin: var(--gap) 0;
  }

  li::marker {
    color: var(--color-primary-mid);
  }
</style>
