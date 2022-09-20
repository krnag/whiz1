<script context="module">
  import { subjectStore } from '$lib/stores/learn';
  export async function load({fetch, props}) {
    let subNames = {}; 
    let topNames = {}; 
    const res = await fetch('/courses/subjects.json');
    if (res.ok) {
      const data = await res.json(); 
      subjectStore.set(data.subjects);
      const l = data.subjects.length;
      for (let i = 0; i < l; i++) {
        subNames[data.subjects[i].id] = data.subjects[i].name;
        const ln = data.subjects[i].topics.length;
        for (let j = 0; j < ln; j++) {
          topNames[data.subjects[i].topics[j].id] = data.subjects[i].topics[j].name;
        }
      }
    }
    return { status: 200, props: {subNames, topNames, questions: props.questions} };
  };
</script>
<script>
  import { getDate, URL } from '$lib/helpers';
  import QuestionEditor from "$comp/QuestionEditor.svelte";
  import Question from '$comp/Question.svelte';

  export let questions = [];
  export let subNames = {}; 
  export let topNames = {}; 
  let subjectId, topicId, subjectQ, topicQ;
  let selectedQ, viewQ;

  async function getQuestions() {
    if (subjectId) {
      const level = topicId ? "topic" : "subject";
      const res = await fetch(`${URL}learn/questions/${level}/${topicId || subjectId}`);
      if (res.ok) {
        const data = await res.json(); 
        questions = data.questions;
      }
    }
  }

  let confirmDelQ = null;
  async function delQ(id) {
    if (id === confirmDelQ) {
      const res = await fetch("/dashboard/question/", {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        questions = questions.filter(q => q.id !== id);
        //questions = questions;
        confirmDelQ = null;
      } else {}
    } else confirmDelQ = id;
  }

  $: clearTopic(subjectId);
  function clearTopic(_) {topicId = undefined};
</script>

<div class="dashbar">
  <select bind:value={subjectId}>
    <option value={undefined}>All</option>
    {#each $subjectStore as sub}
      <option value={sub.id}>{sub.name}</option>
    {/each}
  </select>
  <select bind:value={topicId}>
    <option value={undefined}>All</option>
    {#if subjectId}
      {#each $subjectStore.find(s => s.id === subjectId).topics as topic}
        <option value={topic.id}>{@html topic.name}</option>
      {/each}
    {/if}
  </select>
  <button class="ts" disabled={!subjectId} on:click={getQuestions}>Get</button>
  <span class="pl3"></span>

  <select bind:value={subjectQ}>
    <option value={undefined}>+ Subject Question</option>
    {#each $subjectStore as sub}
      <option value={sub.id}>{sub.name}</option>
    {/each}
  </select>
  {#if subjectQ}
    <select bind:value={topicQ}>
      <option value={undefined}>None</option>
      {#each $subjectStore.find(s => s.id === subjectQ).topics as topic}
        <option value={topic.id}>{@html topic.name}</option>
      {/each}
    </select>
    <button class="ts" on:click={() => selectedQ = {}}><i>+</i> Question</button>
  {/if}
</div>

<table>
  <thead>
    <th>Edited</th>
    <th>Subject</th>
    <th>Topic</th>
    <th>Lesson</th>
    <th>Question</th>
    <th></th>
  </thead>
  <tbody>
    {#if questions.length}
      {#each questions as q}
        <tr>
          <td class="small">{getDate(q.edited)}</td>
          <td class="small">{@html subNames[q.subject_id]}</td>
          <td class="small">{@html topNames[q.topic_id]}</td>
          <td class="small">{q.lesson_id}</td>
          <td style="text-align: left;">{@html q.question}</td>
          <td>
            <button class="i" on:click={() => viewQ = q}>i</button>
            <button class="i" on:click={() => selectedQ = q}>e</button>
            <button class="i btn-d" class:btn-danger={q.id === confirmDelQ} on:click={() => delQ(q.id)}>t</button>
          </td>
          
        </tr>
      {/each}
    {:else}
      <tr>
        <td></td>
        <td>No Questions </td>
      </tr>
    {/if}
  </tbody>
</table>

{#if selectedQ}
  <QuestionEditor q={selectedQ} subjectId={subjectQ} topicId={topicQ} close={() => selectedQ = undefined}/>
{/if}
{#if viewQ}
  <div class="overlay" on:click={() => viewQ = undefined}><div class="modal" on:click|stopPropagation >
    <p class="ts">id: {viewQ.id}</p>
    <Question q={viewQ}/>
  </div></div>
{/if}
