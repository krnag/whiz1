<script lang="ts">
  import { lex, postfix } from "$lib/evalutor";

  export let errors: string[] = [];
  export let label = "";
  export let value = "";
  export let rpn = [];
  export let width = "var(--idw)";

  function update() { rpn = postfix(lex(value)); };
</script>

<label style="width: {width};" class="input-label">
  {#if errors.length === 0}
    <p class="label-text" >{label}</p>
  {:else}
    {#each errors as error}
      <p class="error-text">{error}</p>
    {/each}
  {/if}
  <input class="input" class:input-err={errors.length !== 0} type="text" bind:value on:blur={update} >
</label>

