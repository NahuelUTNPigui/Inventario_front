<script>
    import estilos from "$lib/estilos";
    import Paginacion from "../Paginacion.svelte";
    import Eye from "../svg/Eye.svelte";
    import Trash from "../svg/Trash.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import Plus from "../svg/Plus.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let {
        controlesrows = [],
        pageSize = $bindable(15),
        quitarControl = (idtemp) => {},
        guardarControles = () => {},
    } = $props();
    function onChangePageSize() {
        paginaActual = 1;
    }

    let paginaActual = $state(1);

    let paginaAnterior = $derived(paginaActual - 1);

    let rows = $derived(
        controlesrows.slice(paginaAnterior * pageSize, paginaActual * pageSize),
    );

    let count = $derived(controlesrows.length);

    let totalPaginas = $derived(Math.ceil(count / pageSize));
    let pyfila = "py-1";
</script>

<div class={`container mx-auto py-1 px-1 max-w-7xl w-full`}>
    <!--Header-->
    <div
        class={`
            rounded-xl  shadow-2xl mb-1
            dark:bg-slate-900 bg-white
            px-6
        `}
    >
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 mb-2 border-t border-gray-300 dark:border-gray-800"
        >
            <div
                class={`
                    bg-transparent
                    py-2
                `}
            >
                <h3
                    class={`
                        text-xl font-semibold 
                        dark:text-white text-gray-900
                `}
                >
                    Nuevos Controles
                </h3>
            </div>
            <button
                class="
                    hover:cursor-pointer mt-2 px-5 py-1 
                    bg-[#115642] text-white 
                    font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base
                "
                onclick={guardarControles}
            >
                Guardar
            </button>
            
        </div>
    </div>
</div>
<!--Tabla-->
<div
    class={`
                hidden w-full md:grid
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
                                Producto
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
                                Unidad
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

                        <th class="text-base mx-1 px-1 text-center uppercase">
                            Acciones
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
                                {t.productonombre || ""}
                            </td>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {t.unidadnombre || ""}
                            </td>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {`${t.cantidad}`}
                            </td>
                            <td
                                class={`flex text-base  items-center justify-center gap-2 px-1 ${pyfila}`}
                            >
                                <button
                                    onclick={() => quitarControl(t.idtemp)}
                                    class="hover:cursor-pointer hover:scale-105"
                                >
                                    <Trash size="size-6" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <Paginacion
            rows={controlesrows}
            bind:paginaActual
            bind:pageSize
            {totalPaginas}
            {onChangePageSize}
        />
    </div>
</div>
<!--Celular-->
<div
    class={`
            md:hidden
            w-full grid grid-cols-1
             max-w-7xl
        `}
>
    <!-- Cards -->
    <div class="flex flex-col gap-3">
        {#each controlesrows as t}
            <div
                class="
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            "
            >
                <!-- Cabecera con fecha y acciones -->
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="flex-1 min-w-0">
                            <p
                                class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                            >
                                <span class="font-normal">Fecha:</span>
                                {t.fecha
                                    ? new Date(t.fecha).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            onclick={() => quitarControl(t.idtemp)}
                            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                        >
                            <Trash size="size-5" />
                        </button>
                    </div>
                </div>

                <!-- Grid de datos -->
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm"
                >
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Producto
                        </span>
                        <p
                            class="text-gray-900 dark:text-gray-100 font-medium truncate"
                        >
                            {t.productonombre || "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Unidad
                        </span>
                        <p
                            class="text-gray-900 dark:text-gray-100 font-medium truncate"
                        >
                            {t.unidadnombre || "-"}
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
                </div>
            </div>
        {/each}
    </div>
</div>
