<script>
    import estilos from "$lib/estilos";
    import estadoslote from "$lib/genericos/estadoslote";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { getNombreLista, shorterWord } from "$lib/genericos/strings";
    let {
        historialrows = [],

        pageSize = $bindable(15),
    } = $props();

    let pyfila = "py-1";
</script>

<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each historialrows as t}
        <div
            class={`
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            `}
        >
            <!-- Cabecera con checkbox y código -->
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                            <span class="font-normal">Producto:</span>
                            {t.expand?.producto?.nombre || "-"}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Grid de datos -->
            <div
                class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm"
            >
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Codigo
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.codigo ?? "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Cantidad
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.cantidad ?? "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Unidad
                    </span>
                    <p
                        class="text-gray-900 dark:text-gray-100 font-medium truncate"
                    >
                        {t.expand?.unidad?.nombre || "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Remito
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.remito ?? "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Lote
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.lote ?? "-"}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>
