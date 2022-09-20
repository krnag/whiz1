<script context="module">
  import { lessonStore, topicStore } from "$lib/stores/learn";
  import { get } from "svelte/store";
  import { browser } from "$app/env";
  export async function load({params, fetch}) {
    const topicId = params.topicId;
    let [lessonId, pageNo] = params.lessonId.split("/");
    let lesson;
    if (!browser || !get(topicStore)[topicId]) { // GET TOPIC
      const res = await fetch(`/courses/topics/${topicId}.json`)
      if (res.ok) {
        const topic = await res.json(); 
        topicStore.update(t => {
          t[topicId] = topic;
          return t;
        });
      } else return { status: 404 };
    }
    if (!browser || !get(lessonStore)[lessonId]) { // GET LESSON
      const res = await fetch(`/courses/lessons/published/${lessonId}.json`)
      if (res.ok) {
        lesson = await res.json(); 
        lessonStore.update(l => {
          l[lessonId] = lesson;
          return l;
        });
      } else return { status: 404 };
    }
    if (isNaN(pageNo)) { // Show page by id
      if (pageNo === undefined) pageNo = 0;
      else {
        const pageIdx = lesson.pages.findIndex(p => p.id === pageNo);
        pageNo = pageIdx !== -1 ? pageIdx : 0;
      }
    }
    else if (pageNo >= lesson.pages.length) pageNo = lesson.pages.length-1;
    else pageNo = Number(pageNo);
    return { status: 200, props: {topicId, lessonId, pageNo} };
  };
</script>
<script>
  import { user } from "$lib/stores/user";
  import { afterUpdate } from "svelte";
  import '$lib/styles/lesson.css';
  import ExpandableImage from "$comp/ExpandableImage.svelte";
  import Graph from "$comp/slate/Graph.svelte";
  import Quiz from "$comp/Quiz.svelte";
  import Question from "$comp/Question.svelte";

  export let topicId = "", lessonId = "", pageNo = 0;
  let topic = $topicStore[topicId];
  let timer;
  let hasReadPage = false;
  let showLessonList = false;
  let showQuiz = false;
  let pageId = $lessonStore[lessonId].pages[pageNo].id;
  let progress = [];

  if ($user) {
    if (!$user.progress.hasOwnProperty(topicId)) {
      $user.progress[topicId] = {score: 0,progress: 0, recordId:""};
    } 
    getLessonProgress();
  }
  async function getLessonProgress() {
    if (!$user.progress[topicId].hasOwnProperty(lessonId)) {
      const res = await fetch("/learn/progress/", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user: $user.id, topicId }),
      });
      if (res.ok) {
        $user.progress[topicId].lessons = await res.json();
      } else {}
    }
    if (!$user.progress[topicId].lessons?.hasOwnProperty(lessonId)) {
      $user.progress[topicId].lessons[lessonId] = {score: 0, progress: [], recordId:""};
    } else progress = $user.progress[topicId].lessons[lessonId].progress;
  }

  let highlighted = null;
  function highlight(obj=null) {
    if (obj && highlighted && highlighted.id === obj.id) highlighted = null;
    else highlighted = obj;
  };

  async function gotoPage(n) {
    if (progress.indexOf(pageId) === -1 && hasReadPage) {
      const res = await fetch("/learn/progress/", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user: $user.id, topicId, lessonId,
          progress: [...progress, pageId],
          recordId: $user.progress[topicId].lessons[lessonId].recordId,
          topicRecordId: $user.progress[topicId].recordId
        }),
      });
      if (res.ok) {
        const data = await res.json();
        $user.progress[topicId].lessons[lessonId].progress.push(pageId);
        if (data.hasOwnProperty("recordId")) $user.progress[topicId].lessons[lessonId].recordId = data.recordId;
        if (data.hasOwnProperty("topicRecordId")) $user.progress[topicId].recordId = data.topicRecordId;
        $user = $user;
        progress = $user.progress[topicId].lessons[lessonId].progress;
      } else {}
    }
    pageNo = n;
    pageId = $lessonStore[lessonId].pages[pageNo].id;
  };

  function toggleLessonList() { showLessonList = !showLessonList };

  async function submitQuiz(score) {
    const prevScore = $user.progress[topicId].lessons[lessonId].score;
    if (!isNaN(score) && score > prevScore) {
      let data = {
        user: $user.id, topicId, lessonId, score,
        recordId: $user.progress[topicId].lessons[lessonId].recordId,
        topicRecordId: $user.progress[topicId].recordId
      };
      if (score >= 80 && prevScore < 80) {
        data.tProgress = $user.progress[topicId].progress + 1;
        if (progress.indexOf(pageId) === -1) {
          data.progress = [...$user.progress[topicId].lessons[lessonId].progress, pageId];
        }
      }
      const res = await fetch("/learn/progress/", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        $user.progress[topicId].lessons[lessonId].score = score;
        if (data.hasOwnProperty("recordId")) $user.progress[topicId].lessons[lessonId].recordId = data.recordId;
        if (data.hasOwnProperty("topicRecordId")) $user.progress[topicId].recordId = data.topicRecordId;
        if (data.tProgress) {
          $user.progress[topicId].progress = data.tProgress;
          $user.progress[topicId].lessons[lessonId].progress.push(pageId);
        }
        $user = $user;
      } else {}
    }
  };

  let lastUpdatedPageNo;
  const ATTR = {c: "curve", t: "tangent", a: "area", o: "point"};
  const DASH = {d: "dotted", D: "dashed", S: "solid"};
  afterUpdate(() => {
    if (lessonId && $lessonStore[lessonId]) {
      if (lastUpdatedPageNo !== pageNo) {
        lastUpdatedPageNo = pageNo;
        // Set timer
        hasReadPage = false;
        clearTimeout(timer);
        if (!$lessonStore[lessonId].pages[pageNo].hasOwnProperty("quiz")) timer = setTimeout(() => hasReadPage = true, 30000);
        // Get slate element refs
        const refs = document.getElementsByClassName("ref");
        for (let i = 0; i < refs.length; i++) {
          const [graphId, type, id] = refs[i].dataset.ref.split("-");
          const attr = $lessonStore[lessonId].graphs[graphId][ATTR[type]+"s"][id];
          if (type === "t" || type === "c") {
            refs[i].children[0].style.borderTop = `${attr.w}px ${DASH[attr.stroke]} ${attr.color}`;
          } else refs[i].children[0].style.color = attr.color;
          refs[i].addEventListener("click", () => highlight({id: attr.id, label: attr.label, type: ATTR[type], color: attr.color}))
        }
        // Get Param refs
        const pRefs = document.getElementsByClassName("param");
        for (let i = 0; i < pRefs.length; i++) {
          const id = pRefs[i].dataset.key;
          const label = $lessonStore[lessonId].params[id].label
          pRefs[i].addEventListener("click", () => highlight({id, label, type: "param", color: "#000"}))
        }
      }
    }
  });
