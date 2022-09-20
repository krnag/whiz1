<script context="module">
  import { lessonStore, topicStore } from "$lib/stores/learn";
  import { get } from "svelte/store";
  import { browser } from "$app/env";
  export async function load({params, fetch}) {
    const topicId = params.topicId;
    let [lessonId, pageNo] = params.lessonId.split("/");
    //if (!get(topicStore)[topicId]) { // GET TOPIC
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
    if (!get(lessonStore)[lessonId]) { // GET LESSON
      const res = await fetch(`/courses/lessons/drafts/${lessonId}.json`)
      if (res.ok) {
        const lesson = await res.json(); 
        if (isNaN(pageNo)) { // Show page by id
          if (pageNo === undefined) pageNo = 0;
          else {
            const pageIdx = lesson.pages.findIndex(p => p.id === pageNo);
            pageNo = pageIdx !== -1 ? pageIdx : 0;
          }
        }
        else if (pageNo >= lesson.pages.length) pageNo = lesson.pages.length-1;
        lessonStore.update(l => {
          l[lessonId] = lesson;
          return l;
        });
      } else return { status: 404 };
    }
    pageNo = isNaN(pageNo) ? 0 : Number(pageNo);
    return { status: 200, props: {topicId, lessonId, pageNo} };
  };
