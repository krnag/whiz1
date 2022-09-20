<script>
  import { fly } from "svelte/transition";
  import { snacks, clear } from "$lib/stores/snackbar";
  import SnackBar from "./SnackBar.svelte";
  function hide(id) {clear(id)};
</script>

<div class="snacks">
  {#each $snacks as message}
    <div transition:fly="{{ x: 300, duration: 200 }}" style="padding:.4rem 0;">
      <SnackBar {message} {hide} />
    </div>
  {/each}
</div>
