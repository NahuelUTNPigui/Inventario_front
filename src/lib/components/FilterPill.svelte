<script>
    let {etiqueta="",valor=""}=$props()
</script>
{#if valor !=""}
<div
            class={`
                        mt-1
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        border-gray-300 dark:border-gray-600
                        bg-white    hover:bg-gray-300 dark:bg-transparent 
                                    dark:hover:bg-gray-600  dark:text-white
                        
                    `}
            >
                {etiqueta} {valor}
            </div>
{/if}