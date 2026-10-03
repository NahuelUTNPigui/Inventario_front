<script>
  import Oscuro from "$lib/components/Oscuro.svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  onMount(() => {
    let nologeado = undefined == localStorage["pocketbase_auth"];
    if (nologeado) {
      goto("/login");
    } else {
      goto("/inicio");
    }
  });
</script>

<Oscuro />
<h1 class="text-3xl font-bold underline">Hello world!</h1>
<h1 class="text-green-500 dark:text-red-500">Welcome to SvelteKit</h1>
