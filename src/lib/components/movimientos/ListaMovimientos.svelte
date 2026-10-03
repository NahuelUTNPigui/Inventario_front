<script>
    import estilos from "$lib/estilos";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let {
        movimientosrows = [],
        selecthash = {},
        openViewModal = (_p) => {},
        openEditModal = (_p) => {},
        openDelModal = (_p) => {},
        clickTodos = () => {},
        clickFila = (id) => {},
        todos = $bindable(false),
        pageSize=$bindable(15)
    } = $props();

    let pyfila = "py-1";
</script>
<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each movimientosrows as t}
        <div
            class="
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            "
        >
            <!-- Cabecera con código y acciones -->
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                            <span class="font-normal">Producto:</span>
                            {t.expand.producto.nombre}
                        </p>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="flex items-center gap-2 shrink-0">
                    <button
                        onclick={() => openViewModal(t.movimiento)}
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Eye size="size-5" />
                    </button>
                    <button
                        onclick={() => openEditModal(t.movimiento)}
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Pencil size="size-5" />
                    </button>
                </div>
            </div>

            <!-- Grid de datos -->
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Fecha
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {`${t.expand.movimiento?new Date(t.expand.movimiento.fecha).toLocaleDateString():""}`}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Cantidad
                    </span>
                    <p class="font-medium">
                        {t.cantidad||""}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Tipo
                    </span>
                    <p class="font-medium">
                        {`${t.expand.movimiento.ingreso == 0 ? "Ingreso" : "Egreso"}`}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Stock
                    </span>
                    <p class="font-medium">
                        {t.expand?.lote?.codigo||""}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>