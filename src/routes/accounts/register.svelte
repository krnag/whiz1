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

  import { user } from '$lib/stores/user';
  import { transmit } from "$lib/stores/snackbar";
  import { isEmail } from "$lib/helpers";

  import Hero from "$comp/Hero.svelte";
  import Text from "$comp/inputs/Text.svelte";
  import Password from "$comp/inputs/Password.svelte";
  import Loader from '$comp/Loader.svelte';

  let username = "";
  let email = "";
  let password = "";
  let password2 = "";
  let errors = {count:0, username: [], password: [], password2: [], email: []};
  let isLoading = false;

  async function handleSubmit() {
    errors = {count:0, username: [], password: [], password2: [], email: []};
    if (username.length < 3) {
      errors.username.push("Username must be at least 3 characters long.");
      errors.count++;
    }
    if (username.indexOf("@") !== -1) {
      errors.username.push("Username cannot have the '@' character.");
      errors.count++;
    }
    if (!isEmail(email)) {
      errors.email.push("Email address must be valid.");
      errors.count++;
    }
    if (password.length < 6) {
      errors.password.push("Password must contain at least 6 characters.");
      errors.count++;
    }
    if (password !== password2) {
      errors.password2.push("Passwords do not match!");
      errors.count++;
    }
    if (errors.count === 0) {
      isLoading = true;
      const res = await fetch("auth/register", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        const { username } = await res.json()
        $user = { username, avatar: false };
        goto("/user");
      } else {
        if (res.status === 409) {
          const data = await res.json()
          errors[data.error] = [data.error.replace(/^\w/, (c: string) => c.toUpperCase()) + " has already been taken."];
        } else {
          transmit({error:"<b>Internal Server Error.</b>Please try again in some time"});
        }
      }
      isLoading = false;
    }
  }
</script>

<Hero scheme={5} />

<div class="abcent">
  <h1 class="h2 t-bg1 tac">Register</h1>
  <form method="post" style="color:var(--bg1);width:80vw;max-width:60rem" on:submit|preventDefault={handleSubmit}>
    <Text icon="u" bind:value={username} width="100%" label="Username" errors={errors.username} autofocus/>
    <Text icon="E" bind:value={email} width="100%" label="Email Address" errors={errors.email}/>
    <Password bind:value={password} width="100%" label="Password" errors={errors.password}/>
    <Password bind:value={password2} width="100%" label="Confirm Password" errors={errors.password2}/>
    <button class="btn-form" class:disabled={isLoading} type="submit">
      {#if isLoading}
        <Loader />
      {:else}
        Register
      {/if}
    </button>
  </form>
  <a class="t-bg1 tar block" href="/accounts/login">...or login with an existing account</a>
</div>

