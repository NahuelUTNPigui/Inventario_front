<script>
    import estilos from "$lib/estilos";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let{
        unidadesrows = [],
        openViewModal = (_p) => {},
        openEditModal = (_p) => {},
        openDelModal = (_p) => {}
    } = $props();
let pyfila = "py-2";
</script>
<div class="max-h-[600px] overflow-y-auto custom-scrollbar ">
    <table class="table table-lg w-full bg-white dark:bg-slate-900 rounded-none">
        <thead class={`${estilos.tableheader}  sticky top-0 z-5 shadow-sm`}>
            <tr>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Nombre
                    </div>
                </th>
                <th class="text-base mx-1 px-1 text-center uppercase">
                    Acciones
                </th>
            </tr>
        </thead>
        <tbody>
            {#each unidadesrows as t}
                <tr>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${shorterWord(t.nombre,30)}`}
                    </td>
                    <td
                        class={`flex text-base  items-center justify-center gap-2 px-1 ${pyfila}`}
                    >
                        
                        <button onclick={() => openEditModal(t.id)} class="hover:cursor-pointer hover:scale-105">
                            <Pencil size="size-6" />
                        </button>
                        <button onclick={() => openDelModal(t.id)} class="hover:cursor-pointer hover:scale-105">
                            <Trash size="size-6" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

</div>