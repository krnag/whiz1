<script lang="ts">
  import Hero from "$comp/Hero.svelte";
  export let articles = [];
</script>

<section class="head" style="height: 25vh;">
  <Hero cover={4} scheme={2} />
  <h1>Blog</h1>
</section>

<section class="blog-grid" style="padding: 6rem;">
  {#each articles as post}
    <div class="post-tile">
      <a href="blog/{post.slug}">
        <img src="/articles/images/{post.id}/thumb.webp" alt="Thumbnail for {post.title}">
        <h2>{post.title}</h2>
        <p>{post.subtitle.slice(0, 100)}</p>
      </a>
    </div>
  {/each}
</section>

<style>
  .blog-grid a {
    height: 18rem;
    display: block;
  }
  .blog-grid img {
    width: 12rem;
    float: left;
    border-radius: 4px;
    margin-right: 2rem;
  }
</style>
