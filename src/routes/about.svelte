<script>
  import Hero from "$comp/Hero.svelte";
</script>

<section class="head" style="height: 50vh;">
  <Hero cover={2} scheme={0} />
  <h1>Enkydu</h1>
  <h2 class="abcent">The <i>free</i> learning platform</h2>
</section>

<style>
  h2 {
    top: 18rem;
    font-size: var(--t4l);
    text-align: center;
    color: var(--bg);
  }
</style>
