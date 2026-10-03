<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import { shorterWord } from "$lib/genericos/strings";
    import { getNombreLista } from "$lib/genericos/strings";
    let {
        nombre = $bindable(""),
        codigo = $bindable(""),
        producto = $bindable(""),
        unidad = $bindable(""),
        cliente = $bindable(""),
        cantidad = $bindable(""),
        edit = $bindable(false),
        clientes = [],
        unidades = [],
        productos = [],
        id = "",
        add = false,
        guardar = () => {},
        eliminar = () => {},
        volver = () => {},
    } = $props();

    let clientesrows = $derived(
        add ? clientes.filter((c) => c.active) : clientes,
    );
    let unidadesrows = $derived(
        add ? unidades.filter((c) => c.active) : unidades,
    );
    let productosclientes = $derived(
        add ? productos.filter((c) => c.active) : productos,
    );
    let productosrows = $derived(
        cliente.length > 0
            ? productosclientes.filter((p) => p.cliente == cliente)
            : productosclientes,
    );
    let nombreViejo = $state(nombre);
    let codigoViejo = $state(codigo);
    let cantidadViejo = $state(cantidad);
    let productoViejo = $state();
    let clienteViejo = $state();
    function openEditar() {
        nombreViejo = nombre;
        codigoViejo = codigo;
        cantidadViejo = cantidad;
        productoViejo = producto;
        clienteViejo = cliente;
        edit = true;
    }
    function cerrarEditar() {
        nombre = nombreViejo;
        codigo = codigoViejo;
        cantidad = cantidadViejo;
        producto = productoViejo;
        cliente = clienteViejo;
        edit = false;
    }
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Nombre</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="nombre"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={nombre}
                />
            </label>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(nombre)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="codigo" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Código</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="codigo"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={codigo}
                />
            </label>
        {:else}
            <label
                for="codigo"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {codigo}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Cantidad</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="cantidad"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={cantidad}
                />
            </label>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(cantidad)}
            </label>
        {/if}
    </div>

    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
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
        {#if edit}
            <select
                class="
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={cliente}
            >
                {#each clientesrows as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(cliente, clientesrows)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Producto</span
            >
        </label>
        {#if edit}
            <select
                class="
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={producto}
            >
                {#each productosrows as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(producto, productosrows)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Unidad</span
            >
        </label>
        {#if edit}
            <select
                class="
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={unidad}
            >
                {#each unidadesrows as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(unidad, unidadesrows)}
            </label>
        {/if}
    </div>
</div>
{#if edit}
    <div
        class="mt-6 flex space-x-3 justify-end border-t border-gray-300 dark:border-gray-800"
    >
        <!-- Botón Cancelar -->
        {#if add}
            <!-- Botón Editar -->
            <button
                class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                onclick={guardar}
            >
                Guardar
            </button>
        {:else}
            <button
                class="
                hover:cursor-pointer
                mt-2 px-5 py-1 md:py-2 md:px-10
                dark:bg-transparent
                bg-white
                text-gray-800
                dark:text-white
                font-medium
                rounded-full shadow-sm border
                border-gray-300
                hover:bg-gray-200
                dark:hover:bg-gray-800
                transition-colors
                text-base"
                onclick={cerrarEditar}
            >
                Cancelar
            </button>
            <!-- Botón Editar -->
            <button
                class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                onclick={guardar}
            >
                Guardar cambios
            </button>
        {/if}
    </div>
{/if}
<div
    class={`mt-6 flex space-x-3 justify-end border-t border-gray-300 dark:border-gray-800 ${edit ? "hidden" : ""}`}
>
    <button
        onclick={eliminar}
        class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
    >
        Eliminar
    </button>

    <button
        class={`
        hover:cursor-pointer 
            mt-2 px-5 py-1 md:py-2 md:px-10 
            bg-[#115642] text-white font-medium rounded-full shadow-sm 
            hover:bg-green-700 transition-colors text-base
            
        `}
        onclick={openEditar}
    >
        Editar
    </button>
</div>
