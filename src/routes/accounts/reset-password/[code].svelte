<script>
  import { isEmail } from "$lib/helpers";
  import { transmit } from "$lib/stores/snackbar";
  import Hero from "$comp/Hero.svelte";
  import Password from "$comp/inputs/Password.svelte";
  import Loader from '$comp/Loader.svelte';

  export let code;
  let password = "";
  let password2 = "";
  let isLoading = false;

  async function handleSubmit() {
    if (code && password === password2) {
      isLoading = true;
      const res = await fetch("/auth/register", {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({password, code}),
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
    <br><br>
    <Password bind:value={password} width="100%" label="Password" errors={errors.password}/>
    <Password bind:value={password2} width="100%" label="Password" errors={errors.password}/>
    <button class="btn-form" type="submit">
      {#if isLoading}
        <Loader />
      {:else}
        Change Password
      {/if}
    </button>
  </form>
  <a class="t-bg1 tar block" href="/accounts/register">...or create an account</a>
</div>

