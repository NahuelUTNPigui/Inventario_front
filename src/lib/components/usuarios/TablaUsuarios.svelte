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

{#if usuariosrows.length > 0}
    <div class="max-h-[600px] overflow-y-auto custom-scrollbar">
        <table
            class="table table-lg w-full bg-white dark:bg-slate-900 rounded-none"
        >
            <thead class={`${estilos.tableheader}  sticky top-0 z-5 shadow-sm`}>
                <tr>
                    <th
                        class={`
                        ${estilos.tableth}   
                    `}
                    >
                        <div class="flex flex-row justify-between uppercase">
                            Correo
                        </div>
                    </th>
                    <th
                        class={`
                        ${estilos.tableth}   
                    `}
                    >
                        <div class="flex flex-row justify-between uppercase">
                            Nombre
                        </div>
                    </th>
                    <th
                        class={`
                        ${estilos.tableth}   
                    `}
                    >
                        <div class="flex flex-row justify-between uppercase">
                            Rol
                        </div>
                    </th>
                    <th class="text-base mx-1 px-1 text-center uppercase">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each usuariosrows as t}
                    <tr>
                        <td class={`text-base mx-1 px-4 ${pyfila}`}>
                            {t.correo}
                        </td>
                        <td class={`text-base mx-1 px-4 ${pyfila}`}>
                            {`${shorterWord(t.name + " " + t.apellido, 30)}`}
                        </td>
                        <td class={`text-base mx-1 px-4 ${pyfila}`}>
                            {`${getNombreRol(t.nivel)}`}
                        </td>
                        <td
                            class={`flex text-base  items-center justify-center gap-2 px-1 ${pyfila}`}
                        >
                            <button
                                class="hover:cursor-pointer hover:scale-105"
                                onclick={() => openViewModal(t.id)}
                            >
                                <Eye size="size-6" />
                            </button>
                            <button
                                class="hover:cursor-pointer hover:scale-105"
                                onclick={() => openEditModal(t.id)}
                            >
                                <Pencil size="size-6" />
                            </button>
                            <button
                                class="hover:cursor-pointer hover:scale-105"
                                onclick={() => openDelModal(t.id)}
                            >
                                <Trash size="size-6" />
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <p class="text-center">Sin datos</p>
{/if}
