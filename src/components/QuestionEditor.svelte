<script>
  import { makeId, now } from "$lib/helpers";
  import Checkbox from "./inputs/Checkbox.svelte";
  import Range from "./inputs/Range.svelte"
  import Image from "./inputs/Image.svelte";
  import Markdown from "./inputs/Markdown.svelte";

  export let q = {};
  export let subjectId;
  export let topicId = "";
  export let lessonId = "";
  export let pageId = "";
  export let close = () => {};
  let choices = [];
  let choicesMd = [];
  let srcs = null;

  let isNew = false;
  if (!q.id) {
    isNew = true;
    q = {
      id: makeId(),
      subject_id: subjectId,
      topic_id: topicId,
      lesson_id: lessonId,
      page_id: pageId,
      question: "",
      q_md: "",
      choices: "",
      c_md: "",
      explanation: "",
      e_md: "",
      cover: false,
      has_images: false,
      difficulty: 1,
      edited: now(),
      published: 1
    };
  } else {
    getMd(q.id)
    choices = JSON.parse(q.choices);
    srcs = {cover: q.cover ? `${IMG_DIR}${q.id}/cover.webp` : ""};
  }

  async function getMd(id) {
    const res = await fetch(`/dashboard/question/${id}`);
    if (res.ok) {
      const data = await res.json(); 
      q.q_md = data.q_md;
      q.c_md = data.c_md;
      q.e_md = data.e_md;
      choicesMd = JSON.parse(data.c_md);
    } 
  }
  
  function addChoice() {
    choices.push({
      id: makeId(3),
      text: "",
      isCorrect: false
    });
    choicesMd.push("");
    choices = choices;
    choicesMd = choicesMd;
  };

  let confirmDelQ = false;
  async function delQ() {
    if (confirmDelQ) {
      const res = await fetch("/dashboard/question/", {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: q.id }),
      });
      if (res.ok) close(q.id);
    } else confirmDelQ = true;
  }

  const IMG_API = "/dashboard/question/upload-image/"
  const IMG_DIR = "/images/quiz/"

  let errors = {count:0}
  async function submit() {
    if (errors.count === 0) {
      q.choices = JSON.stringify(choices);
      q.c_md = JSON.stringify(choicesMd);
      q.edited = now();
      const res = await fetch("/dashboard/question/", {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      if (res.ok) {
        close(q.id);
      } else {}
    };
  };
  function cancel() {close()}
</script>

<div class="overlay" on:click={cancel}>
  <div class="modal" style="background-color: white;padding: 1rem;" on:click|stopPropagation >
    {#if q}
      <Checkbox label="Show Cover" bind:checked={q.cover}/>
      {#if q.cover}
        <Image uri="cover" src={srcs.cover} api={`${IMG_API}${q.id}/`} 
          setUri={() => srcs.cover = `${IMG_DIR}${q.id}/cover.webp?${Date.now()}`}
          label="Change Image"/>
      {/if}
      <Markdown label="Question" bind:value={q.q_md} bind:html={q.question} />

      {#each choices as ch, idx}
        <Checkbox bind:checked={ch.isCorrect} label="Correct Answer" />
        {#if q.has_images}
          <Image uri={ch.id} src={srcs[ch.id]} api={`${IMG_API}${q.id}/`} 
            setUri={() => srcs[ch.id] = `${IMG_DIR}${q.id}/${ch.id}.webp?${Date.now()}`}
            label="Change Image"/>
        {/if}
        <Markdown label="Options" bind:value={choicesMd[idx]} bind:html={ch.text} />
      {/each}
      <button on:click={addChoice}>Add Choice</button>

      <Markdown label="Explanation" bind:value={q.e_md} bind:html={q.explanation} />
      <Checkbox label="Use images in choices" bind:checked={q.has_images}/>
      <Range label="Difficulty" bind:value={q.difficulty} min=1 max=3 step=1 width="6rem"/>

      <div class="jll mt1">
        {#if confirmDelQ}
          <button  on:click={()=>confirmDelQ=false}>Cancel</button>
          <button class="btn-danger" on:click={delQ}>Confirm</button>
        {:else}
          <button class="btn-d" on:click={cancel}>Cancel</button>
          {#if !isNew}
            <button class="btn-danger" on:click={delQ}>Delete</button>
          {/if}
          <button class="btn-primary" on:click={submit}>Update</button>
        {/if}
      </div>
    {/if}
  </div>
</div>
