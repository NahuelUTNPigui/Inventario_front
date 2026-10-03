<script>
    import Filter from "../svg/Filter.svelte";
    import Plus from "../svg/Plus.svelte";
    import Limpiar from "../svg/Limpiar.svelte";
    import { slide } from "svelte/transition";
    import estilos from "$lib/estilos";
    let {
        buscar = $bindable(""),
        cliente = $bindable(""),
        fechadesde = $bindable(""),
        fechahasta = $bindable(""),
        tipo = $bindable(""),
        clientes = [],
        tipos = [],
        filterUpdate = () => {},
        limpiarFiltros = () => {},
        nuevo = () => {},
        connuevo = true,
    } = $props();
    let openFilter = $state(false);
</script>

<div class="container mx-auto py-1 px-4 max-w-7xl w-full xl:w-3/4">
    <!--Header-->
    <div
        class={`
            rounded-xl p-1 shadow-2xl mb-1
            dark:bg-slate-900 bg-white
            px-6
        `}
    >
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 mb-2 border-b border-gray-300 dark:border-gray-800"
        >
            <div
                class={`
                    bg-transparent
                    py-2
                `}
            >
                <h1
                    class={`
                        text-3xl font-semibold 
                        dark:text-white text-gray-900
                `}
                >
                    Movimientos
                </h1>
            </div>
        </div>
        <!--Filtros-->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1 md:p-2 bg-transparent rounded-lg"
        >
            <!-- Input de búsqueda -->
            <div
                class={`
                  flex items-center flex-1
                  shadow-2xl
                  rounded-full p-3
                
                  bg-white dark:bg-gray-900
                  shadow-[0_4px_8px_-2px_rgba(0,0,0,0.2)]
                  dark:shadow-[0_4px_8px_-2px_rgba(255,255,255,0.1)]
                `}
            >
                <input
                    type="text"
                    placeholder="Buscar producto ..."
                    class={`
                    shadow-2xl
                    dark:placeholder-gray-500 
                    dark:text-gray-100
                    placeholder-gray-600 text-gray-800
                    
                    w-full bg-transparent focus:outline-none
                    border border-transparent
                    
                `}
                    bind:value={buscar}
                    oninput={filterUpdate}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                    />
                </svg>
            </div>
            {#if connuevo}
                <div class="flex flex-wrap gap-2">
                    <button
                        class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                        onclick={nuevo}
                    >
                        <Plus size="size-4" />
                        Nuevo
                    </button>
                    <button
                        class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        border-gray-300 dark:border-gray-600
                        ${
                            openFilter
                                ? `
                                    bg-red-800 hover:bg-red-900 text-white
                                `
                                : `
                                    bg-white    hover:bg-gray-300 dark:bg-transparent 
                                    dark:hover:bg-gray-600  dark:text-white
                                `
                        }
                        
                    `}
                        onclick={() => (openFilter = !openFilter)}
                    >
                        <Filter size="size-4" />
                        Filtros
                    </button>
                </div>
            {/if}
        </div>
        {#if openFilter}
            <div transition:slide>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 w-full mt-2 mb-1"
                >
                    <div>
                        <label for="rp" class="label mb-0 pb-0">
                            <span
                                class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                            >
                                Fecha desde
                            </span>
                        </label>
                        <input
                            id="fechadesde"
                            type="date"
                            class={`
                                input input-bordered w-full
                                border border-gray-300 rounded-md
                                focus:outline-none focus:ring-2 
                                focus:ring-gray-500 
                                focus:border-gray-500
                                ${estilos.bgdark2} 
                            `}
                            onchange={filterUpdate}
                            bind:value={fechadesde}
                        />
                    </div>
                    <div>
                        <label for="rp" class="label mb-0 pb-0">
                            <span
                                class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                            >
                                Fecha hasta
                            </span>
                        </label>
                        <input
                            id="fechadesde"
                            type="date"
                            class={`
                                input input-bordered w-full
                                border border-gray-300 rounded-md
                                focus:outline-none focus:ring-2 
                                focus:ring-gray-500 
                                focus:border-gray-500
                                ${estilos.bgdark2} 
                            `}
                            onchange={filterUpdate}
                            bind:value={fechahasta}
                        />
                    </div>
                    <div class="flex flex-col">
                        <label for="rp" class="label mb-0 pb-0">
                            <span
                                class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                            >
                                Cliente</span
                            >
                        </label>
                        <select
                            class="
                                bg-white dark:bg-slate-900
                                border
                                border-gray-300 dark:border-gray-600
                                rounded-md px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                            "
                            onchange={filterUpdate}
                            bind:value={cliente}
                        >
                            {#each clientes as s}
                                <option value={s.id}>{s.nombre}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="flex flex-col">
                        <label for="rp" class="label mb-0 pb-0">
                            <span
                                class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                            >
                                Tipo</span
                            >
                        </label>
                        <select
                            class="
                                bg-white dark:bg-slate-900
                                border
                                border-gray-300 dark:border-gray-600
                                rounded-md px-3 py-1.5 text-sm
                                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                            "
                            onchange={filterUpdate}
                            bind:value={tipo}
                        >
                            {#each tipos as s}
                                <option value={s.id}>{s.nombre}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-x-4 gap-y-2 w-full mt-2 mb-1">
                    <div>
                        <button
                            class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                            onclick={limpiarFiltros}
                        >
                            <Limpiar size="size-4" />
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
