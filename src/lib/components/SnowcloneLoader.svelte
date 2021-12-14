<script>
  import { createEventDispatcher } from 'svelte'

  export let snowclone

  const dispatch = createEventDispatcher()
</script>

<button 
  class="linklike" 
  on:click={() => dispatch('loadTokens', snowclone.data)}
  >{snowclone.name}
</button>