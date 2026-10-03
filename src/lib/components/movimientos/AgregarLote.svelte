<script>
    let {
        ingreso = 0,
        nombre = "",
        agregarLote = (p_cantidad) => {},

    } = $props();
    let cantidad = $state("");
    function agregar() {
        agregarLote(cantidad);
        cantidad = "";
    }

</script>

<!-- Agregar al Lote -->
<div
    class="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {ingreso==0?`Agregar productos al Lote: ${nombre}`:`Quitar productos al Lote: ${nombre}`}
    </h2>
    <div class="space-y-4">
        <div>
            <label
                for="cantidadingreso"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Cantidad
            </label>
            <input
                id="cantidadingreso"
                type="number"
                placeholder="Cantidad"
                bind:value={cantidad}
                class="w-full px-3 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
        </div>

        <button
            onclick={agregar}
            class="
                cursor-pointer w-full
                dark:bg-red-900 dark:hover:bg-red-800
                bg-red-900 hover:bg-red-800
                text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200
            "
        >
            Agregar al Lote
        </button>
    </div>
</div>
