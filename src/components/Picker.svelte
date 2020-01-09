<script>
export let name, selected, includePlaceholder = true
</script>

<style>
select {
  width: 100%;
}
</style>

<div class="picker">
  <!-- <label for={name}>{name}</label> -->

  <select
    id={name}
    name={name}
    bind:value={selected}
    required
    on:change
    >

    {#if includePlaceholder}
    <option value="" disabled selected>Select a {name}...</option>
    {/if}

    <slot></slot>

  </select>
</div>