<script>
    import { getNombreLista } from "$lib/genericos/strings";

    let { detalles = $bindable([]), quitarDetalle = (id) => {},unidades=[],productos=[] } = $props();
</script>

<!-- Lote de Ingreso -->
<div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Detalles
        </h2>
        <span
            id="detalles-count"
            class="text-sm text-gray-600 dark:text-gray-400"
            >{detalles.length} detalles</span
        >
    </div>
    <!-- Estado con productos -->
    <div id="batch-with-products">
        <div class="space-y-3 mb-4">
            {#each detalles as l}
                <!-- Producto agregado -->
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        
                        <span
                            class="text-sm font-semibold text-green-600 dark:text-green-400"
                            >Cantidad: {l.cantidad} - {getNombreLista(l.producto,productos)}  Unidad: {getNombreLista(l.unidad,unidades)}</span
                        >
                    </div>
                    <div class="flex justify-end gap-2 mt-2">
                        <button
                            onclick={() => quitarDetalle(l.id)}
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
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
            <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-900 dark:text-white"
                    >Total:</span
                >
                <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                >
                    {detalles.length}
                </span>
            </div>
        </div>

        
    </div>
</div>
