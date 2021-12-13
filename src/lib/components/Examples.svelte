<script>
  import { createEventDispatcher } from 'svelte' 

  import examples from '$lib/examples'

  const dispatch = createEventDispatcher()
</script>

<style>
  details {
    font-size: var(--font-smallest);
    margin-bottom: var(--double-gap);
  }

  .content {
    background: var(--color-bg);
    padding: var(--double-gap);
    border-radius: 0.2rem;
    margin-top: var(--gap);
  }

  h3 {
    margin: 0;
  }

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

<details>
  <summary><h2>Saved Snowclones + Examples</h2></summary>

  <div class="content">
    <h3>Saved Snowclones</h3>
    <p>You don't have any saved snowclones!</p>

    <h3>Examples</h3>

    <ul>
    {#each examples as example}
      <li>
        <button 
          class="linklike" 
          on:click={() => dispatch('loadTokens', example.data)}
          >{example.name}
        </button>
      </li>
    {/each}
    </ul>
  </div>

</details>

<!-- <button on:click={() => dispatch('logTokens')}>log tokens</button> -->