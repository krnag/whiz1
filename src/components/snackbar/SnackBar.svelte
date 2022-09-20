<script>
  export let message;
  export let hide;
  setTimeout(() => hide(message.id), 5000);
</script>

<div class="snackbar usn {message.format}">
  {@html message.text}
</div>

