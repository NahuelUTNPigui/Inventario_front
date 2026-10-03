<script>
    let {
        ingreso = 0,
        stockrows = [],
        selectedLote = $bindable(""),

        agregarLote = (p_cantidad) => {},
    } = $props();
    let cantidad = $state("");
    function agregar() {
        agregarLote(cantidad);
        cantidad = "";
    }
    function selectCantidad() {
        let idx_lotes = stockrows.findIndex((s) => s.id == selectedLote);
        if (idx_lotes != -1) {
            let l = stockrows[idx_lotes];
            return "" + l.cantidad;
        }
        return "";
    }
    function selectLote() {
        let idx_lotes = stockrows.findIndex((s) => s.id == selectedLote);
        if (idx_lotes != -1) {
            let l = stockrows[idx_lotes];
            return "" + l.lote;
        }
        return "";
    }
    let cantidadActual = $derived(selectedLote == "" ? "" : selectCantidad());
    let nombreLote = $derived(selectedLote == "" ? "" : selectLote());
</script>

<!-- Agregar al Lote -->
<div
    class="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {ingreso == 0 ? `Agregar al Stock` : `Quitar del stock`}
    </h2>
    <div class="space-y-4">
        <div>
            <label
                for="Producto"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Stock
            </label>
            <select
                class="
                w-full
                border
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-green-700
                "
                bind:value={selectedLote}
            >
                {#each stockrows as s}
                    <option value={s.id}>{s.codigo}</option>
                {/each}
            </select>
        </div>
        {#if selectedLote != ""}
            <div>
                <label
                    for="Producto"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Stock actual: {cantidadActual}
                </label>
            </div>
        {/if}
        {#if nombreLote != ""}
            <div>
                <label
                    for="Producto"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Lote: {nombreLote}
                </label>
            </div>
        {/if}
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
            Agregar movimiento
        </button>
    </div>
</div>
