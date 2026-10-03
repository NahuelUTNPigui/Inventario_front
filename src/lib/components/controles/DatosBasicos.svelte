<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import {
        shorterWord,
        getNombreLista,
        getDateCorrect,
    } from "$lib/genericos/strings";

    import { onMount } from "svelte";
    let {
        fecha = $bindable(""),
        producto = $bindable(""),
        unidad = $bindable(""),
        cantidad = $bindable(""),
        lote = $bindable(""),
        cliente = $bindable(""),
        responsable = $bindable(""),
        edit = $bindable(false),
        id = "",
        add = false,
        guardar = async () => {},
        eliminar = () => {},
        volver = () => {},
        onchangeproducto=()=>{},
        clientes = [],
        productos = [],
        unidades = [],
    } = $props();
    let clientesrows = $derived(
        add ? clientes.filter((c) => c.active) : clientes,
    );
    let fechaviejo = $state("");
    let productoviejo = $state("");
    let unidadviejo = $state("");
    let cantidadviejo = $state("");
    let loteviejo = $state("");
    let clienteviejo = $state("");
    function setEditar() {
        fechaviejo = fecha;
        productoviejo = producto;
        unidadviejo = unidad;
        cantidadviejo = cantidad;
        loteviejo = lote;
        clienteviejo = cliente;
    }
    function openEditar() {
        setEditar();
        edit = true;
    }
    function cerrarEditar() {
        fecha = fechaviejo;
        producto = productoviejo;
        unidad = unidadviejo;
        cantidad = cantidadviejo;
        lote = loteviejo;
        cliente = clienteviejo;
        edit = false;
    }
    onMount(() => {
        setEditar();
    });
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    <div class="mb-1 lg:mb-0 col-span-1 lg:col-span-2">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Responsable</span
            >
        </label>
        <label
            for="rp"
            class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
        >
            {responsable}
        </label>
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="fecha" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Fecha</span
            >
        </label>
        {#if edit}
            <input
                id="fecha"
                type="date"
                class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                bind:value={fecha}
            />
        {:else}
            <label
                for="fecha"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getDateCorrect(fecha)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 flex flex-col">
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
        {#if edit}
            <select
                class="
                bg-white dark:bg-slate-900
                border
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
                for="cliente"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(cliente, clientes)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 flex flex-col">
        <label for="Producto" class="label mb-0 pb-0">
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
                border
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                onchange={onchangeproducto}
                bind:value={producto}
            >
                {#each productos as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="Producto"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(producto, productos)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 flex flex-col">
        <label for="Unidad" class="label mb-0 pb-0">
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
                border
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={unidad}
            >
                {#each unidades as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="Unidad"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(unidad, unidades)}
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
