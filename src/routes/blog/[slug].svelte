<script context="module">
  import '$lib/styles/blog.css';
  export async function load({ fetch, params }) {
      const res = await fetch(`/articles/${params.slug}.json`);
      if (res.ok) {
        const data = await res.json();
        return { props: data };
      } else {
        return { status: 404 }
      }
    }
  import ExpandableImage from "$comp/ExpandableImage.svelte";
</script>

<script lang="ts">
  export let id: string;
  export let title: string;
  export let subtitle: string;
  export let content = [];
</script>

<main id="article">
<div class="head">
  <img src="/articles/images/{id}/mcover-s.webp"
       srcset="/articles/images/{id}/mcover-s.webp 380w,
               /articles/images/{id}/mcover-l.webp 440w,
               /articles/images/{id}/cover-s.webp 1380w,
               /articles/images/{id}/cover-m.webp 1600w,
               /articles/images/{id}/cover-l.webp 1920w"
       alt={title} class="cvr">
  <div class="container abcent tac t-bg1">
    <h1>{title}</h1>
    <p class="t2l mt1">{subtitle}</p>
  </div>
</div>
<article class="mt3 container">
  {#each content as block}
    {#if block.format === "im"}
      <ExpandableImage width={block.width} uri="/articles/images/{id}/{block.id}" alt={block.alt} caption={block.caption} />
    {:else if block.format === "md"}
      {@html block.content}
    {:else if block.format == "em"}
      <div style="width: {block.width}">{@html block.content}</div>
    {/if}
  {/each}
</article>
</main>
