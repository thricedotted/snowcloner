<script>
export let token
</script>

<style>
</style>

{#each Object.entries(token) as [key, value]}
<span class="token-property"><b>{key}</b>&nbsp;{value}</span><br>
{/each}