</script>

<main id="lesson">
{#if topic}
<section class="lesson-head">
  <!--<a href="/learn/{topicId}"><p class="ts">◀ {@html topic.name}</p></a>-->
  {#if $lessonStore[lessonId]}
    <h1 class="rel pl3" on:click={toggleLessonList} >{$lessonStore[lessonId].title} <span class="i">v</span></h1>
    {#if showLessonList}
      <div class="menu cx tal">
        {#each topic.lessons as l}
          <div class="row">
            <a href="/learn/{topicId}/l.id" style="width: 20rem;" class:active={l.id === lessonId}>{l.title}</a>
          </div>
        {/each}
      </div>
    {/if}

    <div class="page-bars b0 z200">
      <button class="i bg0" on:click={() => gotoPage(pageNo-1)} disabled={pageNo===0}>(</button>
      {#each $lessonStore[lessonId].pages as p,idx}
        <button class="bg0 i" class:done={progress.indexOf(p.id) !== -1} on:click={() => gotoPage(idx)} class:active={pageNo===idx}>
          <span class="sr-only">page {idx}</span>{p.hasOwnProperty("notes")? "L" : "?"}
        </button>
      {/each}
      <button class="i bg0 rt180" on:click={() => gotoPage(pageNo+1)} disabled={pageNo>=$lessonStore[lessonId].pages.length-1}>(</button>
    </div>
  {/if}
</section>

<section class="lesson-body">
  {#if $lessonStore[lessonId]}
    {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("graphs")}
      <Graph graphs={$lessonStore[lessonId].graphs} params={$lessonStore[lessonId].params} {highlighted} {highlight}
        page={$lessonStore[lessonId].pages[pageNo].graphs} pageParams={$lessonStore[lessonId].pages[pageNo].params} />
    {/if}

    {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("notes")}
      <div class="notes">
        <article>
          {#each $lessonStore[lessonId].pages[pageNo].notes as block}
            {#if block.format === "im"}
              <ExpandableImage width={block.width} uri="/images/lessons/{lessonId}/{block.id}" alt={block.alt} caption={block.caption} />
            {:else if block.format === "q"}
              <Question id={block.id} />
            {:else if block.format === "md"}
              <span>{@html block.content}</span>
            {:else if block.format == "em"}
              <div style="width: {block.width}">
                {@html block.content}
              </div>
            {/if}
          {/each}
        </article>
      </div>
    {/if}

    {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("quiz")}
      {#if showQuiz}
        <Quiz level="lesson" levelId={lessonId} options={$lessonStore[lessonId].pages[pageNo].quiz} submit={submitQuiz} />
      {:else}
        <div class="tac">
          <h2>Ready for a  quiz?</h2>
          <button on:click={() => showQuiz = true} class="btn-primary btn-l">Start</button><br>
        </div>
      {/if}
    {/if}

  {/if}
</section>
{:else}
  <a href="/learn" class="error-redirect">
    <h2>Could Not Find Lesson</h2><p>Click anywhere to go back</p>
  </a>
{/if}
</main>
