<script>
  export let style = undefined
</script>

<button
  {style}
  on:click
  ><slot></slot>
</button>

<style>
  button {
    border: 0;
    border-radius: 0.2rem;
    box-shadow: none;

    background: var(--color-primary-dark);
    color: var(--color-bg);

    font-size: var(--font-smallest);

    transform: none;
  }

  button:hover, button:focus {
    background: var(--color-primary-mid);
    color: var(--color-fg);
  }
</style>
