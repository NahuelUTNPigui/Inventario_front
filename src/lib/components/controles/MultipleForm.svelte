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
        responsable = "",
        guardar = () => {},
        clientes = [],
        productos = [],
        unidades = [],
    } = $props();
    let clientesrows = $derived(clientes.filter((c) => c.active));
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-2">
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
        <select
            class="
                bg-white dark:bg-slate-900
                border
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
            bind:value={producto}
        >
            {#each productos as s}
                <option value={s.id}>{s.nombre}</option>
            {/each}
        </select>
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
        <label class="input-group">
            <input
                id="cantidad"
                type="text"
                class={`input input-bordered w-full ${estilos.bgdark}`}
                bind:value={cantidad}
            />
        </label>
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <div class="flex space-x-3 justify-end  mt-2">
            <!-- Botón Agregar -->
            <button
                class="
                    hover:cursor-pointer mt-2 px-5 py-1 bg-red-900 
                    text-white font-medium rounded-full 
                    shadow-sm hover:bg-red-800 
                    transition-colors text-base
                    "
                onclick={guardar}
            >
                Agregar
            </button>
        </div>
    </div>
</div>

