<script>
    let {
        lote = $bindable([]),
        quitarLote = (id) => {},
        procesar = () => {},
    } = $props();
</script>

<!-- Lote de Ingreso -->
<div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Stock
        </h2>
        <span
            id="product-count"
            class="text-sm text-gray-600 dark:text-gray-400"
            >{lote.length} productos</span
        >
    </div>
    {#if lote.length == 0}
        <!-- Estado vacío -->
        <div id="empty-batch" class="block text-center py-8">
            <div
                class="w-12 h-12 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4"
            >
                <svg
                    class="w-6 h-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    ></path>
                </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
                El movimiento está vacío
            </p>
        </div>
    {:else}
        <!-- Estado con productos -->
        <div id="batch-with-products">
            <div class="space-y-3 mb-4">
                {#each lote as l}
                    <!-- Producto agregado -->
                    <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p
                                    class="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Producto: {l.nombre} - 
                                    Unidad: {l.unidadnombre}
                                </p>
                                <p
                                    class="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Remito: {l.remito} - 
                                    Lote: {l.nombrelote}
                                </p>
                                {#if l.fechavencimiento.length > 0}
                                    <p
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Vencimiento: {new Date(
                                            l.fechavencimiento,
                                        ).toLocaleDateString()}
                                    </p>
                                {/if}
                            </div>
                            <span
                                class="text-sm font-semibold text-green-600 dark:text-green-400"
                                >{l.cantidad}</span
                            >
                        </div>
                        <div class="flex justify-end gap-2 mt-2">
                            <button
                                onclick={() => quitarLote(l.idfila)}
                                class="
                        cursor-pointer
                        text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Total -->
            <div
                class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4"
            >
                <div class="flex justify-between items-center">
                    <span
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        >Total:</span
                    >
                    <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    >
                        {lote.length}
                    </span>
                </div>
            </div>

            <!-- Botón procesar -->
            <button
                onclick={procesar}
                class="
                    cursor-pointer w-full
                    dark:bg-red-900 dark:hover:bg-red-800
                    bg-red-900 hover:bg-red-800
                    text-white font-medium py-3 px-4 rounded-lg
                    transition-colors duration-200
                "
            >
                Procesar stocks
            </button>
        </div>
    {/if}
</div>
