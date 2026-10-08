<script>
    import Plus from "../svg/Plus.svelte";
    let {
        nivel = 0,
        buscar = $bindable(""),
        cliente = $bindable(""),
        clientes = [],
        productos=[],
        filterUpdate = () => {},
        seleccionarCliente = () => {},
        nuevoProducto = () => {},
        nuevoIngreso = () => {},
        nuevoLote=()=>{}
    } = $props();
    let botonRef = $state(null);
    // Se ejecuta automáticamente cuando el componente se monta
    // y botonRef ya está disponible en el DOM
    $effect(() => {
        if (botonRef) {
            botonRef.focus();
        }
    });
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
                    Stock - {nivel>0?"Operaciones":"Depósito"}
                </h1>
            </div>
            <div class="flex flex-col gap-2">
                <label for="cliente" class="label mb-0 pb-0">
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
                        border
                        bg-white dark:bg-slate-900
                        border-gray-300 dark:border-gray-600
                        rounded-md px-3 py-1.5 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                    "
                    bind:value={cliente}
                    onchange={seleccionarCliente}
                >
                    <option value="">Elegir cliente</option>
                    {#each clientes as s}
                        <option value={s.id}>{s.nombre}</option>
                    {/each}
                </select>
            </div>
        </div>
        {#if cliente.length > 0}
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
                        placeholder="Buscar stock ..."
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
            </div>
            <div class="flex flex-wrap gap-2">
                <div
                class={`
                        hidden
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300   dark:bg-transparent 
                        dark:border-gray-600 dark:text-white
                    `}
                >
                    Productos: {productos.length}
                </div>
                <button
                    class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                    onclick={nuevoProducto}
                >
                    <Plus size="size-4" />
                    Productos: {productos.length}
                </button>
                <button
                    class={`
                        
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                    bind:this={botonRef}
                    onclick={nuevoLote}
                >
                    <Plus size="size-4" />
                    Nuevo stock
                </button>
            </div>
        {/if}
    </div>
</div>
