<script>
  import { getDate } from "$lib/helpers";

  export let users = [];
</script>

<div class="dashbar"></div>

<table>
  <thead>
    <th>Created</th>
    <th>User</th>
    <th>Last Login</th>
  </thead>
  <tbody>
    {#each users as user}
      <tr>
        <td>{getDate(user.created)}</td>
        <td class="tc">{user.username} <p class="small">{user.email}</p></td>
        <td>{getDate(user.last_login)}</td>
      </tr>
    {/each}
  </tbody>
</table>
