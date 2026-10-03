<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import { shorterWord } from "$lib/genericos/strings";
    import roles from "$lib/genericos/roles";
    import { getNombreRol } from "$lib/genericos/nombres";
    import { onMount } from "svelte";

    let {
        nombre = $bindable(""),
        apellido = $bindable(""),
        rol = $bindable(""),
        contra = $bindable(""),
        contraNueva = $bindable(""),
        contraVieja = $bindable(""),
        nivel = $bindable(0),
        correo = "",
        edit = $bindable(false),
        id = "",
        add = false,
        guardar = () => {},
        guardarContra = () => {},
        eliminar = () => {},
        volver = () => {},
    } = $props();
    let nombreViejo = $state(nombre);
    let apellidoViejo = $state(apellido);
    let rolViejo = $state(rol);
    let nivelViejo = $state(nivel);
    function setEditar() {
        nombreViejo = nombre;
        apellidoViejo = apellido;
        rolViejo = rol;
        nivelViejo = nivel;
    }
    function openEditar() {
        setEditar();
        edit = true;
    }
    function cerrarEditar() {
        nombre = nombreViejo;
        apellido = apellidoViejo;
        rol = rolViejo;
        nivel = nivelViejo;
        edit = false;
    }
    let cambiarContra = $state(false);

    onMount(setEditar);
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    {#if !add}
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
                    Correo</span
                >
            </label>
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {correo}
            </label>
        </div>
    {/if}
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
        <label for="Apellido" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Apellido</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="Apellido"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={apellido}
                />
            </label>
        {:else}
            <label
                for="Apellido"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(apellido)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 flex flex-col">
        <label for="rp" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Rol</span
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
                bind:value={nivel}
            >
                {#each roles as s}
                    <option value={s.nivel}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreRol(rol)}
            </label>
        {/if}
    </div>
    {#if add}
        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
            <label for="contra" class="label mb-0 pb-0">
                <span
                    class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
                >
                    Contraseña</span
                >
            </label>
            <input
                id="contra"
                type="text"
                class={`input input-bordered w-full ${estilos.bgdark}`}
                bind:value={contra}
                autocapitalize="off"
                autocomplete="off"
            />
        </div>
    {:else}
        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-2">
            <fieldset
                class="col-span-1 md:col-span-2 fieldset bg-transparent border
                border-gray-300 dark:border-gray-600 rounded-box"
            >
                <legend class="fieldset-legend">Contraseña</legend>
                <label class="label">
                    <input
                        type="checkbox"
                        bind:checked={cambiarContra}
                        class="toggle"
                    />
                    Cambiar
                </label>
                {#if cambiarContra}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1 m-1">
                            <label for="contra" class="label mb-0 pb-0">
                                <span
                                    class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                                >
                                    Vieja Contraseña</span
                                >
                            </label>
                            <input
                                id="contra"
                                type="text"
                                class={`input input-bordered w-full ${estilos.bgdark}`}
                                bind:value={contraVieja}
                                autocapitalize="off"
                                autocomplete="off"
                            />
                        </div>
                        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1 m-1">
                            <label for="contra" class="label mb-0 pb-0">
                                <span
                                    class="
                                    label-text tracking-wide
                                    text-md uppercase
                                    font-semibold dark:text-gray-400
                                    text-gray-500
                                "
                                >
                                    Nueva Contraseña</span
                                >
                            </label>
                            <input
                                id="contra"
                                type="text"
                                class={`input input-bordered w-full ${estilos.bgdark}`}
                                bind:value={contraNueva}
                                autocapitalize="off"
                                autocomplete="off"
                            />
                        </div>
                        <div
                            class="col-span-1 md:col-span-2 flex space-x-3 justify-end border-gray-300 dark:border-gray-800"
                        >
                            <button
                                class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-gray-700 transition-colors text-base"
                                onclick={guardarContra}
                            >
                                Guardar nueva contraseña
                            </button>
                        </div>
                    </div>
                {/if}
            </fieldset>
        </div>
    {/if}
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
