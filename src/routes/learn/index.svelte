<script context="module">
  import { subjectStore } from "$lib/stores/learn";
  import { get } from "svelte/store";
  import { browser } from "$app/env";
  import { user } from "$lib/stores/user";
  import Hero from "$comp/Hero.svelte";
  export async function load({ fetch }) {
    if (browser && get(subjectStore).length === 0) {
      const res = await fetch('/courses/subjects.json')
      if (res.ok) {
        const data = await res.json(); 
        subjectStore.set(data.subjects);
      }
    }
    return {status:200};
  };
</script>

{#if $subjectStore && $subjectStore.length}
<main id="subjects">
<section class="head" style="height: 25vh;">
  <Hero cover={4} scheme={3} />
  <h1>Subjects</h1>
</section>

<section class="subject-grid">
  {#each $subjectStore as subject}
    {#if subject.topics && subject.topics.length > 0}
      <h3>{subject.name}</h3>
      {#each subject.topics as topic}
        <a href="/learn/{topic.id}" class="subject-tile">
          <img src="/images/topics/{topic.id}.webp" alt="{topic.name} cover image">
            {#if $user != null && $user.hasOwnProperty("progress") && $user.progress.hasOwnProperty(topic.id)}
              {#if $user.progress[topic.id].score > 0}
                <span class="ab t0 l0 t-bg1">{$user.progress[topic.id].score}</span>
              {/if}
              {#if $user.progress[topic.id].progress > 0}
                <span class="ab t0 l0 t-bg1 i h4">i</span>
              {/if}
            {/if}
            <h4>{@html topic.name}</h4>
          </a>
        {/each}
    {/if}
  {/each}
</section>
</main>
{/if}
