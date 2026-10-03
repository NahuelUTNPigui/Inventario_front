<script>
    import estilos from "$lib/estilos";

    import Eye from "../svg/Eye.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let { lotesrows = [], openViewModal = (_p) => {} } = $props();
</script>

<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each lotesrows as t}
        <div
            class="
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            "
        >
            <!-- Cabecera con producto y acciones -->
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                            <span class="font-normal">Producto:</span>
                            {shorterWord(t.expand?.producto?.nombre || "", 30)}
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
                </div>
            </div>

            <!-- Grid de datos -->
            <div
                class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm"
            >
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
                        Ingreso
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium">
                        {t.fechaingreso?.length > 0
                            ? new Date(t.fechaingreso).toLocaleDateString()
                            : "-"}
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
                <div class="hidden">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Destinatario
                    </span>
                    <p
                        class="text-gray-900 dark:text-gray-100 font-medium truncate"
                    >
                        {"Destinatario"}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>
