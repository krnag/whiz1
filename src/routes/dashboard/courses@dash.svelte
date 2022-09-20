<script context="module">
  import { subjectStore, disciplines } from "$lib/stores/learn";
  import { get } from "svelte/store";
  export async function load({fetch}) {
    if (get(subjectStore).length === 0) {
      const res = await fetch('/courses/subjects.json')
      if (res.ok) {
        const data = await res.json(); 
        disciplines.set(data.disciplines);
        subjectStore.set(data.subjects);
      } else return { status: 400 }
    }
    return { status: 200 }
  }
</script>
<script>
  import { getDate, makeId, now } from "$lib/helpers";

  import Text from "$comp/inputs/Text.svelte"
  import Image from "$comp/inputs/Image.svelte"

  let showTopics = null;
  function toggleTopics(id) {
    if (showTopics === id) showTopics = null; 
    else showTopics = id;
  }
  let delD = null, delS = null, delT = null;
  function clearDs() {delD=null;delS=null;delT=null};

  let discOb = {};
  genDiscOb();
  function genDiscOb() {
    discOb = {};
    for (let i = 0; i < $disciplines.length; i++) {
      discOb[$disciplines[i].id] = $disciplines[i].name;
    };
  };

  let error = "";

  let showDiscs = false;
  function toggleDiscs() {showDiscs = !showDiscs};
  let selectedDisc = null;
  function setDisc(disc=null) { selectedDisc = disc; };

  async function updateDisc() {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({...selectedDisc, type: "discipline"}),
    });
    if (res.ok) {
      const found = $disciplines.find(d => d.id === selectedDisc.id);
      if (found) found.name = selectedDisc.name;
      else $disciplines.push({id:selectedDisc.id, name:selectedDisc.name})
      $disciplines = $disciplines;
      genDiscOb();
      selectedDisc = null;
    } else error = res.err;
  };
  async function removeDisc() {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id:delD, type: "discipline", remove: true}),
    });
    if (res.ok) {
      $disciplines = $disciplines.filter(d => d.id !== delD);
      delD = null;
    } else error = res.err;
  };

  let selectedSubject = null;
  function setSubject(subject=null) { selectedSubject = subject; };

  async function updateSubject() {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({...selectedSubject, type: "subject"}),
    });
    if (res.ok) {
      const found = $subjectStore.find(s => s.id === selectedSubject.id);
      if (found) {
        found.name = selectedSubject.name;
        found.disc = selectedSubject.disc;
      }
      else $subjectStore.push({disc:selectedSubject.disc, id:selectedSubject.id, name:selectedSubject.name, topics:[], created: now(), edited:0})
      $subjectStore = $subjectStore;
      selectedSubject = null;
    } else {
      error = res.err;
    }
  };
  async function removeSubject() {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id:delS, type: "subject", remove: true}),
    });
    if (res.ok) {
      $subjectStore = $subjectStore.filter(s => s.id !== delS);
      delS = null;
    } else {
      error = res.err;
    }
  };
  async function moveSubject(id, position) {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({id, position, type: "subject"}),
    });
    if (res.ok) {
      const from = $subjectStore.findIndex(s => s.id === id);
      $subjectStore.splice(from+position, 0, $subjectStore.splice(from, 1)[0]);
      $subjectStore = $subjectStore;
    } else {
      error = res.err;
    }
  };

  
  let selectedTopic = null;
  function setTopic(topic=null) { selectedTopic = topic; };
  async function updateTopic() {
    if (selectedTopic.name.length < 2) {
      error = "Topic must have a name";
    } else {
      error = "";
      const res = await fetch("/dashboard/courses/", {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({...selectedTopic, type: "topic"}),
      });
      if (res.ok) {
        const sI = $subjectStore.findIndex(s => s.id === selectedTopic.subject);
        const found = $subjectStore[sI].topics.find(t => t.id === selectedTopic.id);
        if (found) found.name = selectedTopic.name;
        else $subjectStore[sI].topics.push({id:selectedTopic.id,
          name:selectedTopic.name,
          created: now(),
          subjectId: $subjectStore[sI].id,
          edited:0});
        $subjectStore = $subjectStore;
        selectedTopic = null;
      } else {
        error = res.err;
      }
    }
  };
  async function removeTopic() {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({subject:delS, id:delT, type: "topic", remove: true}),
    });
    if (res.ok) {
      const sI = $subjectStore.findIndex(s => s.id === delS);
      const filTopics = $subjectStore[sI].topics.filter(t => t.id !== delT);
      $subjectStore[sI].topics = filTopics;
      delS = null;delS = null;
    } else {
      error = res.err;
    }
  };
  async function moveTopic(subject, id, position) {
    const res = await fetch("/dashboard/courses/", {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({subject, id, position, type: "topic"}),
    });
    if (res.ok) {
      const sI = $subjectStore.findIndex(s => s.id === subject);
      const from = $subjectStore[sI].topics.findIndex(t => t.id === id);
      $subjectStore[sI].topics.splice(from+position, 0, $subjectStore[sI].topics.splice(from, 1)[0]);
      $subjectStore = $subjectStore;
    } else {
      error = res.err;
    }
  };
