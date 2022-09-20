<script>
  const colors = [
    //["#ef9a9a","#e57373","#ef5350","#f44336","#e53935","#d32f2f","#c62828","#b71c1c"],
    //["#f48fb1","#f06292","#ec407a","#e91e63","#d81b60","#c2185b","#ad1457","#880e4f"],
    //["#ce93d8","#ba68c8","#ab47bc","#9c27b0","#8e24aa","#7b1fa2","#6a1b9a","#4a148c"],
    //["#9fa8da","#7986cb","#5c6bc0","#3f51b5","#3949ab","#303f9f","#283593","#1a237e"],
    //["#90caf9","#64b5f6","#42a5f5","#2196f3","#1e88e5","#1976d2","#1565c0","#0d47a1"],
    //["#80deea","#4dd0e1","#26c6da","#00bcd4","#00acc1","#0097a7","#00838f","#006064"],
    //["#a5d6a7","#81c784","#66bb6a","#4caf50","#43a047","#388e3c","#2e7d32","#1b5e20"],
    //["#fff59d","#fff176","#ffee58","#ffeb3b","#fdd835","#fbc02d","#f9a825","#f57f17"],
    //["#ffcc80","#ffb74d","#ffa726","#ff9800","#fb8c00","#f57c00","#ef6c00","#e65100"],
    //["#ffab91","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c"],
    //['#ffe5f7','#fabadc','#f18ec0','#ea62a2','#e23681','#c91d72','#9d1462','#720c4d','#460533','#1d0016'],
    //['#ffe4eb','#fdb7c5','#f6899b','#f15b6e','#eb2d3f','#d21432','#a40c31','#76072a','#49021c','#1f000b'],
    //['#ffeadd','#fecab3','#f9ae86','#f49357','#f07c29','#d6550f','#a8380a','#781f05','#490c00','#1f0002'],
    //['#fff4da','#ffe6ad','#ffda7d','#ffd24b','#ffcc1a','#e6bb00','#b38500','#805700','#4e2e00','#1c0d00'],
    //['#e4fced','#c2edd3','#9ee0b5','#78d296','#53c575','#3aac58','#2b8649','#1d5f39','#0d3a23','#001509'],
    //['#e0f0ff','#b1cfff','#81afff','#4f8ffb','#206ff9','#0656df','#0043af','#00307e','#001d4e','#000a20'],
    //['#f6e6ff','#ddbafa','#c98df2','#b860ec','#a934e5','#951acb','#6b139f','#460d73','#260647','#0d001c']

    ['#f18ec0','#ea62a2','#e23681','#c91d72','#9d1462','#720c4d'],
    ['#f6899b','#f15b6e','#eb2d3f','#d21432','#a40c31','#76072a'],
    ['#f9ae86','#f49357','#f07c29','#d6550f','#a8380a','#781f05'],
    ['#ffda7d','#ffd24b','#ffcc1a','#e6bb00','#b38500','#805700'],
    ['#9ee0b5','#78d296','#53c575','#3aac58','#2b8649','#1d5f39'],
    ['#81afff','#4f8ffb','#206ff9','#0656df','#0043af','#00307e'],
    ['#c98df2','#b860ec','#a934e5','#951acb','#6b139f','#460d73'],
    ['#fff','#ccc','#999','#666','#333','#000']
  ]

  export let value
  if (!value) value = colors[Math.floor(Math.random()*6)][Math.floor(Math.random()*6)];
  export let label = "";
  export let width = "2.6rem";

  let showPicker = false;
  let fadeTimeout = null;

  function togglePicker() {
    showPicker = !showPicker;
  }

  function startFade() {
    if (showPicker) fadeTimeout = setTimeout(() => { showPicker = false }, 500);
  };
  function stopFade() {
    if (showPicker) clearTimeout(fadeTimeout);
  };
</script>

<label class="input-label" style="{label ? `width: ${width};` : ''}"
  class:aln-btm={!label} on:mouseleave={startFade} on:mouseenter={stopFade}>
  {#if label}
    <p class="label-text pl0">{label}</p>
  {/if}
  <button class="btn-colorpick" type="button" on:click={togglePicker}
    style="background-color: {value};"></button>

  {#if showPicker}
    <div class="picker">
      <div>
        {#each colors as column}
          <div>
            {#each column as color}
              <label style="background-color: {color};">
                <input class="hide" type="radio" bind:group={value} name="color" value={color}>
                <span class="i">x</span>
              </label>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</label>


<style>
  .picker {
    position: absolute;
    padding: .3rem;
    border-radius: .6rem;
    background:var(--primary4);
    z-index: 20
  }
  .picker > div {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
  }
  .picker label {
    cursor: pointer;
  }
  .picker .i {
    border-radius: 3px;
    color:white;
    border: .3rem solid var(--info1);
    opacity: 0;
  }
  .picker input:checked + .i {
    opacity: 1;
  }
</style>
