<script lang="ts">
  export let errors: string[] = [];
  export let label = "";
  export let value = "";
  export let width = "var(--idw)";
</script>

<label style="width: {width};" class="input-label">
  {#if errors.length === 0}
    <p class="label-text" >{label}</p>
  {:else}
    {#each errors as error}
      <p class="error-text">{error}</p>
    {/each}
  {/if}
  <input class="input pl3" class:input-err={errors.length !== 0} type="password" bind:value >
  <span class="i">P</span>
</label>

