<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import { shorterWord } from "$lib/genericos/strings";
    import { getNombreLista } from "$lib/genericos/strings";
    import { onMount } from "svelte";
    let {
        nombre = $bindable(""),
        cliente = $bindable(""),
        codigo = $bindable(""),
        
        guardar = async () => {},
        agregar = () => {},
        volver = () => {},
        clientes = []
    } = $props();
    let inputRef = $state(null);

    // Se ejecuta apenas el componente se monta y el input está disponible
    $effect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    });
    let clientesrows = $derived(add?clientes.filter(c=>c.active):clientes)
    
</script>
<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
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
                {getNombreLista(cliente,clientes)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="nombre" class="label mb-0 pb-0">
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
        <label class="input-group">
                <input
                    id="rp"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={nombre}
                    bind:this={inputRef}
                />
            </label>
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
                Código</span
            >
        </label>
        <label class="input-group">
                <input
                    id="rp"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={codigo}
                />
            </label>
    </div>
    
</div>

<div
    class={`mt-6 flex space-x-3 justify-end border-t border-gray-300 dark:border-gray-800 ${edit ? "hidden" : ""}`}
>
    <button
        onclick={volver}
        class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
    >
        Volver
    </button>

    <button
        class={`
            hover:cursor-pointer 
            mt-2 px-5 py-1 md:py-2 md:px-10 
            bg-[#115642] text-white font-medium rounded-full shadow-sm 
            hover:bg-green-700 transition-colors text-base  
        `}
        onclick={agregar}
    >
        Agregar
    </button>
</div>