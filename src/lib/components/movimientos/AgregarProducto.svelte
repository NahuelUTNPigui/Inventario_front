<script>
import estilos from "$lib/estilos";
    let {
        nombre = "",
        agregarLote = (p_cantidad) => {},
        unidades = [],
        idunidad = $bindable(""),
        nombreunidad = $bindable(""),
        fechavencimiento = $bindable(""),
    } = $props();
    let cantidad = $state("");
    function agregar() {
        agregarLote(cantidad);
        cantidad = "";
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
        Agregar producto al Lote: {nombre}
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
        <div>
            <label
                for="Unidad"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Unidad
            </label>
            <select
                class="
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
