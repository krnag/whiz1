<script lang="ts">
  export let errors: string[] = [];
  export let label: string = "";
  export let required = false;
  export let value = "";
  export let width = "100%";
  export let rows = "2";
</script>

<label style="width: {width};" class="input-label">
  {#if errors.length === 0}
    <p class="label-text" class:required >{label}
      {#if required}
        <span class="label-text-note">required</span>
      {/if}
      <span class="label-text-note">
        {value.length > 0 ? value.length + " characters" : ""}</span>
    </p>
  {:else}
    {#each errors as error}
      <p class="error-text">{error}</p>
    {/each}
  {/if}
  <textarea class="input" class:input-err={errors.length !== 0} bind:value style="width: {width};" {rows}></textarea>
</label>
