<script>
  import markup from "$lib/md";

  export let label = "";
  export let value = "";
  export let html = "";
  export let width = "100%";
  export let rows = "8";
  export let count = false;

  function update() { html = markup(value) };
</script>

<label style="width:{width};" class="input-label">
  <p class="label-text">{label}
    {#if count}
      <span class="label-text-note">{value.length} characters</span>
    {/if}
    </p>
  <textarea class="input mono" bind:value on:blur={update} {rows}></textarea>
</label>
