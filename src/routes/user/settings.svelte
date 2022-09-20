<script context="module">
  export async function load({ props }) {
    if (!props.username) return {
      status: 303,
      redirect: "/accounts/login"
    };
    return { props };
  }
</script>

<script lang="ts">
  import { user } from "$lib/stores/user";
  import Hero from "$comp/Hero.svelte";
  import Image from "$comp/inputs/Image.svelte";

  export let username: string;
  export let email: string;
  export let has_avatar: number;

  let src = has_avatar ? `/images/user/avatar/${username}.webp` : "/images/user/avatar.jpg";

  function setUri() {
    src = `/images/user/avatar/${username}.webp?${Date.now()}`
    $user.avatar = true;
  };
</script>

<section class="user-head">
  <Hero cover={1.5} scheme={4} />
  <div class="abcent">
    <h1>User Settings</h1>
    <Image {src} api={"/user/avatar/"} uri={username} {setUri} type="avatar" />
    <h2>{username}</h2>
    <p>{email}</p>
  </div>
</section>

<section class="user-settings">
  <div class="row">
    <div class="title">some setting</div>
    <div>blah blah</div>
  </div>
  <div class="row">
    <div class="title">Email</div>
    <div>some thing else</div>
  </div>
</section>

<style>
  .user-head {
    position: relative;
  }
  .abcent {
    color: var(--bg);
    text-align: center;
  }
  .abcent > h1 {
    font-size: var(--tm);
    font-family: var(--fbody);
  }
  .abcent > h2 {
    font-size: var(--t3l);
  }
  .user-settings {
    padding: 6rem;
  }
  .row {
    border-bottom: 1px solid #ccc;
  }
  .row:last-child {
    border-bottom: none;
  }
  .row > div {
    display: inline-block;
    padding: 1rem;
  }
  .row .title {
    width: 30%;
    font-weight: bold;
  }
</style>
