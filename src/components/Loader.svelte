<script>
  export let color = "white";
  export let label = "";
</script>

<div class="dots">
  {#if label}<p style="color: {color}">{label}</p>{/if}
  <div class="d1" style="background-color: {color}"></div>
  <div class="d2" style="background-color: {color}"></div>
  <div class="d3" style="background-color: {color}"></div>
  <div class="d4" style="background-color: {color}"></div>
</div>

<style>
  p {
    font-size: var(--tr);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: .1;
    }
  }
  .dots {
    height: 4rem;
    text-align: center;
  }
  .dots div {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
  .d1 {
    animation: jump 1s .2s ease-in-out infinite;
  }
  .d2 {
    animation: jump 1s .4s ease-in-out infinite;
  }
  .d3 {
    animation: jump 1s .6s ease-in-out infinite;
  }
  .d4 {
    animation: jump 1s .8s ease-in-out infinite;
  }

  @keyframes jump {
    50% {
      transform: translate(0, 1rem);
    }
  }
</style>
