<script>
  import { onMount } from "svelte"

  export let type
  export let tree
  export let path = []
  export let depth = 0
  export let includePlaceholder = true

  const { name, children } = tree

  function formatName(s) {
    return s.replace('.json', '')
            .replaceAll('_', ' ')
  }

  onMount(() => {
    if (path.length < depth + 1) {
      path = [...path, '']
    }
  })

  $: selectedChild = children.find(c => c.name === path[depth])
</script>

<div class="file-picker">
  <!-- <label for={name}>{name}</label> -->

  <select
    {name}
    bind:value={path[depth]}
    on:change={() => path = path.slice(0, depth + 1)}
    required
    >

    {#if includePlaceholder}
    <option value="" disabled selected>Select a {type}...</option>
    {/if}

    {#each children as { name: childName }}
      <option value="{childName}">{formatName(childName)}</option>
    {/each}

  </select>
</div>

{#key path[depth]}
  {#if selectedChild && selectedChild.children}
  <svelte:self
    type="subcategory"
    tree={selectedChild}
    depth={depth + 1}
    bind:path
  />
  {/if}
{/key}
