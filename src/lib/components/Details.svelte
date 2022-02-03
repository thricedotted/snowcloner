<script>
  export let open = false
</script>

<details {open}>
  <summary><slot name="summary">[Summary]</slot></summary>

  <slot></slot>
</details>

<style>
  details {
    font-size: var(--font-smallest);
    margin-bottom: var(--double-gap);
  }
</style>
