<script>
  import { createEventDispatcher } from 'svelte' 

  import SmallButton from '$lib/components/SmallButton.svelte'

  export let snowcloneStore
  export let corporaTokens, template

  const dispatch = createEventDispatcher()

  function resetSnowclone() {
    if (confirm('Clear the template and grammar for this snowclone?')) {
      dispatch('reset')
    }
  }

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

</script>

<div class="actions">
  <SmallButton
    on:click={addSnowclone}
    >save current snowclone
  </SmallButton>

  <SmallButton
    on:click={resetSnowclone}
    style="background: var(--color-accent) !important;"
    >reset
  </SmallButton>
</div>