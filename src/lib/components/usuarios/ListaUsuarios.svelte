<script>
    import estilos from "$lib/estilos";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    import { getNombreRol } from "$lib/genericos/nombres";
    let {
        usuariosrows = [],
        openViewModal = (_p) => {},
        openEditModal = (_p) => {},
        openDelModal = (_p) => {},
    } = $props();
    let pyfila = "py-2";
</script>

<!-- Cards -->
<div class="flex flex-col gap-3">
    {#each usuariosrows as t}
        <div
            class="
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            "
        >
            <!-- Cabecera con correo y acciones -->
            <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                            
                            {t.correo}
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
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                    >
                        <Trash size="size-5" />
                    </button>
                </div>
            </div>

            <!-- Grid de datos -->
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Nombre
                    </span>
                    <p class="text-gray-900 dark:text-gray-100 font-medium truncate">
                        {shorterWord(t.name + " " + t.apellido, 30)}
                    </p>
                </div>
                <div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        Rol
                    </span>
                    <p class="font-medium">
                        {#if t.nivel === 1}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                {getNombreRol(t.nivel)}
                            </span>
                        {:else if t.nivel === 2}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                {getNombreRol(t.nivel)}
                            </span>
                        {:else}
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {getNombreRol(t.nivel)}
                            </span>
                        {/if}
                    </p>
                </div>
            </div>
        </div>
    {/each}
</div>