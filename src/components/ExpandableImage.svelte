<script>
  export let width = "100%";
  export let alt = "";
  export let uri = "";
  export let caption = "";
  export let click = () => {expand = !expand};
  const style = `width: ${width};`;

  let expand = false;
</script>

<figure on:click={click} style="position: relative;{style}">
  <img style="width: 100%;" src="{uri}-s.webp" {alt}
       srcset="{uri}-s.webp 380w,
               {uri}-m.webp 480w,
               {uri}-l.webp 1200w">
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

