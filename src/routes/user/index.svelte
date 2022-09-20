<script context="module">
  export async function load({ props }) {
    //if (!props.username) return {
    //  status: 303,
    //  redirect: "/accounts/login"
    //};
    //return { props };
    return {
      status: 303,
      redirect: "/learn"
    }
  }
</script>

<script lang="ts">
  import { user } from "$lib/stores/user";
  import Hero from "$comp/Hero.svelte";

  export let username: string;
</script>

<section class="head">
  <Hero cover={4} scheme={4} />
  <h2 class="h4 abcent t-bg1">Continue learning</h2>
</section>

<section class="user-courses">
  <h2 class="h4 tac">Recent Courses</h2>

  <div class="abcent">No courses yet</div>
</section>

