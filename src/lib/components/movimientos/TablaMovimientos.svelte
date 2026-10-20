<script>
    import estilos from "$lib/estilos";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    import Egreso from "../svg/Egreso.svelte";
    let {
        movimientosrows = [],
        selecthash = {},
        openViewModal = (_p) => {},
        openEditModal = (_p) => {},
        openDelModal = (_p) => {},
        openEgresoModal = (_p) => {},
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
                        Cantidad / Pendiente
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
                <tr class="h-px">
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.expand.movimiento ? new Date(t.expand.movimiento.fecha).toLocaleDateString() : ""}`}
                    </td>
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {t.expand.producto.nombre}
                    </td>
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {t.cantidad}/{t.pendiente}
                    </td>
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.expand.movimiento.ingreso == 0 ? "Ingreso" : "Egreso"}`}
                    </td>
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {t.remito || ""}
                    </td>
                    <td class={` text-base mx-1 px-4 ${pyfila}`}>
                        {t.expand?.lote?.lote || ""}
                    </td>
                    <td class={` text-base  px-1 ${pyfila}`}>
                        <div class="flex items-center justify-center gap-2">
                            {#if t.pendiente > 0}
                                <button
                                    onclick={() =>
                                        openEgresoModal(t.id)}
                                    class="hover:cursor-pointer hover:scale-105"
                                >
                                    <Egreso size="size-6" />
                                </button>
                            {/if}
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
                        </div>
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
