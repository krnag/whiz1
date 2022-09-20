<script lang="ts">
  import Hero from "$comp/Hero.svelte";
  import '$lib/styles/dashboard.css';
  import { page } from "$app/stores";

</script>

<section class="head">
  <Hero cover={4} scheme={5} />
  <h1>Dashboard</h1>
</section>

<div class="tabs">
  <a href="/dashboard" class:active={$page.url.pathname === "/dashboard"}
    class="tab" >Overview</a>

  <a class="tab" class:active={$page.url.pathname === "/dashboard/courses"}
     href="/dashboard/courses" >Lessons</a>

  <a class="tab" class:active={$page.url.pathname === "/dashboard/questions"}
     href="/dashboard/questions" >Questions</a>

  <a class="tab" class:active={$page.url.pathname === "/dashboard/articles"}
     href="/dashboard/articles" >Articles</a>
  <a class="tab i combo" class:bg1={$page.url.pathname === "/dashboard/articles"}
     href="/dashboard/edit/0/-" target="_blank">+</a>

  <a class="tab" class:active={$page.url.pathname === "/dashboard/users"}
     href="/dashboard/users" >Users</a>
</div>

<section class="dash-body">
  <slot></slot>
</section>
