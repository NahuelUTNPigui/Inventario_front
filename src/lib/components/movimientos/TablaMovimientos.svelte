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
        pageSize = $bindable(15),
    } = $props();

    function onChangePageSize() {
        paginaActual = 1;
    }

    let paginaActual = $state(1);

    let paginaAnterior = $derived(paginaActual - 1);

    let rows = $derived(
        movimientosrows.slice(
            paginaAnterior * pageSize,
            paginaActual * pageSize,
        ),
    );

    let count = $derived(movimientosrows.length);

    let totalPaginas = $derived(Math.ceil(count / pageSize));
    let pyfila = "py-1";
</script>

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
                        Fecha
                    </div>
                </th>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Producto
                    </div>
                </th>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Cantidad
                    </div>
                </th>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Tipo
                    </div>
                </th>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Remito
                    </div>
                </th>
                <th
                    class={`
                        ${estilos.tableth}   
                    `}
                >
                    <div class="flex flex-row justify-between uppercase">
                        Lote
                    </div>
                </th>
                <th class="text-base mx-1 px-1 text-center uppercase">
                    Acciones
                </th>
            </tr>
        </thead>
        <tbody>
            {#each rows as t}
                <tr>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.expand.movimiento?new Date(t.expand.movimiento.fecha).toLocaleDateString():""}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {t.expand.producto.nombre}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.cantidad}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.expand.movimiento.ingreso == 0 ? "Ingreso" : "Egreso"}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {t.remito || ""}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {t.expand?.lote?.codigo || ""}
                    </td>
                    <td
                        class={`flex text-base  items-center justify-center gap-2 px-1 ${pyfila}`}
                    >
                        <button
                            onclick={() => openViewModal(t.movimiento)}
                            class="hover:cursor-pointer hover:scale-105"
                        >
                            <Eye size="size-6" />
                        </button>
                        <button
                            onclick={() => openEditModal(t.movimiento)}
                            class="hover:cursor-pointer hover:scale-105"
                        >
                            <Pencil size="size-6" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
<Paginacion
    rows={movimientosrows}
    bind:paginaActual
    bind:pageSize
    {totalPaginas}
    {onChangePageSize}
/>
