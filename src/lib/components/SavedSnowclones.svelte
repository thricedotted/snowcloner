<script>
  import { onMount } from 'svelte'

  import examples from '$lib/examples'
  import { snowcloneStore } from '$lib/stores'

  import Details from '$lib/components/Details.svelte'
  import ConfirmButton from '$lib/components/ConfirmButton.svelte'
  import SmallButton from '$lib/components/SmallButton.svelte'
  import SnowcloneLoader from '$lib/components/SnowcloneLoader.svelte'

  export let corporaTokens, template

  onMount(async () => await snowcloneStore.initialize())

  async function addSnowclone() {
    const name = prompt('Name your snowclone!', `Snowclone #${$snowcloneStore.length + 1}`)

    if (name) {
      const data = {
        ...corporaTokens,
        $TEMPLATE$: template
      }

      await snowcloneStore.add({ name, data })
    }
  }

  async function removeSnowclone(i) {
    await snowcloneStore.remove(i)
  }

  // $: console.log($snowcloneStore)
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

<Details>
  <h2 slot="summary">Saved Snowclones + Examples</h2>

  <div class="content">
    <h3>Saved Snowclones</h3>

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
          on:confirm={() => removeSnowclone(i)}
          >{confirming ? 'delete?' : '×'}
        </ConfirmButton>
      </li>

    {:else}
      <p>You don't have any saved snowclones!</p>
    {/each}
    </ul>

    <SmallButton
      on:click={addSnowclone}
      >save current snowclone
    </SmallButton>

    <h3>Examples</h3>

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
