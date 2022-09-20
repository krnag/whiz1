<script context="module">
  import { topicStore } from "$lib/stores/learn";
  import { browser } from "$app/env";
  import { get } from "svelte/store";
  export async function load({params, fetch}) {
    const topicId = params.topicId;
    let topic;
    if (browser && !get(topicStore)[topicId]) {
      const res = await fetch(`/courses/topics/${topicId}.json`)
      if (res.ok) {
        topic = await res.json(); 
        topicStore.update(t => {
          t[topicId] = topic;
          return t;
        });
      } else return { status: 404 };
    } else topic = get(topicStore)[topicId];
    return { status: 200, props: {topicId} };
  };
</script>
<script>
  import { lessonStore } from "$lib/stores/learn";
  import { getDate, makeId, now } from "$lib/helpers";
  import '$lib/styles/lesson.css';

  export let topicId = "";
  export let topic = $topicStore[topicId];

  let newLessonTitle = "";
  async function createLesson() {
    const id = makeId();
    const res = await fetch("/dashboard/lessons/", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({topic: topicId, id, title: newLessonTitle}),
    });
    if (res.ok) {
      $lessonStore[id] = {id, title: newLessonTitle, pages: [{id:makeId(3),notes:[]}], graphs: {}, params: {}, labels:[]};
      $topicStore[topicId].lessons[$topicStore[topicId].lessons.length] = {id, title: newLessonTitle};
      $lessonStore = $lessonStore;
      $topicStore = $topicStore;
      topic = $topicStore[topicId]
      newLessonTitle = "";
    } else {
      error = res.err;
    }
  }

  let confirmDelete = null;
  async function removeLesson() {
    const res = await fetch("/dashboard/lessons/", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({topic: topicId, id: confirmDelete, remove: true}),
    });
    if (res.ok) {
      delete $lessonStore[confirmDelete]
      confirmDelete = null;
      $lessonStore = $lessonStore;
      topic = $topicStore[topicId]
    } else {
      error = res.err;
    }
  }

  async function moveLesson(id, position) {
    const res = await fetch("/dashboard/lessons/", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({topic: topicId, id, position}),
    });
    if (res.ok) {
      const from = $topicStore[topicId].lessons.findIndex(l => l.id === id);
      $topicStore[topicId].lessons.
        splice(from+position, 0, $topicStore[topicId].lessons.splice(from, 1)[0]);
      $topicStore = $topicStore;
    } else {
      error = res.err;
    }
  }
  async function pubLesson(id, topicId) {
    const res = await fetch("/dashboard/lessons/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id, topicId}),
    });
    if (res.ok) {
      const idx = $topicStore[topicId].lessons.findIndex(l => l.id === id);
      $topicStore[topicId].lessons[idx].pub = now();
      $topicStore = $topicStore;
      topic = $topicStore[topicId];
    } else {}

  }
</script>

{#if topic}
<section class="lesson-head">
  <h1>{@html topic.name}</h1>
</section>

<div class="container tac">
  <h2 class="h4 m1">Lessons</h2>
  {#each topic.lessons as lesson}
    <div class="card">
      {#if lesson.pub} <span class="ts">{getDate(lesson.pub)}</span> {/if}
      <button class="i btn-{lesson.pub ? 'success' : 'danger'}" on:click={() => pubLesson(lesson.id, topicId)} >i</button>
      <a href="{topicId}/{lesson.id}">{lesson.title}</a>
      <button class="i" on:click={() => moveLesson(lesson.id, -1)}>^</button>
      <button class="i rt180" on:click={() => moveLesson(lesson.id, 1)}>^</button>
      <button class="i">e</button>
      <button class="i btn-d" on:click={() => confirmDelete = lesson.id}>t</button>
    </div>
  {/each}
  <input type="text" bind:value={newLessonTitle} placeholder="Add Lesson">
  <button class="i" on:click={() => createLesson()} class:disabled={!newLessonTitle}>+</button>
</div>
{/if}

{#if confirmDelete}
<div class="overlay" on:click={() => confirmDelete = null}>
  <div class="inlay" on:click|stopPropagation>
    <button on:click={() => confirmDelete = null} class="btn-primary">Cancel</button>
    <button on:click={removeLesson} class="btn-danger">DELETE</button>
  </div>
</div>
{/if}
