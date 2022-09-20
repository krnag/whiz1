<script>
  import '$lib/styles/editor.css';
  import { makeId } from "$lib/helpers";

  //import type { Block } from '$lib/../types';

  import Markdown from './inputs/Markdown.svelte';
  import Image from "$comp/inputs/Image.svelte";
  import Text from "$comp/inputs/Text.svelte"
  import Question from './Question.svelte';
  import QuestionEditor from './QuestionEditor.svelte';

  export let content = [];
  export let imgDir;
  export let imgApi;
  export let ids = {};
  let selectedBlock = null;
  let selectedQ;

  function setBlock(block) {
    if (block.format === "im") {
      block.src = `${imgDir}${block.id}-l.webp`;
    }
    selectedBlock = block;
  };
  function selectQ(q) {selectedQ = q};

  function addContent() {
    content.push({ id: makeId(3), format: "md", width: "100%", content: "", md: ""});
    selectedBlock = content[content.length-1];
  };
  function addImage() {
    const id = makeId(3)
    const src = `${imgDir}${id}-l.webp`;
    content.push({ id, format: "im", width: "100%", src, alt: "", caption: ""});
    selectedBlock = content[content.length-1];
  };
  function addEmbed() {
    content.push({ id: makeId(3), format: "em", width: "100%", content: ""});
    selectedBlock = content[content.length-1];
  };
  function addQestion() {
    content.push({ id: "", format: "q", width: "100%" });
    selectedQ = {};
    selectedBlock = content[content.length-1];
  };
  function closeQE(updateQId) {
    if (updateQId) {
      selectedBlock.id = updateQId;
      selectedBlock = undefined;
    }
    selectedQ = undefined;
  }
  async function delQ() {
    if (confirmDelQ) {
    } else confirmDelQ = true;
  }


  function moveBlock(idx, dir="u") {
    const to = dir === "u" ? idx - 1 : idx + 1;
    if (to > -1 && to < content.length) {
      content.splice(to, 0, content.splice(idx, 1)[0]);
      content = content;
    }
  }

  let confirmRemove = undefined;
  async function removeBlock() {
    if (content[confirmRemove].format == "im") {
      await fetch(imgApi + content[confirmRemove].id, {
        method: "DELETE"
      })
    } else if (content[confirmRemove].format == "q") {
      const res = await fetch("/dashboard/question/", {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: content[confirmRemove].id }),
      });
      if (res.ok) closeQE();
    }
    content.splice(confirmRemove, 1);
    content = content;
    confirmRemove = undefined;
  }

  function closeModal() {
    content = content;
    selectedBlock = null;
    confirmRemove = undefined;
  }
</script>

<article>
  {#each content as block, idx}
    {#if block.format === "im"}
      <figure class="content-block" style="z-index:2;{`width: ${block.width};`}">
        <div class="block-ops" style="z-index:5">
          <button on:click={() => moveBlock(idx, "u")}>^</button>
          <button on:click={() => moveBlock(idx, "d")} class="rt180">^</button>
          <button on:click={() => setBlock(block)}>e</button>
          <button on:click={() => confirmRemove = idx}>t</button>
        </div>
        <img style="width: 100%;" src={block.src || `${imgDir}${block.id}-l.webp`} alt={block.alt} >
        {#if block.caption}
          <figcaption>{block.caption}</figcaption>
        {/if}
      </figure>
    {:else if block.format == "q"}
      <div class="content-block" style="{`width: ${block.width};`}">
        {#if block.id}
          <Question id={block.id} {selectQ} />
        {/if}
        <div class="block-ops">
          <button on:click={() => moveBlock(idx, "u")}>^</button>
          <button on:click={() => moveBlock(idx, "d")} class="rt180">^</button>
          <button on:click={() => setBlock(block)}>e</button>
          <button on:click={() => confirmRemove = idx} >t</button>
        </div>
      </div>
    {:else}
      <span class="content-block" style="{`width: ${block.width};`}">
        {@html block.content}
        <div class="block-ops">
          <button on:click={() => moveBlock(idx, "u")}>^</button>
          <button on:click={() => moveBlock(idx, "d")} class="rt180">^</button>
          <button on:click={() => setBlock(block)}>e</button>
          <button on:click={() => confirmRemove = idx} >t</button>
        </div>
      </span>
    {/if}
  {/each}
</article>

<div class="m1 ts tac usn">
  <hr>
  <p>Add Content Block</p>
  <button type="button" on:click={addContent}><i>=</i> Markdown</button>
  <button type="button" on:click={addImage}><i>i</i> Image</button>
  <button type="button" ><i>a</i> Data</button>
  <button type="button" on:click={addQestion}><i>?</i> Question</button>
  <button type="button" on:click={addEmbed}><i>V</i> Embed</button>
  <br><br>
</div>

{#if selectedBlock && !selectedQ}
  <div class="overlay" on:click={closeModal}><div class="modal" on:click|stopPropagation>
      <Text label="Width" bind:value={selectedBlock.width} width="4.2rem;"/>
      {#if selectedBlock.format === "im"}
        <Text label="Alt Text" bind:value={selectedBlock.alt} width="60rem;"/>
        <Image uri={selectedBlock.id} src={selectedBlock.src} api={imgApi} 
               setUri={() => selectedBlock.src = `${imgDir}${selectedBlock.id}-l.webp?${Date.now()}`}
               label="Change Image"/>
        <Text bind:value={selectedBlock.caption} label="Caption"/>
      {:else if selectedBlock.format === "q"}
        <Text bind:value={selectedBlock.id} label="Question Id"/>
      {:else}
        <Markdown label="Content" bind:value={selectedBlock.md} bind:html={selectedBlock.content} rows=30 count/>
      {/if}
      <button class="btn-primary" on:click={closeModal} style="font-size:var(--tm);width: 100%;">Confirm</button>
  </div></div>
{/if}
{#if selectedQ && ids.hasOwnProperty("subjectId")}
  <QuestionEditor q={selectedQ} close={(id) => closeQE(id)} subjectId={ids.subjectId} topicId={ids.topicId} lessonId={ids.lessonId} pageId={ids.noteId} />
{/if}
{#if !isNaN(confirmRemove)}
  <div class="overlay" on:click={closeModal}><div class="modal" on:click|stopPropagation>
      <button class="btn-danger" on:click={removeBlock}>Delete Block</button>
  </div></div>
{/if}

