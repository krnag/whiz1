<script>
  import '$lib/styles/quiz.css';

  export let title = "Test Your Knowledge";
  export let level, levelId;
  export let submit = (pct) => pct;
  export let selectQ = null;
  export let options = {d:1, n:10};
  let questions = [];
  let choices = [];
  let chosen = [];
  let isCorrect = [];
  let completed = false;
  let score = 0;

  if (level && levelId) getQuestions();

  async function getQuestions() {
    const res = await fetch(`/learn/questions/${level}/${levelId}/${options.n}/${options.d}`);
    if (res.ok) {
      const data = await res.json(); 
      questions = data.questions;
      for (let i = 0; i < questions.length; i++) {
        choices[i] = JSON.parse(questions[i].choices);
      }
    } 
  }

  const CHAR = ["a", "b", "c", "d", "e", "f", "g"]

  async function submitQuiz() {
    const l = questions.length;
    for (let i = 0; i < l; i++) {
      const answer = choices[i].find(c => c.id === chosen[i]);
      if (answer && answer.isCorrect) {
        score++;
        isCorrect[i] = true;
      } else isCorrect[i] = false;
    };
    if (options.n > 0) submit(score/options.n*100);
    completed = true;
  };
</script>
<section class="quiz" >
  <h2>{title}</h2>

{#each questions as question, index}
  <div class="q-card {!completed ? '' : isCorrect[index] ? 'correct' : 'wrong'}" >
    {#if questions.length > 1}<span class="q-index">{index+1}.</span>{/if}
    <div class="question">
      {#if question.cover}
        <img src="/images/quiz/{question.id}/cover.webp" alt="Question specific">
      {/if}
      {@html question.question}
  
      {#each choices[index] as ch, idx}
        <div class="choice" class:active={chosen[index] === ch.id} on:click={() => chosen[index] = ch.id}>
          <b class="index">{CHAR[idx]}</b>
          {#if question.has_images}
            <img src="/images/quiz/{question.id}/{ch.id}.webp" alt={ch.text}>
          {/if}
          {@html ch.text}
        </div>
      {/each}

    {#if completed }
      {#if question.explanation}
        <div class="explanation">
          {@html question.explanation}
        </div>
      {/if}
      {#if question.topic_id}
        <a href="/learn/{question.topic_id}/{question.lesson_id}" class="block tar">Learn more <i class="ib rt90">^</i></a>
      {/if}
    {/if}
    </div>

    {#if selectQ !== null}
      <button on:click={() => selectQ(question)} class="ab i">e</button>
    {/if}
  </div>
{/each}

<br><br>
{#if completed}
  Score: {score} / {questions.length}
{:else}
  <button class="btn-primary" on:click={submitQuiz}>Finish</button>
{/if}
</section>
