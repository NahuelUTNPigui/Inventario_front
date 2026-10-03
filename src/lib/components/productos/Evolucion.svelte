<script>
    
    import { onMount } from "svelte";
    import Paginacion from "../Paginacion.svelte";
    import { page } from "$app/state";
    let evolucion=$state([])
    let evolucionrows = $state(evolucion);
    let pageSize = $state(15);
    function onChangePageSize() {
        paginaActual = 1;
    }

    let paginaActual = $state(1);

    let paginaAnterior = $derived(paginaActual - 1);

    let rows = $derived(
        evolucionrows.slice(paginaAnterior * pageSize, paginaActual * pageSize),
    );

    let count = $derived(evolucionrows.length);

    let totalPaginas = $derived(Math.ceil(count / pageSize));
    let pyfila = "py-1";
    onMount(()=>{
        let slug = page.params.slug
        

    })
</script>

<!--Tabla-->
<div
    class={`
                w-full xl:w-3/4 md:grid
                mx-auto py-0 my-0 px-4 max-w-7xl  
            `}
>
    <div
        class={`
                    py-0 my-0
                    overflow-hidden rounded-xl
                    border border-gray-300 dark:border-gray-700
                `}
    >
        <div class="max-h-[600px] overflow-y-auto custom-scrollbar">
            <table
                class="table table-lg w-full bg-white dark:bg-slate-900 rounded-none"
            >
                <thead
                    class={`${estilos.tableheader}  sticky top-0 z-5 shadow-sm`}
                >
                    <tr>
                        <th
                            class={`
                                ${estilos.tableth}   
                            `}
                        >
                            <div
                                class="flex flex-row justify-between uppercase"
                            >
                                Fecha
                            </div>
                        </th>
                        <th
                            class={`
                                ${estilos.tableth}   
                            `}
                        >
                            <div
                                class="flex flex-row justify-between uppercase"
                            >
                                Cantidad
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each rows as t}
                        <tr>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {`${new Date(t.fecha).toLocaleDateString()}`}
                            </td>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {`${t.cantidad}`}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <Paginacion
            rows={evolucionrows}
            bind:paginaActual
            bind:pageSize
            {totalPaginas}
            {onChangePageSize}
        />
    </div>
</div>
