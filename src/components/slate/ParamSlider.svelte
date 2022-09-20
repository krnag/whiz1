<script>
  export let key;
  export let param;
  export let page;
  export let updateParam;
  export let focus;
  export let highlight;

  function setHighlight() {
    highlight({id: key, label: param.label, type: "param", color: "#000"})
  }

  let value = page.value || param.value;
  function setValue() {
    setTimeout(() => {
      if (!isNaN(value)) updateParam(key, value);
    },0);
  }
</script>

<div class="row" class:ol={focus}>
  <b on:click={setHighlight} class="usn cpt" >{@html param.tag}</b>
  <label class="slider">
    <input type="range" on:input={setValue} bind:value style="outline:none"
      min={page.min || param.min} max={page.max || param.max} step={page.step || param.step} >
  </label>
</div>
