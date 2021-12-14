<script>
  import { createEventDispatcher } from 'svelte'

  export let title
  export let defaultText, confirmText
  export let style

  let confirming = false

  const dispatch = createEventDispatcher()

  $: buttonText = confirming ? confirmText : defaultText

  function confirmOrDelete() {
    if (!confirming) {
      confirming = true
    }

    else {
      confirming = false
      dispatch('confirm')
    }
  }
</script>

<style>
  button {
    font-size: var(--font-smallest);
    padding: 0 var(--shim);
    margin: 0;
    border: 0;
    background: none;
    box-shadow: none;
    color: var(--color-accent);
    border-radius: 0.2rem;
    font-weight: bold;
  }

  button:hover, button:focus, .confirming {
    transform: none;
    background: var(--color-accent);
    color: var(--color-bg);
  }
</style>

<svelte:body
  on:click={() => confirming = false}
/>

<button 
  {style}
  {title}
  class:confirming
  on:click|stopPropagation={confirmOrDelete}
  >{buttonText}
</button>