<script lang="ts">
  import { onMount } from "svelte";

  export let errors: string[] = [];
  export let label = "";
  export let required = false;
  export let value = "";
  export let width = "var(--idw)";
  export let icon = "";
  export let autofocus: boolean = false;
  export let spellcheck: boolean = false;

  let ref = null;

  onMount(() => {
    if (autofocus) ref.focus();
  })
</script>

<label style="width: {width};" class="input-label">
  {#if errors.length === 0}
    <p class="label-text" >{label}
      {#if required}
        <span class="label-text-note">required</span>
      {/if}
    </p>
  {:else}
    {#each errors as error}
      <p class="error-text">{error}</p>
    {/each}
  {/if}
  <input class="input" class:pl3={icon} class:input-err={errors.length !== 0} type="text" bind:value bind:this={ref} {spellcheck} >
  {#if icon}<span class="i">{icon}</span>{/if}
</label>

