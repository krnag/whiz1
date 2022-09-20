<script lang="ts">
  import '$lib/styles/blog.css';
  import '$lib/styles/dashboard.css';
  import '$lib/styles/editor.css';
  import type { Article } from "$lib/../types";
  import { slugify, now } from '$lib/helpers';
  import Image from "$comp/inputs/Image.svelte";
  import Text from "$comp/inputs/Text.svelte"
  import TextArea from "$comp/inputs/TextArea.svelte";
  import BlockEditor from '$comp/BlockEditor.svelte';

  export let article: Article;

  const IMG_DIR = `/articles/images/${article.id}/`;
  let srcs = {
    cover: IMG_DIR+"cover-l.webp",
    mcover: IMG_DIR+"mcover-l.webp",
    thumb: IMG_DIR+"thumb-l.webp",
  };
  let errors = {count: 0, title:[], subtitle:[]}

  async function handleSubmit(redirect=false) {
    let errors = {count: 0, title:[], subtitle:[]}
    article.lastEdit = now();
    let i = article.content.length;
    while (i--) {
      if (article.content[i].src) delete article.content[i].src;
    }
    if (article.title.length === 0) {errors.title.push("Title is required");errors.count++;}
    if (article.subtitle.length === 0) {errors.subtitle.push("Subtitle is required");errors.count++;}

    if (errors.count === 0) {
      let res = await fetch(`/dashboard/edit/${article.id}/${article.slug || "-"}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(article),
      });
      if (redirect) location.replace(res.url)
    }
  }
  function getSlug() {
    article.slug = slugify(article.title);
  };

  let showTitleInput = false;
  function toggleTitleInput() {showTitleInput = !showTitleInput};
  let showCoverPicker = false;
  function toggleCoverPicker() {showCoverPicker = !showCoverPicker};
  let showSubtitleInput = false;
  function toggleSubtitleInput() {showSubtitleInput = !showSubtitleInput};

</script>

<main id="article">
<div class="head">
  <img src={srcs.cover} alt="" class="cvr">
  <button class="abcent" on:click={toggleCoverPicker}>Change Cover Image</button>
  <div class="container abcent tac t-bg1">
    <h1 on:click={toggleTitleInput} errors={errors.title} class="cpt">{article.title}</h1>
    <p on:click={toggleSubtitleInput} class="t2l mt1 cpt">{article.subtitle}</p>
  </div>
</div>

<div class="mt3 container editor-body" style="position: relative;">
    <BlockEditor bind:content={article.content} imgDir={IMG_DIR}
                 imgApi="/dashboard/edit/{article.id}/upload-image/" />

    <div class="fx m1 b0 r0 z200">
      <button on:click={() => handleSubmit(false)} class="btn-l btn-success">Save</button>
      <button on:click={() => handleSubmit(true)} class="btn-l btn-success">Save & Quit</button>
    </div>
</div>
</main>

{#if showTitleInput}
  <div class="overlay" on:click={toggleTitleInput}><div class="modal" on:click|stopPropagation>
    <Text bind:value={article.title} label="{article.title.length} characters" />
  </div></div>
{/if}
{#if showCoverPicker}
  <div class="overlay" on:click={toggleCoverPicker}><div class="modal" on:click|stopPropagation>
    <Image uri="cover" api="/dashboard/edit/{article.id}/upload-image/" 
         src={srcs.cover} setUri={() => srcs.cover = IMG_DIR+"cover-l.webp?"+Date.now()}
         style="width: 80vw;" label="Cover Image"/>
    <Image uri="thumb" api="/dashboard/edit/{article.id}/upload-image/" 
         src={srcs.thumb} setUri={() => srcs.thumb = IMG_DIR+"thumb.webp?"+Date.now()}
         style="width: 12rem;height: 12rem" label="Thumbnail"/>
    <Image uri="mcover" api="/dashboard/edit/{article.id}/upload-image/" 
         src={srcs.mcover} setUri={() => srcs.mcover = IMG_DIR+"mcover-l.webp?"+Date.now()}
         style="width: 36rem;height: 36rem" label="Mobile Cover Image"/>
  </div></div>
{/if}
{#if showSubtitleInput}
  <div class="overlay" on:click={toggleSubtitleInput}><div class="modal" on:click|stopPropagation>
    <TextArea bind:value={article.subtitle} label="Subtitle" />
    <Text bind:value={article.slug} label="{article.slug.length} characters" />
    {#if article.title}
      <button on:click={getSlug}>Use Title Slug</button>
    {/if}
  </div></div>
{/if}
