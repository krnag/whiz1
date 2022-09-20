<script context="module">
  export async function load({ props }) {
    if (props.hasToken) return {
      status: 303,
      redirect: "/"
    };
    return {};
  }
</script>
<script>
  import { isEmail } from "$lib/helpers";
  import { transmit } from "$lib/stores/snackbar";
  import Hero from "$comp/Hero.svelte";
  import Text from "$comp/inputs/Text.svelte";
  import Loader from '$comp/Loader.svelte';

  let username = "";
  let isLoading = false;

  async function handleSubmit() {
    if (!username) transmit({error: "Username or Email is required"})
    else {
      isLoading = true;
      let auth = {type: "username", data: username};
      if (isEmail(username)) {auth.type = "email"};
      const res = await fetch("reset-password", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(auth),
      });
      if (res.ok) {
        isLoading = false;
      } else {
        transmit({error: "<b>Wrong Credentials.</b> Could not find any user with the provided email/username."});
      }
    }
  }
</script>

<Hero scheme={6} />

<div class="abcent">
  <p class="h5 t-bg1 tac">Reset Password</p>
  <p class="t-bg1 tac ts">A link to reset your password will be sent to your registered email address.</p>
  <br>
  <form method="post" style="color:var(--bg1);width:80vw;max-width:60rem" on:submit|preventDefault={handleSubmit}>
    <Text icon="u" bind:value={username} width="100%" label="Email address or Username" autofocus/>
    <br><br>
    <button class="btn-form" type="submit">
      {#if isLoading}
        <Loader />
      {:else}
        Get Reset Code
      {/if}
    </button>
  </form>
  <a class="t-bg1 tar block" href="/accounts/register">...or create an account</a>
</div>
