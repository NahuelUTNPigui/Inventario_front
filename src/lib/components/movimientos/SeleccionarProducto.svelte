<script>
    import estilos from "$lib/estilos";
    let {
        producto = $bindable(""),
        cliente = "",
        productosrows = [],
        nombre = "",
        agregarLote = (p_cantidad) => {},

        unidades = [],
        idunidad = $bindable(""),
        nombreunidad = $bindable(""),
        fechavencimiento = $bindable(""),
        lote = $bindable(""),
        remito = $bindable(""),
    } = $props();
    let cantidad = $state("");
    function agregar() {
        agregarLote(cantidad);
        cantidad = "";
    }
    function selectProducto() {
        let idx_prod = productosrows.findIndex((u) => u.id == producto);
        if (idx_prod != -1) {
            let u = productosrows[idx_prod];
            nombre = u.nombre;
        }
    }
    function selectUnidad() {
        let idx_unidad = unidades.findIndex((u) => u.id == idunidad);
        if (idx_unidad != -1) {
            let u = unidades[idx_unidad];
            nombreunidad = u.nombre;
        }
    }
</script>

<!-- Agregar al Lote -->
<div
    class="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Crear nuevo stock
    </h2>
    <div class="space-y-4">
        
        <div>
            <label
                for="Producto"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Producto
                
            </label>
            <select
                class="
                w-full
                border
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={producto}
            >
                {#each productosrows as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        </div>
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
        <div class="flex flex-col">
            <label
                for="Unidad"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Unidad
            </label>
            <select
                class="
                border
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={idunidad}
                onchange={selectUnidad}
            >
                {#each unidades as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="Vencimiento" class="label mb-0 pb-0">
                <span
                    class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
                >
                    Vencimiento</span
                >
            </label>
            <input
                id="Vencimiento"
                type="date"
                class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                bind:value={fechavencimiento}
            />
        </div>
        <div>
            <label
                for="remito"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Remito
            </label>
            <input
                id="remito"
                type="text"
                placeholder="Remito"
                bind:value={remito}
                class="w-full px-3 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
        </div>
        <div>
            <label
                for="Lote"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Lote
            </label>
            <input
                id="Lote"
                type="text"
                placeholder="Lote"
                bind:value={lote}
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
            Agregar el stock
        </button>
    </div>
</div>
