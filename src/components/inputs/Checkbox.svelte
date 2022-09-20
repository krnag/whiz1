<script>
  export let label = "";
  export let checked = false;
  export let width = "var(--idw)";
  export let icon = "";
  export let small = false;
</script>

<label style="cursor:pointer;width:{width};{small ? '':'padding-top:2rem'}" class="input-label">
  <input class="input" type="checkbox" bind:checked >
  {#if small}
  <p class="label-text block" style="margin:.6rem 0 -.3rem 0">{label}</p>
  {:else}
  <p style="width: calc({width} - 5rem - 4px)" class="switch-text">
    {#if icon}<span class="icon">{icon}</span>{/if}
    {label}
  </p>
  {/if}
  <div class="switch"></div>
</label>
