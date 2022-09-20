<script>
  export let label = "";
  export let required = false;
  export let value = [];
  export let width = "var(--idw)";
  export let minLength = 3;
  let name = "";
  let listening = false;

  function addTag() {
    if (name.length >= minLength) {
      value.push(name.trim());
      value = value;
      name = "";
    } // TODO: else handle error
  };
  function removeTag(index) {
    value.splice(index, 1);
    value = value;
  };
  function listen(e) {
    if (e.code === "Enter") {
      e.preventDefault()
      addTag();
    }
  }
  function toggleListener() {
    if (listening) {
      listening = false;
      window.removeEventListener("keydown", (e) => listen(e))
    } else {
      listening = true;
      window.addEventListener("keydown", (e) => listen(e))
    }
  };
</script>

<div style="width: {width};" class="input-label">
  <label>
    <p class="label-text" >{label}
      {#if required}
        <span class="label-text-note">required</span>
      {/if}
    </p>
    <input class="input" type="text" bind:value={name}  on:focus={toggleListener} on:blur={toggleListener}>
  </label>
  <div class="tags">
    {#each value as tag, idx}
      <span>{tag}
        <button on:click={() => removeTag(idx)} class="icon" type="button">x</button>
      </span>
    {/each}
  </div>
</div>

<style>
  .tags {
    margin-top: .6rem;
    width: 100%;
  }
  .tags > span {
    padding: .4rem 1rem;
    border-radius: 3px;
    background-color: var(--page);
    box-shadow: var(--sh2);
    margin: 2px;
    white-space: nowrap;
  }
  .icon {
    padding: 0;
    font-size: var(--ts);
    margin-right: -4px;
    background-color: var(--page);
  }
</style>
