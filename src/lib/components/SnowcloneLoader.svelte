<script>
  import { createEventDispatcher } from 'svelte'

  export let snowclone

  const dispatch = createEventDispatcher()
</script>

<button 
  class="linklike" 
  title="Load &ldquo;{snowclone.name}&rdquo; into the editor"
  on:click={() => dispatch('loadTokens', snowclone.data)}
  >{snowclone.name}
</button>