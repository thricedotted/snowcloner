<script>
	import qs from 'qs'
  import copy from 'clipboard-copy'

  import { dev } from '$app/env'
  import { page } from '$app/stores'
	import { encodeObject } from '$lib/util'

  export let corporaTokens, template

  let copiedUrl = ''

  $: buttonText = copiedUrl === shareUrl ? 'copied!' : 'copy'

  $: shareUrl = `http${dev ? '' : 's'}://${$page.host}?${qs.stringify({g: encodeObject({...corporaTokens, $TEMPLATE$: template})})}`
</script>

<style>
  .share {
    font-size: var(--font-smallest);
  }

  .copy-link {
    display: flex;
    gap: var(--gap);
  }

  input {
    flex-grow: 1;
    user-select: all;
    text-overflow: ellipsis;
  }

  button {
    border: 0;
    border-radius: 0.2rem;
    box-shadow: none;

    background: var(--color-primary-dark);
    color: var(--color-bg);

    font-size: var(--font-smallest);
  }
</style>

<div class="share">
  <b>Wanna share your snowclone? Copy the link below!</b><br>
  <div class="copy-link">
    <input 
      readonly 
      value={shareUrl}
      >
    <button
      on:click={() => { copy(shareUrl); copiedUrl = shareUrl }}
      >{buttonText}
    </button>
  </div>
</div>