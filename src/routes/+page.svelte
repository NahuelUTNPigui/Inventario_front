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



<h1 >Welcome to Pireo</h1>
