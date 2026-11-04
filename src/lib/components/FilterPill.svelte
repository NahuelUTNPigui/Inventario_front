<script>
    let {etiqueta="",valor=""}=$props()
</script>
{#if valor !=""}
    <div
    class={`
                mt-1
                rounded-full px-3 py-1 text-md flex items-center gap-1
                bg-white dark:bg-transparent dark:text-white
                border  border-gray-300 dark:border-gray-600
            `}
    >
        {etiqueta} {valor}
    </div>
{/if}