<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: { status }
		};
	}
</script>

<script>
	export let status;
</script>

<section class="error-page">
    <p class="glitch">
      <span class="abcent">{status}</span>
      <span class="abcent" aria-hidden="true">{status}</span>
      <span class="abcent" aria-hidden="true">{status}</span>
      <span class="abcent" aria-hidden="true">{status}</span>
    </p>
    {#if status === 404}
      <h1 class="abcent">Page Not Found</h1>
    {:else}
      <h1 class="abcent">Something went wrong</h1>
    {/if}
</section>

<style>
  .error-page {
    user-select: none;
    height: 67vh;
    background-color: #1080df;
    position: relative;
  }
  .error-page h1 {
    z-index: 2;
    font-size: var(--t4l);
    text-align: center;
    line-height: .84;
  }
  .glitch span {
    font-family: var(--fbody);
    position: absolute;
    color: #2288ff;
    font-size: min(30vh,30vw);
    font-weight: bold;
    animation: glitch 7s infinite alternate;
    z-index: 1;
    opacity: .6;
  }
  .glitch span:first-child {
    animation: glitch 5s infinite alternate-reverse, jerk 6s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 40%, 0 60%);
  }
  .glitch span:nth-child(3) {
    animation: glitch 8s 320ms infinite, jerk 4200ms infinite alternate;
    clip-path: polygon(0 30%, 100% 50%, 100% 65%, 0 80%);
    z-index: 0;
  }
  .glitch span:last-child {
    animation: glitch 9s infinite, jerk 6s 1s infinite alternate-reverse;
    clip-path: polygon(0 60%, 100% 40%, 100% 100%, 0 100%);
    z-index: 0;
  }
  
  @keyframes glitch {
    19% {
      text-shadow: 
        0 0 0 #ff00ff6a,
        0 0 0 #ffff006a,
        0 0 0 #00ffff6a;
    }
    20% {
      text-shadow: 
        0.01em 0 0 #ff00ff6a,
        0 0 0 #ffff006a,
        0 0 0 #00ffff6a;
    }
    21% {
      text-shadow: 
        -0.01em 0 0 #ff00ff6a,
        0.02em 0 0 #ffff006a,
        0 0 0 #00ffff6a;
    }
    22% {
      text-shadow: 
        0 0 0 #ff00ff6a,
        0 0 0 #ffff006a,
        -0.02em 0 0 #00ffff6a;
    }
    23% {
/*      text-shadow: 
        0.01em 0.01em 0 #ff00ff6a,
        0 -0.01em 0 #ffff006a,
        0 0 0 #00fff6a;
    }
    24% {
      text-shadow: 
        -0.01em 0 0 #ff00ff6a,
        0 0 0 #ffff006a,
        0 0 0 #00ffff6a;
    }
    25% {*/
      text-shadow: 
        0 0 0 #ff00ff6a,
        0 0 0 #ffff006a,
        0 0 0 #00ffff6a;
    }
  }
  @keyframes jerk {
    39% {
      transform: translate(-50%, -50%);
      opacity: .8;
    }
    40% {
      transform: translate(-52%, -50%);
      opacity: .4;
    }
    41% {
      transform: translate(-49%, -51%);
      opacity: .2;
    }
    42% {
      transform: translate(-50%, -50%);
      opacity: .8;
    }
  }
</style>