</script>
<script>
  import { afterUpdate } from "svelte";
  import { makeId } from "$lib/helpers";
  import '$lib/styles/lesson.css';
  import BlockEditor from "$comp/BlockEditor.svelte";
  import GraphEditor from "$comp/GraphEditor.svelte";
  import QuestionEditor from "$comp/QuestionEditor.svelte";
  import Quiz from "$comp/Quiz.svelte";
  import Numeric from "$comp/inputs/Numeric.svelte";
  import Range from "$comp/inputs/Range.svelte";

  export let topicId = "", lessonId = "", pageNo=0;
  let topic = $topicStore[topicId];
  let showLessonList = false;
  let showQuiz = false, selectedQ;
  let pageId = $lessonStore[lessonId].pages[pageNo].id;

  async function gotoPage(n) {
    pageNo = n;
    pageId = $lessonStore[lessonId].pages[pageNo].id;
  };

  function closeQuestionEditor(refresh=false) {
    selectedQ = null;
    if (refresh) {
      showQuiz = false;
      setTimeout(() => showQuiz = true, 10);
    }
  };

  let highlighted = null;
  function highlight(obj=null) {
    if (obj && highlighted && highlighted.id === obj.id) highlighted = null;
    else highlighted = obj;
  };

  function toggleLessonList() { showLessonList = !showLessonList; }

  let newLessonTitle = "";
  async function createLesson() {
    const id = makeId();
    lessonId = id;
    const res = await fetch("/dashboard/lessons/", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({topic: topicId, id, title: newLessonTitle}),
    });
    if (res.ok) {
      $lessonStore[id] = {id, title: newLessonTitle, pages: [{id:makeId(4),notes:[]}], graphs: {}, params: {}};
      $topicStore[topicId].lessons[$topicStore[topicId].lessons.length] = {id, title: newLessonTitle};
      newLessonTitle = "";
    } else {
      error = res.err;
    }
  }

  let confirmDelete = null;
  let confirmPage;
  function closeModal() {confirmPage=null;confirmDelete=null};

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

  let showPageAddMenu = false;
  function togglePageAddMenu() {showPageAddMenu = !showPageAddMenu};
  function addPage(type) {
    if (type === "?") { $lessonStore[lessonId].pages.push({id: makeId(4), quiz:{n:5,d:1}}); }
    else $lessonStore[lessonId].pages.push({id: makeId(4), notes:[]});
    $lessonStore = $lessonStore;
    pageNo = $lessonStore[lessonId].pages.length - 1;
    showPageAddMenu = false;
  }
  function movePageL() {
    if (pageNo > 0) {
      $lessonStore[lessonId].pages.splice(pageNo-1, 0,$lessonStore[lessonId].pages.splice(pageNo, 1)[0]);
    } pageNo--;
    $lessonStore = $lessonStore;
  };
  function movePageR() {
    if (pageNo < $lessonStore[lessonId].pages.length-1) {
      $lessonStore[lessonId].pages.splice(pageNo+1, 0,$lessonStore[lessonId].pages.splice(pageNo, 1)[0])
    } pageNo++;
    $lessonStore = $lessonStore;
  };
  function removePage() {
    if (confirmPage) {
      pageNo--;
      $lessonStore[lessonId].pages.splice(pageNo+1,1);
      confirmPage = false;
      $lessonStore = $lessonStore;
    } else if (pageNo > 0) confirmPage = true;
  }
  function showAllGraph() {
    if ($lessonStore[lessonId].pages[pageNo].graphs) delete $lessonStore[lessonId].pages[pageNo].graphs;
    else $lessonStore[lessonId].pages[pageNo].graphs = [];
    $lessonStore = $lessonStore;
  }

  async function savePage() {
    let pages = $lessonStore[lessonId].pages;
    
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].hasOwnProperty("notes")) {
        for (let j = 0; j < pages[i].notes.length; j++) {
          if (pages[i].notes[j].src) delete pages[i].notes[j].src;
        }
      }
    }
    const res = await fetch("/dashboard/lessons/", {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id: lessonId, payload: { pages } }),
    });
    if (res.ok) {} else {}
  }

  let lastUpdatedPageNo;
  const ATTR = {c: "curve", t: "tangent", a: "area", o: "point"};
  const DASH = {d: "dotted", D: "dashed", S: "solid"};
  afterUpdate(() => {
    if (lessonId && $lessonStore[lessonId]) {
      if (lastUpdatedPageNo !== pageNo) {
        lastUpdatedPageNo = pageNo;
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

<main id="topic">
{#if topic}
<section class="lesson-head">
  <!--<a href="/dashboard/lessons/{topicId}"><p class="ts">◀ {@html topic.name}</p></a>-->
  {#if $lessonStore[lessonId]}
    <h1 class="rel pl3" on:click={toggleLessonList} >{$lessonStore[lessonId].title} <span class="i">v</span></h1>
    {#if showLessonList}
      <div class="menu cx tal">
        {#each topic.lessons as l}
          <div class="row">
            <a href="/dashboard/lessons/{topicId}/l.id" style="width: 20rem;" class:active={l.id === lessonId}>{l.title}</a>
            <button class="i" on:click={() => moveLesson(l.id, -1)}>^</button>
            <button class="i rt180" on:click={() => moveLesson(l.id, 1)}>^</button>
            <button class="i btn-d" on:click={() => confirmDelete = l.id}>t</button>
          </div>
        {/each}
        <div class="nw">
          <input type="text" bind:value={newLessonTitle} placeholder="Add Lesson">
          <button class="i" on:click={() => createLesson()} class:disabled={!newLessonTitle}>+</button>
        </div>
      </div>
    {/if}

    <div class="page-bars b0 z200">
      <button class="i p0 bg0 rt180" on:click={movePageL} disabled={pageNo===0}>)</button>
      <button class="i bg0" on:click={() => gotoPage(pageNo-1)} disabled={pageNo===0}>(</button>
      {#each $lessonStore[lessonId].pages as p,idx}
        <button class="bg0 i" on:click={() => gotoPage(idx)} class:active={pageNo===idx}>
          <span class="sr-only">page {idx}</span>{p.hasOwnProperty("notes")? "L" : "?"}
        </button>
      {/each}
      <span class="rel">
        <button class="i bg0" on:click={togglePageAddMenu}>+</button>
        {#if showPageAddMenu}
          <div class="menu" style="width:3rem">
            <button class="i bg0" on:click={() => addPage("")}>L</button>
            <button class="i bg0" on:click={() => addPage("?")}>?</button>
          </div>
        {/if}
      </span>
      <button class="btn-d i" on:click={removePage} disabled={pageNo===0}>t</button>
      <button class="i bg0 rt180" on:click={() => gotoPage(pageNo+1)} disabled={pageNo>=$lessonStore[lessonId].pages.length-1}>(</button>
      <button class="i p0 bg0" on:click={movePageR} disabled={pageNo>=$lessonStore[lessonId].pages.length-1}>)</button>
    </div>
  {:else}
    <input type="text" bind:value={newLessonTitle} placeholder="Add Lesson">
    <button class="i" on:click={() => createLesson()} class:disabled={!newLessonTitle}>+</button>
  {/if}
</section>

<section class="lesson-body">
  {#if $lessonStore[lessonId]}
    <div>
      {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("graphs")}
        <GraphEditor {lessonId} graphs={$lessonStore[lessonId].graphs} page={$lessonStore[lessonId].pages[pageNo].graphs} {savePage} {pageNo}
          params={$lessonStore[lessonId].params} {highlighted} {highlight} pageParams={$lessonStore[lessonId].pages[pageNo].params} />
        <button class="btn-primary" on:click={showAllGraph}>Hide All Graphs</button>
      {:else}
        <button class="btn-primary fx l0 m1 z200" on:click={showAllGraph}>Show Graph</button>
      {/if}
    </div>

    {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("notes")}
      <div class="notes">
        <BlockEditor bind:content={$lessonStore[lessonId].pages[pageNo].notes} imgDir="/images/lessons/{lessonId}/"
          ids={{subjectId:topic.subjectId, topicId, lessonId, pageId:$lessonStore[lessonId].pages[pageNo].id}}
          imgApi="/dashboard/lessons/upload-image/{lessonId}/" />
      </div>
    {/if}
    {#if $lessonStore[lessonId].pages[pageNo].hasOwnProperty("quiz")}
      {#if showQuiz}
        <Quiz level="lesson" levelId={lessonId}  selectQ={(q) => selectedQ = q} options={$lessonStore[lessonId].pages[pageNo].quiz} />
      {:else}
        <div class="tac">
          <h2>Ready for a  quiz?</h2>
          <button on:click={() => showQuiz = true} class="btn-primary btn-l">Start</button><br>
          <hr>
          <Numeric label="Quiz Length" bind:value={$lessonStore[lessonId].pages[pageNo].quiz.n} width="10rem" />
          <Range label="Difficulty" bind:value={$lessonStore[lessonId].pages[pageNo].quiz.d} min=1 max=3 step=1 width="8rem"/>
        </div>
      {/if}
        <button class="btn-l fx m1 b0" on:click={() => selectedQ = {}}><i>+</i> Question</button>
    {/if}
    <button on:click={savePage} class="fx b0 r0 m1 btn-success">Save Pages</button>
  {/if}
</section>
  {#if selectedQ}
    <QuestionEditor q={selectedQ} subjectId={topic.subjectId} {topicId} {lessonId} close={closeQuestionEditor}/>
  {/if}
{/if}

{#if confirmPage}
<div class="overlay" on:click={closeModal}>
  <div class="modal" on:click|stopPropagation>
    <p>Are you sure you want to delete page {pageNo+1}?</p>
    <button on:click={closeModal} class="btn-primary">Cancel</button>
    <button on:click={removePage} class="btn-danger">DELETE</button>
  </div>
</div>
{/if}

{#if confirmDelete}
<div class="overlay" on:click={closeModal}>
  <div class="modal" on:click|stopPropagation>
    <button on:click={closeModal} class="btn-primary">Cancel</button>
    <button on:click={removeLesson} class="btn-danger">DELETE</button>
  </div>
</div>
{/if}
</main>
