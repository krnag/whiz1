<script lang="ts">
  import Loader from "$comp/Loader.svelte";

  type URISetter = () => void;
  export let src: string = "";
  export let uri: string = "";
  export let api: string = "";
  export let type: string = "";
  export let style: string = "";
  export let label: string = "Change";
  export let setUri: URISetter = () => {};

  let fileInput: HTMLInputElement;
  let files: FileList;
  let isLoading = false;

  async function getBase64(image: Blob) {
    isLoading = true;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async e => {
      //uploadFunction(<string>e.target.result);
      //src = e.target.result;
      await uploadFunction(<string>e.target.result);
      isLoading = false;
    }
  };

  async function uploadFunction(imgBase64: string) {
    const data = {};
    const imgData = imgBase64.split(',');
    data["image"] = imgData[1];
    const res = await fetch(api+uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (res.ok) setUri();
  }
</script>

<div class="image-frame" class:avatar={type === "avatar"} {style}>
  <img {src} alt="none">
  <input type="file" class="hide" id="avatar-upload" accept=".png,.jpg"
    bind:files bind:this={fileInput} on:change={() => getBase64(files[0])}>

    <button type="button" class="btn-upload" class:disabled={isLoading} on:click={() => fileInput.click()}>
      {#if isLoading}
        <Loader />
      {:else}
        {label}
      {/if}
    </button>
</div>

<style>
  div {
    position: relative;
    margin: 1rem;
    background-color: black;
    border-radius: 4px;
    outline: 3px solid #ccc;
  }
  div:hover {
    outline: 3px solid var(--info);
  }
  div.avatar {
    border-radius: 25%;
    height: 100px;
    width: 100px;
    margin: 2rem auto 1rem auto;
  }

  img {
    width: 100%;
    height: 100%;
    max-width: 80vw;
    max-height: 60vh;
  }
  .avatar > img {
    border-radius: 25%;
  }

  .btn-upload {
    position: absolute;
    color: white;
    background-color: #00000000;
    width: 100%;
    height: 100%;
    font-size: var(--tr);
    border: none;
    top: 0%;
    left: 0%;
    border-radius: 4px;
    opacity: .5;
    transition: opacity 200ms, background-color 200ms;
  }
  .avatar .btn-upload {
    border-radius: 25%;
  }
  .btn-upload:hover {
    opacity: 1;
    background-color: #00000040;
  }
</style>
