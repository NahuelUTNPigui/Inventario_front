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
        lotesrows = [],
        selecthash = {},
        openViewModal = (_p) => {},
        openEditModal = (_p) => {},
        openDelModal = (_p) => {},
        clickTodos = () => {},
        clickFila = (id) => {},
        todos = $bindable(false),
        pageSize = $bindable(15),
    } = $props();

    let pyfila = "py-1";
</script>

<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each lotesrows as t}
        <div
            class={`
                rounded-xl border p-4 transition-all
                ${
                    selecthash[t.id]
                        ? "border-red-600 bg-red-50 dark:bg-red-950/30"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
                }
            `}
        >
            <!-- Cabecera con checkbox y código -->
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <label
                        class="hidden flex items-center justify-center cursor-pointer"
                    >
                        <!-- Input real (oculto pero funcional) -->
                        <input
                            type="checkbox"
                            checked={selecthash[t.id] ? true : false}
                            onchange={() => clickFila(t.id)}
                            class="peer sr-only"
                        />

                        <!-- La caja circular personalizada -->
                        <span
                            class="
                                w-5 h-5
                                flex items-center justify-center
                                rounded-full
                                border-2 border-gray-300 dark:border-gray-500
                                bg-white dark:bg-gray-800
                                transition-all duration-200 ease-in-out
                                peer-checked:bg-red-700
                                peer-checked:border-red-700
                                hover:border-red-500 dark:hover:border-red-400
                            "
                        >
                            <!-- Icono de check (visible solo cuando está marcado) -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="3"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </span>
                    </label>

                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                            
                            {shorterWord(t.codigo, 40)}
                        </p>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="flex items-center gap-2 shrink-0">
                    <button
                        onclick={() => openViewModal(t.id)}
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Eye size="size-5" />
                    </button>
                    <button
                        onclick={() => openEditModal(t.id)}
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Pencil size="size-5" />
                    </button>
                    <button
                        onclick={() => openDelModal(t.id)}
                        class="hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Trash size="size-5" />
                    </button>
                </div>
            </div>

            <!-- Grid de datos -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Producto
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {t.expand?.producto?.nombre || "-"}
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
                    <p class="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {t.expand?.unidad?.nombre || "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Estado
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {getNombreLista(t.cerrado,estadoslote)}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Vencimiento
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.fechavencimiento?.length > 0
                            ? new Date(t.fechavencimiento).toLocaleDateString()
                            : "-"}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Ingreso
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.fechaingreso
                            ? new Date(t.fechaingreso).toLocaleDateString()
                            : "-"}
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
