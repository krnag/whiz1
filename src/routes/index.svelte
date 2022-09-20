<script>
  import Hero from "$comp/Hero.svelte";
</script>

<section id="hero">
  <Hero />
  <div class="hero-text">
    <h1>Think outside the Book</h1>
    <h2>Replace boring lectures with active learning, by problem solving and playing with interactive models.</h2>
    <a class="cta" href="/learn">Start Learning Now!</a>
  </div>
</section>

<!--
<section id="about">
  <h2>Whizual is an interactive platform for learning</h2>
</section>
<hr>
<section class="courses" style="margin: 6rem;">
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis animi eos enim illo earum modi ut ipsam iste dolores reiciendis voluptate ex dignissimos consequatur nulla commodi, quia dolor saepe odio!</p>
  <br>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur aut nesciunt culpa neque assumenda, a quia ad saepe quasi voluptate laborum quas, explicabo in. Nulla non nam minus magnam incidunt?</p>
  <br>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum officiis eveniet porro animi sint, deserunt culpa reprehenderit velit quidem laborum odit! Optio commodi repudiandae deserunt earum aliquid eveniet amet quidem!</p>
  <br>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis animi eos enim illo earum modi ut ipsam iste dolores reiciendis voluptate ex dignissimos consequatur nulla commodi, quia dolor saepe odio!</p>
</section>
-->

<style>
  #hero {
    height: 100vh;
    position: relative;
    overflow: hidden;
    background-color: black;
    user-select: none;
  }
  .hero-text {
    position: absolute;
    color: var(--bg1);
    max-width: 80rem;
    top: 45%;
    left: 2rem;
    transform: translateY(-50%);
    padding: 0 6rem;
  }
  .hero-text h1 {
    color: var(--bg1);
    position: relative;
    display: inline;
    padding: 0;
    line-height: 1;
    text-align: left;
    font-size: 8rem;
    vertical-align: baseline;
  }
  .hero-text h1::before,
  .hero-text h1::after {
    content: "Book";
    position: absolute;
    right: -1.2rem;
    bottom: 1.4rem;
    color: #00000000;
    -webkit-text-stroke: .1rem #ffffff30;
  }
  .hero-text h1::after {
    right: -.6rem;
    -webkit-text-stroke: .1rem #ffffff60;
  }
  .hero-text h2 {
    color: var(--bg1);
    line-height: 1.2;
    margin-top: 2rem;
    vertical-align: baseline;
    font-size: var(--tl);
    font-family: var(--fbody);
    opacity: .8;
    font-weight: 300;
    font-style: italic;
  }
  #about {
    padding: 6rem;
  }
  .cta {
    padding: 1rem 2rem; margin-top:2rem;
    background: var(--primary1);
    color: var(--bg1);
    font-weight: bold
  }
</style>
