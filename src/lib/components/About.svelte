<script>
  import Details from '$lib/components/Details.svelte'
  import DefinitionList from '$lib/components/DefinitionList.svelte'
  import Definition from '$lib/components/Definition.svelte'
</script>

<Details>
  <h2 slot="summary">About Snowcloner</h2>

  <DefinitionList>

    <Definition>
      <span slot="title">Where do the corpora come from?</span>

      <p>
        They are from <a href="https://github.com/dariusk/corpora">Corpora</a>, a public domain repository of lists of words and other structured language data. It was created with the goals of rapid project prototyping and as a teaching tool, both of which inspired and, I hope, are furthered by Snowcloner. It's a wonderful resource created and maintained by volunteers; if there is data that you'd like to play with in Snowcloner that's not yet in the repository, consider contributing it to Corpora!
      </p>
    </Definition>

    <Definition>
      <span slot="title">How was Snowcloner made?</span>

      <p>
        The two most important components of Snowcloner (after you, the author of the snowclone 😊) are <a href="https://github.com/dariusk/corpora">Corpora</a> and <a href="https://tracery.io/">Tracery</a>, which we rely on for the data and the text generation framework, respectively. Snowcloner exists because I wanted to bring these two powerful resources together in a novel and accessible way!
      </p>

      <p>
        The website itself is built with <a href="https://kit.svelte.dev">SvelteKit</a> and deployed on <a href="https://vercel.com">Vercel</a>, and you can check out the source code on <a href="https://github.com/thricedotted/snowcloner">GitHub</a>.
        <!-- For more technical details, see [link to project portfolio detail page] -->
      </p>
    </Definition>

    <Definition>
      <span slot="title">Who made Snowcloner?</span>

      <p>
        ME hahaha TODO......
      </p>
    </Definition>

  </DefinitionList>

</Details>
