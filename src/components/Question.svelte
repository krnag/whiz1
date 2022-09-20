<script>
  import markup from "$lib/md";
  import { URL } from "$lib/helpers"

  export let id = undefined;
  export let q = undefined;
  export let selectQ = null;
  let choices;
  let check = false;
  if (q === undefined) getQ();
  else choices = JSON.parse(q.choices);

  async function getQ() {
    const res = await fetch(`${URL}learn/questions/${id}`);
    if (res.ok) {
      q = await res.json(); 
      choices = JSON.parse(q.choices);
    } 
  }

  function toggleCheck() {check = !check};

  let chosen, isCorrect;
  function choose(idx,corr) {
    chosen = idx;
    isCorrect = corr;
  };
  const CHAR = ["a", "b", "c", "d", "e", "f", "g"]
</script>

{#if q !== undefined}
  <div class="q-card">
    <div class="question {!check ? '' : isCorrect ? 'correct' : 'wrong'}">
      <span class="i t2l t-info">?</span> <span class="ib">{@html markup(q.question)}</span>
      {#each choices as ch, idx}
        <div class="choice" class:active={chosen === idx} on:click={() => choose(idx,ch.isCorrect)} >
          <b class="index">{CHAR[idx]}</b>{@html markup(ch.text)}
        </div>
      {/each}
    </div>
    <button class="btn-primary mt1" on:click={toggleCheck}>{check ? "Retry" : "Check"}</button>

    {#if selectQ !== null}
      <button on:click={() => selectQ(q)} class="ab i t0 r0">e</button>
    {/if}
  </div>
{/if}
