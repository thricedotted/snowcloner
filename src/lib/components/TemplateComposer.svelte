<script>
  import { onMount } from 'svelte'

  export let template
  
  let textarea, resizeObserver

  function resizeTextarea() {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  onMount(
    () => {
      resizeObserver = new ResizeObserver(resizeTextarea)
      resizeObserver.observe(textarea.parentElement)
    }, 

    () => resizeObserver.disconnect()
  )
</script>

<style>
  textarea {
    width: 100%;
    min-height: 6rem;
    border: 0.1rem solid var(--color-primary-mid);
    border-radius: 0.2rem 0.2rem 0 0;
    border-bottom-color: var(--color-primary-dark);
    box-shadow: inset 0 0 0 0.1rem transparent;
    overflow-y: hidden;
    resize: none;
  }

  textarea:focus {
    border-color: var(--color-accent);
    box-shadow: inset 0 0 0 0.1rem var(--color-accent);
  }
</style>

<textarea
  bind:this={textarea}
  bind:value={template}
  on:input={resizeTextarea}
  spellcheck="false"
></textarea>
