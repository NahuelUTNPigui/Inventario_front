<script>
    import estilos from "$lib/estilos";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let {
        detallemovimientosrows = [],
        openViewModal = (_p) => {} 
    } = $props();

    let pyfila = "py-1";
</script>
<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each detallemovimientosrows as t}
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
                            <span class="font-normal">Código:</span>
                            {t.codigo}
                        </p>
                    </div>
                </div>
                
                <!-- Acciones -->
                <div class="flex items-center gap-2 shrink-0">
                    <button
                        onclick={() => openViewModal(t.idmovimiento,t)}
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Eye size="size-5" />
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
                        {t.fecha ? new Date(t.fecha).toLocaleDateString() : "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Cantidad
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.cantidad}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Tipo
                    </span>
                    <p class="font-medium">
                        {#if t.ingreso == 0}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Ingreso
                            </span>
                        {:else}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                Egreso
                            </span>
                        {/if}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>