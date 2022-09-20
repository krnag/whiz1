<script lang="ts">
  export let errors: string[] = [];
  export let label = "";
  export let required = false;
  export let value = "";
  export let width = "var(--idw)";
  export let icon = "";
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
  <input class="input" class:input-err={errors.length !== 0} type="number" bind:value >
  {#if icon}
    <img src="/images/icons/{icon}.png" alt="label">
  {/if}
</label>

