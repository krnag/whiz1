<script>
  //import { articleStore } from "$lib/stores/dashboard";
    import { getDate } from "$lib/helpers";
    export let articles = [];

  function publishArticle(post) {
    post.published = post.published ? 0 : Math.round(Date.now() / 1000)
    fetch(`/dashboard/edit/${post.id}/${post.slug}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(["publish", post.published]),
    });
    articles = articles;
  }
</script>

<div class="dashbar"></div>

<table>
  <thead>
    <th style="width: 40px;">Cover</th>
    <th>Title</th>
    <th>Views</th>
    <th>Tags</th>
    <th>Created</th>
    <th>Published</th>
  </thead>
  <tbody>
    {#each articles as post}
      <tr>
        <td><img src={`/articles/images/${post.id}/thumb.webp`} alt="cover"></td>
        <td style="text-align: left;">
          <a href="/dashboard/edit/{post.id}/{post.slug}" target="_blank" rel="noopener noreferrer">{post.title}</a>
          <a href="/blog/{post.slug}" target="_blank" rel="noopener noreferrer" class="i">G</a>
        </td>
        <td></td>
        <td></td>
        <td class="tc small">{getDate(post.created)}</td>
        <td class="tc small">{#if post.published}
          <button on:click={() => publishArticle(post)} class="i btn-success">i</button>
          {getDate(post.published)}
        {:else}
          <button on:click={() => publishArticle(post)}>Publish</button>
        {/if}</td>
      </tr>
    {/each}
  </tbody>
</table>
