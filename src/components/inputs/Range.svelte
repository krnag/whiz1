<script>
  export let label = "";
  export let value = 5;
  export let width = "var(--idw)";
  export let min = '0';
  export let max = '10';
  export let step = '.2';
  export let ordinal=false;
</script>

<label style="width: {width};" class="input-label">
  <p class="label-text" >{label}
  {#if !ordinal}<span class="range-value">{value}</span>{/if}
  </p>
  <input class="input range" type="range" bind:value {min} {step} {max} >
</label>
