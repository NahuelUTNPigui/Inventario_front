<script>
    import Plus from "../svg/Plus.svelte";
    import Pencil from "../svg/Pencil.svelte";
    import estilos from "$lib/estilos";
    import { slide } from "svelte/transition";
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1100);
    let {
        idunidad = "",
        nombreunidad = $bindable(),

        nuevo = () => {},
        limpiar = () => {},
        editar = (id) => {},

        validarBotonUnidad = () => {},
        edit = false
    } = $props();
</script>
<svelte:window bind:innerWidth bind:innerHeight />
<div class="container mx-auto py-0 my-0 px-4 max-w-7xl w-full xl:w-3/4">
    <!--Header-->
    <div
        class={`
            rounded-t-xl py-0 shadow-2xl mb-0
            dark:bg-slate-900 bg-white
            px-6
            
        `}
    >
        <div class="flex flex-row py-2 w-full">
            <div class="flex items-center justify-center"> 
                {#if idunidad == ""}
                    <button
                        onclick={nuevo}
                        class="hover:cursor-pointer"
                    >
                        <Plus size="size-5" />
                    </button>
                {:else}
                <button
                        onclick={limpiar}
                        class="hover:cursor-pointer"
                    >
                        Limpiar
                    </button>
                    <button
                        onclick={editar}
                        class="hover:cursor-pointer"
                    >
                        <Pencil size="size-5" />
                    </button>
                {/if}
            </div>
            <div class="w-full">
                <label class="input-group">
                    <input
                        id="nombre"
                        type="text"
                        class={`
                                    input input-bordered 
                                    w-full
                                    border border-gray-300 rounded-md
                                    dark:border-gray-700
                                    focus:outline-none focus:ring-2 
                                    focus:ring-red-900 
                                    focus:border-red-900
                                    bg-white  dark:bg-slate-900
                                    
                                `}
                        placeholder={idunidad == "" ? "Agregar nueva unidad" : ""}
                        bind:value={nombreunidad}
                        oninput={validarBotonUnidad}
                    />
                </label>
            </div>
        </div>
    </div>
</div>