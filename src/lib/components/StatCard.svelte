<script>
    import { goto } from "$app/navigation";
    
    let {
        titulo,
        valor = $bindable(0),
        titsize = "text-xl",
        urlto = "",
    } = $props();
</script>

<button onclick={() => goto(urlto)} class="text-left hover:cursor-pointer hover:-translate-y-1 duration-100">
    <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-2 transition-colors duration-200"
    >
        <h3
            class={`${titsize} font-semibold text-gray-700 dark:text-gray-300 mb-2`}
        >
            {titulo}
        </h3>
        <p 
            class="
                text-3xl font-bold 
                text-red-900 dark:text-red-400
            "
        >
            {valor}
        </p>
    </div>
</button>
