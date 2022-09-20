<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { user } from "$lib/stores/user";
  import '$lib/styles/styles.css';

  import Messages from "$comp/snackbar/Messages.svelte";

  let y = 0;
  let showNav = false;
  let showMenu = false;

  async function logout() {
    const res = await fetch("/accounts/logout", {method: "POST"});
    if (res.ok) {
      localStorage.removeItem('user');
      $user = null;
      const path = $page.url.pathname;
      if (!path.indexOf("/learn") || !path.indexOf("/user")) goto("/");
    };
  }
</script>

<svelte:window bind:scrollY={y} />

<header class:solid={y > 60}>
  <a tabindex="-1" href="/{$user && $user.role ? 'dashboard' : ''}"><img style="height:4rem" src="/logo.svg" alt="logo"></a>
  <input type="checkbox" >
  <div class="ham" on:click={()=>showNav = !showNav}>
    <nav class:fold={!showNav}>
      {#if $user}
        <div class="u-menu">
          <ul class:fold={!showMenu} class="br">
            <li><a href="/user">My Courses</a></li>
            <li><a href="/user/settings">User Settings</a></li>
            <li><button class="a" on:click={logout}>Logout</button></li>
          </ul>
          <div class="avatar" on:click={() => showMenu = !showMenu}>
            <img src="/images/user/avatar{$user.avatar ? `/${$user.username}`: ""}.webp" alt="avatar">
          </div>
        </div>
      {/if}
      <ul>
        <li><a href="/" class="i">h</a></li>
        <li><a href="/learn">Start Learning</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      {#if !$user}
        <ul>
          <li><a href="/accounts/login">Login</a></li>
          <li><a href="/accounts/register" class="btn-success br">Join</a></li>
        </ul>
      {/if}
    </nav>
    <div class="ham i">=</div>
  </div>




  <!--  <input type="checkbox" id="nav-toggle">
  <nav>
    <ul>

      {#if $user}
        <li on:click={() => showMenu = !showMenu}>
          <span class="user-btn">
            {$user.username}
            {#if $user.avatar}
              <img src="/images/user/avatar/{$user.username}.webp" alt="avatar">
            {:else}
              <img src="/images/user/avatar.jpg" alt="avatar">
            {/if}
          </span>
          {#if showMenu}
            <div class="user-menu">
              <a href="/user">My Courses</a>
              <a href="/user/settings">User Settings</a>
              <li><button on:click={logout}>Logout</button></li>
            </div>
          {/if}
        </li>
      {:else}
        <li><a href="/accounts/login">Login</a></li>
        <li><a class="btn-join" href="/accounts/register">Sign Up</a></li>
      {/if}
    </ul>
  </nav>
  <label for="nav-toggle" id="hamburger">X </label>-->
</header>

<slot></slot>

<Messages />
