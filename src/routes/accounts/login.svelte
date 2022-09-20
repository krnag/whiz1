<script context="module">
  export async function load({ props }) {
    if (props.hasToken) return {
      status: 303,
      redirect: "/"
    };
    return {};
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { transmit } from "$lib/stores/snackbar";

  import { user } from '$lib/stores/user';
  import { isEmail } from "$lib/helpers";

  import Hero from "$comp/Hero.svelte";
  import Text from "$comp/inputs/Text.svelte";
  import Password from "$comp/inputs/Password.svelte";
  import Loader from '$comp/Loader.svelte';

  let username = "";
  let password = "";
  let isLoading = false;

  let errors = {count:0, username: [], password: []};
  async function handleSubmit() {
    errors = {count:0, username: [], password: []};
    if (username.length < 4) {
      errors.username.push("Username must be at least 4 characters long.");
      errors.count++;
    }
    if (password.length < 6) {
      errors.password.push("Password must be at least 6 characters long.");
      errors.count++;
    }
// Send credentials
    if (errors.count === 0) {
      isLoading = true;
      let auth = <any>{password}
      if (isEmail(username)) {
        auth.email = username;
      } else {
        auth.username = username;
      }

      let res = await fetch("auth/login", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(auth),
      });
      if (res.ok) {
        const { usr, avatar, role, progress, id } = await res.json()
        $user = { username: usr, avatar, role, progress, id };
        transmit({success: `Welcome back, <b>${usr}</b>.`});
        if (role) goto("/dashboard")
        else goto("/user");
      } else {
        if (res.status === 400) {
          transmit({error: "<b>Wrong Credentials.</b> Please check if the email/username and password are correct."});
        } else if (res.status === 401) {
          transmit({error: "This user is no longer active."});
        } else {
          transmit({error:"<b>Internal Server Error.</b>Please try again in some time"});
        }
      }
      isLoading = false;
    }
  }
</script>



<Hero scheme={6} />

<div class="abcent">
  <h1 class="h2 t-bg1 tac">Login</h1>
  <form method="post" style="color:var(--bg1);width:80vw;max-width:60rem" on:submit|preventDefault={handleSubmit}>
    <Text icon="u" bind:value={username} width="100%" label="Email address or Username" errors={errors.username} autofocus/>
    <Password bind:value={password} width="100%" label="Password" errors={errors.password}/>
    <br><br>
    <div class="jll">
      <label><input type="checkbox"><span class="check"></span>Remember Me</label>
      <a class="t-bg1" href="/accounts/reset-password">Forgot Password?</a>
    </div>
    <button class="btn-form" type="submit">
      {#if isLoading}
        <Loader />
      {:else}
        Login
      {/if}
    </button>
  </form>
  <a class="t-bg1 tar block" href="/accounts/register">...or create an account</a>
</div>

