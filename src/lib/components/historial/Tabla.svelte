<script>
    import estilos from "$lib/estilos";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { getNombreLista, shorterWord } from "$lib/genericos/strings";
    import estadoslote from "$lib/genericos/estadoslote";
    let { historialrows = [], pageSize = $bindable(15) } = $props();

    function onChangePageSize() {
        paginaActual = 1;
    }

    let paginaActual = $state(1);

    let paginaAnterior = $derived(paginaActual - 1);

    let rows = $derived(
        historialrows.slice(paginaAnterior * pageSize, paginaActual * pageSize),
    );

    let count = $derived(historialrows.length);

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
                        Codigo
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
                        Unidad
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
            </tr>
        </thead>
        <tbody>
            {#each rows as t}
                <tr>
                <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.codigo}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${shorterWord(
                            t.expand ? t.expand.producto.nombre : "",
                            30,
                        )}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.cantidad}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.expand ? t.expand.unidad.nombre : ""}`}
                    </td>

                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.remito}`}
                    </td>
                    <td class={`text-base mx-1 px-4 ${pyfila}`}>
                        {`${t.lote}`}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
<Paginacion
    rows={historialrows}
    bind:paginaActual
    bind:pageSize
    {totalPaginas}
    {onChangePageSize}
/>
