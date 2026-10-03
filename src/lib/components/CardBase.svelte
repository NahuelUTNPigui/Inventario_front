<script>
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    
    let {
        titulo = "",
        cardsize = "max-w-5xl",
        children
    } = $props();
</script>
<div 
    class="
        min-h-screen 
        p-4
    "
>
    <div class="flex items-center justify-center">
        <div 
            class={`
                bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 w-full
                ${cardsize}
            `}
            
        >
            {#if titulo.length>0}
                <h1 
                    class="
                        text-2xl font-bold mb-6 text-start
                        text-red-900 dark:text-red-400
                        mx-1  lg:mx-10
                    "
                >
                    {titulo}
                </h1>
            {/if}
            {@render children()}
        </div>
    </div>
</div>