</script>

<div class="dashbar">
  <button on:click={() => setDisc({name:"", id: makeId(5)})} ><i>+</i> Discipline</button>
  <div class="combo"><button on:click={toggleDiscs} class="i">v</button>
    {#if showDiscs}
      <div class="menu">
        {#each $disciplines as disc}
          <div class="row nw jll">
            <button on:click={() => setDisc(disc)} class="i">e</button>
            {disc.name}
            <button on:click={() => delD=disc.id} class="i btn-d">t</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <button on:click={() => setSubject({name:"", id: makeId()})} ><i>+</i> Subject</button>
  
</div>
<table>
  <thead>
    <th>#</th>
    <th>Discipline</th>
    <th>Subject</th>
    <th>Created</th>
    <th>Edited</th>
  </thead>
  <tbody>
    {#each $subjectStore as sub, idx}
      <tr>
        <td class="small stay-up" style="padding-inline:0">
          <button on:click={() => moveSubject(sub.id, -1)} class="i" class:disabled={idx === 0}>^</button>
          {idx + 1}
          <button on:click={() => moveSubject(sub.id, 1)} class="i rt180" class:disabled={idx === $subjectStore.length -1}>^</button>
        </td>
        <td class="small stay-up">{discOb[sub.disc]}</td>
        <td style="min-width:60vw;text-align:left">
          <button on:click={() => toggleTopics(sub.id)} class="tx1 bg0">
            <i>v</i>
            <b>{sub.name}</b>
          </button>
          {sub.topics.length}
          <button on:click={() => setTopic({subject: sub.id, name:"", id: makeId()})} class="i">+</button>
          <button on:click={() => setSubject({id: sub.id, name: sub.name})} class="i">G</button>
          <button on:click={() => delS = sub.id} class="i btn-d">t</button>

          {#if showTopics === sub.id}
            <table >
              {#each sub.topics as top, ind}
                <tr>
                  <td style="padding:0;width: .7rem;border-right: 1px solid var(--tx2)"></td>
                  <td style="padding:0;width: .7rem;white-space: normal;">
                    <button class:disabled={ind === 0} on:click={() => moveTopic(sub.id, top.id, -1)} class="i">^</button>
                    <button class:disabled={ind === sub.topics.length - 1} on:click={() => moveTopic(sub.id, top.id, 1)} class="i rt180">^</button>
                  </td>
                  <td style="padding: 0;width: 6rem;">
                    <Image src="/images/topics/{top.id}.webp"
                      uri={top.id} api="/dashboard/lessons/upload-cover/" 
                      style="width: 6rem;height: 6rem;" label="Change"/>
                  </td>
                  <td style="text-align: left;">
                    <a href="/dashboard/lessons/{top.id}" class="topic">{@html top.name}</a>
                    <button on:click={() => setTopic({subject: sub.id, name:top.name, id: top.id})} class="i">G</button>
                    <button on:click={() => {delS=sub.id; delT=top.id}} class="i btn-d">t</button>
                    <p class="small">{getDate(top.created)} | {getDate(top.edited)}</p>
                  </td>
                </tr>
              {/each}
            </table>
          {/if}
        </td>
        <td class="small stay-up">{getDate(sub.created)}</td>
        <td class="small stay-up">{getDate(sub.edited)}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if selectedDisc}
  <div class="overlay" on:click={() => setDisc(null)}><div class="modal" on:click|stopPropagation>
    {#if error}
      <p class="error-text">{error}</p>
    {/if}
    <Text bind:value={selectedDisc.name} label="Discipline" />
    <button class="btn-form" on:click={updateDisc}>Confirm</button>
  </div></div>
{/if}

{#if selectedTopic}
  <div class="overlay" on:click={() => setTopic(null)}><div class="modal" on:click|stopPropagation>
    {#if error}
      <p class="error-text">{error}</p>
    {/if}
    <Text bind:value={selectedTopic.name} label="Topic Name" />
    <button class="btn-form" on:click={updateTopic}>Confirm</button>
  </div></div>
{/if}

{#if selectedSubject}
  <div class="overlay" on:click={() => setSubject(null)}><div class="modal" on:click|stopPropagation>
    <label class="input-label"><span class="label-text">Discipline</span>
    <select class="input" bind:value={selectedSubject.disc}>
      {#each $disciplines as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select></label>
    <Text bind:value={selectedSubject.name} label="Subject Name" />
    <button class="btn-form" on:click={updateSubject}>Confirm</button>
  </div></div>
{/if}


{#if delS || delD}
  <div class="overlay" on:click={clearDs}><div class="modal" on:click|stopPropagation>
      <h2 class="h4">Confirm Delete</h2>
      <span>Are you sure?</span>
      {#if delD}
        <button class="btn-danger" on:click={removeDisc}>Delete Discipline</button>
      {:else if delT}
        <button class="btn-danger" on:click={removeTopic}>Delete Topic</button>
      {:else}
        <button class="btn-danger" on:click={removeSubject}>Delete Subject</button>
      {/if}
  </div></div>
{/if}
