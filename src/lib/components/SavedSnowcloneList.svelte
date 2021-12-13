<script>
  import { createEventDispatcher } from 'svelte' 

  const dispatch = createEventDispatcher()

  export let savedSnowclones = []
</script>

<style>
  ul {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: var(--gap);
    list-style: square inside;
    columns: 16em;
  }

  li {
    margin: var(--gap) 0;
  }

  li::marker {
    color: var(--color-primary-mid);
  }
</style>


<ul>
{#each savedSnowclones as snowclone (snowclone.id)}
  <li>
    <button 
      class="linklike" 
      on:click={() => dispatch('loadTokens', snowclone.data)}
      >{snowclone.name}
    </button>
  </li>
{/each}
</ul>