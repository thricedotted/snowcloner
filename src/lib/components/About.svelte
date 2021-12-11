<script>
  import TokenPath from '$lib/components/TokenPath.svelte'
</script>

<style>
  details {
    font-size: var(--font-smallest);
    margin-bottom: var(--double-gap);
  }

  dl {
    background: var(--color-bg);
    padding: var(--double-gap);
    padding-bottom: var(--gap);
    border-radius: 0.2rem;
    margin-top: var(--gap);
  }

  dt {
    font-weight: bold;
    font-style: italic;
  }

  dt:not(:first-of-type)::before {
    display: block;
    margin-bottom: var(--double-gap);
    text-align: center;
    content: '***';
    font-style: normal;
    color: var(--color-primary-mid);
    letter-spacing: 0.8em;
  }

  dd, p {
    margin: 0;
    margin-bottom: var(--double-gap); 
  }

  ul {
    padding-left: 0;
    list-style-position: inside;
  }

  li {
    margin-top: var(--shim);
  }

</style>

<details open>
  <summary><h2>Help!</h2></summary>

  <dl>
    <dt>What is this?</dt>
    <dd>
      <p>Snowcloner is a web toy for generating randomized text within templates &mdash; or you could think of it as writing your own Mad Libs, and then having the computer fill them in! The name comes from <a href="https://en.wikipedia.org/wiki/Snowclone">snowclone</a>, a cliché phrasal template.</p>
    </dd>

    <dt>How do I make a snowclone?</dt>
    <dd>
      <p>
        One place to start is the <b>corpora explorer</b>. Using the dropdown menus, you can select different <b>tokens</b> to add to your <b>grammar</b>. Each token is a collection of words or phrases that can be slotted into your template. The size of the collection is the number next to the token in the grammar, and you can see full collection in the corpora explorer.
      </p> 

      <p>
        The <b>template editor</b> is where you write your template and use your tokens! When you want to use a random token into the text, you type in its name surrounded by #s, like #this#. When you want to see what your template produces, press the <b>generate</b> button!
      </p>
    </dd>

    <dt>What is a "structured token"?</dt>
    <dd>
      <p>
        A <b>structured token</b> is a token that contains structured information rather than single words. 
        For example, <TokenPath token={{ f: ['archetypes', 'artifact.json'] }} on:jumpToCorpus /> has tokens with the properties "name", "synonyms", "qualities", and "nature". Structured tokens allow you to group that information together so that when you use, say, #artifacts-name# and #artifacts-qualities# in your template, you don't end up with the name of one artifact and the qualities of another. 
      </p>
        
      <p>
        Of course, if you <i>want</i> these properties to be all mixed up, easy enough &mdash; you can use the dropdown to add them to your grammar as separate tokens!
      </p>

      <p>
        Note: on some corpora, you might see a "convert to structured data" button... and discover that when you press it, the data ends up grouped together in an unhelpful way. In this case, you probably want "select a key" instead. I've done my best to convert the corpora into a useful format, but it's fiddly sometimes!
      </p>
    </dd>

    <dt>How do I capitalize a token in my template?</dt>
    <dd>
      <p>There are a few special functions you can use to modify tokens in your template. You can use them by placing a . (period) and then the name of the modifier you want to use <i>after</i> the token name, but <i>before</i> the ending #. For instance, if you wanted to capitalize the #animal# token, you would put #animal.capitalize# in your template.</p>

      <p style="margin-bottom: 0;">The modifiers available are:</p>

      <ul>
        <li>
          <b>lowercase:</b> Make all of the letters in the text lowercase.
        </li>

        <li>
          <b>uppercase:</b> Make all of the letters in the text uppercase.
        </li>

        <li>
          <b>capitalize:</b> Capitalize the first letter of the text.
        </li>

        <li>
          <b>capitalizeAll:</b> Capitalize the first letter of every word in the text.
        </li>

        <li>
          <b>formatNumber:</b> If the text is a number with a lot of digits (e.g., 2147483647), format it more nicely ({parseInt('2147483647').toLocaleString()}).
        </li>

        <li>
          <b>a:</b> Put "a" or "an" in front of the text, depending on whether it starts with a vowel or not.
        </li>

        <li>
          <b>s:</b> Put "s", "es", or "ies" at the end of the text, depending on what it ends with.
        </li>

        <li>
          <b>firstS:</b> Like the s modifier, but operates on the first word of the text.
        </li>

        <li>
          <b>ed:</b> Put "d", "ed", or "ied" at the end of the text.
        </li>

        <li>
          <b>replace(X,Y):</b> Replace X with Y. (You can replace X and Y here with whatever text you want.)
        </li>
      </ul>
    </dd>

    <dt>How do I share a snowclone I made with a friend?</dt>
    <dd>
      <p>If you want to share just the generated text, you can copy or screenshot it. If you want to send the snowclone itself, copy and send them the share link! This link changes every time you change your template or grammar &mdash; that is, it's not pointing to a document that's saved anywhere, but it does contain all the information necessary for reconstructing your snowclone.</p>
    </dd>

    <dt>This seems pretty basic! How do I do #fancy-thing#?</dt>
    <dd>
      <p>
        The bad news is that Snowcloner is intentionally designed to be pretty basic! The great news is that it's built on a powerful library called <a href="https://tracery.io/">Tracery</a>, which even has an <a href="https://tracery.io/editor/">online editor</a> that offers some neat visualizations of your grammar. If you're interested in donig even more with generative text, definitely check it out!
      </p>
    </dd>

  </dl>

</details>

<details>
  <summary><h2>About Snowcloner</h2></summary>

  <dl>
    <dt>Where do the corpora come from?</dt>
    <dd>
      <p>
        They are from <a href="https://github.com/dariusk/corpora">Corpora</a>, a public domain repository of lists of words and other structured language data. It was created with the goals of rapid project prototyping and as a teaching tool, both of which inspired and, I hope, are furthered by Snowcloner. It's a wonderful resource created and maintained by volunteers; if there is data that you'd like to play with in Snowcloner that's not yet in the repository, consider contributing it to Corpora!
      </p>
    </dd>

    <dt>How was Snowcloner made?</dt>
      <p>
        The two most important components of Snowcloner (after you, the author of the snowclone 😊) are <a href="https://github.com/dariusk/corpora">Corpora</a> and <a href="https://tracery.io/">Tracery</a>, which we rely on for the data and the text generation framework, respectively. Snowcloner exists because I wanted to bring these two powerful resources together in a novel and accessible way!
      </p>

      <p>
        The website itself is built with <a href="https://kit.svelte.dev">SvelteKit</a> and deployed on <a href="https://vercel.com">Vercel</a>, and you can check out the source code on <a href="https://github.com/thricedotted/snowcloner">GitHub</a>.
        <!-- For more technical details, see [link to project portfolio detail page] -->
      </p>
    <dd>

    </dd>

    <dt>Who made Snowcloner?</dt>
    <dd></dd>
  </dl>
</details>
