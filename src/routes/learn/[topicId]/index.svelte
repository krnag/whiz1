<script context="module">
  import { topicStore } from "$lib/stores/learn";
  import { browser } from "$app/env";
  import { get } from "svelte/store";
  export async function load({params, fetch}) {
    if (browser) {
      const topicId = params.topicId;
      let topic;
      if (!get(topicStore)[topicId]) {
        const res = await fetch(`/courses/topics/${topicId}.json`)
        if (res.ok) {
          topic = await res.json(); 
          topicStore.update(t => {
            t[topicId] = topic;
            return t;
          });
        } else return { status: 404 };
      } else topic = get(topicStore)[topicId];
      return { status: 200, props: {topicId, topic} };
    }
    return { status: 200 };
  };
</script>
<script>
  import { user } from "$lib/stores/user";
  import '$lib/styles/lesson.css';

  export let topicId = "";
  export let topic;

  // Add topic to user progress
  if ($user) {
    if (!$user.progress.hasOwnProperty(topicId)) {
      $user.progress[topicId] = {score: 0,progress: 0, recordId:""};
    } 
    getLessonProgress();
  }
  async function getLessonProgress() {
    const res = await fetch("/learn/progress/", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user: $user.id, topicId }),
    });
    if (res.ok) {
      $user.progress[topicId].lessons = await res.json();
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
    {#if lesson.pub}
      <a class="card bg0" href="{topicId}/{lesson.id}">{lesson.title}</a>
    {/if}
  {/each}
</div>
{:else}
  <a href="/learn" class="error-redirect">
    <h2>Could Not Find Lesson</h2><p>Click anywhere to go back</p>
  </a>
{/if}
