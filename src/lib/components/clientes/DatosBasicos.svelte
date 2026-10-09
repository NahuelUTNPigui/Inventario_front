<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import { shorterWord } from "$lib/genericos/strings";
    let {
        nombre = $bindable(""),
        edit = $bindable(false),
        id = "",
        add = false,
        guardar = async () => {},
        eliminar = () => {},
        volver = () => {},
    } = $props();
    let inputRef = $state(null);

    let nombreViejo = $state(nombre);
    function openEditar() {
        nombreViejo = nombre;
        edit = true;
    }
    function cerrarEditar() {
        nombre = nombreViejo;
        edit = false;
    }
    // Se ejecuta apenas el componente se monta y el input está disponible
    $effect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    });
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
                    id="rp"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={nombre}
                    bind:this={inputRef}
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
</div>
{#if edit}
    <div class="mt-6 flex space-x-3 justify-end border-t border-gray-300 dark:border-gray-800">
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
