<style>
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

  dd, dd :global(p) {
    margin: 0;
    margin-bottom: var(--double-gap); 
  }
</style>

<dt><slot name="title"></slot></dt>
<dd><slot></slot></dd>