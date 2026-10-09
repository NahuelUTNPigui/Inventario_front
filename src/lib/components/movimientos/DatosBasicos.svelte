<script>
    import estilos from "$lib/estilos";
    import Swal from "sweetalert2";
    import { shorterWord } from "$lib/genericos/strings";
    import tipomovimiento from "$lib/genericos/tipomovimiento";
    import { getNombreLista, getDateCorrect } from "$lib/genericos/strings";

    let {
        edit = $bindable(false),
        id = "",
        codigo = $bindable(""),
        cliente = $bindable(""),
        fecha = $bindable(""),
        cerrarLotes = $bindable(false),
        codigoproducto = $bindable(""),
        grupoproducto = $bindable(""),
        observacion = $bindable(""),
        remito = $bindable(""),
        ingreso = $bindable(0),
        detalles = $bindable([]),
        productos = [],
        grupos = [],
        clientes = [],

        add = false,
        guardar = () => {},
        eliminar = () => {},
        volver = () => {},
        selectCliente = () => {},
        onChangeCierre = () => {},
    } = $props();

    let inputRef = $state(null);

    // Se ejecuta apenas el componente se monta y el input está disponible
    $effect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    });
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="observacion" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Codigo</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="observacion"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={codigo}
                    bind:this={inputRef}
                />
            </label>
        {:else}
            <label
                for="observacion"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {codigo}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="tipo" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Tipo movimiento</span
            >
        </label>
        <br />
        {#if edit}
            <select
                class="
                w-full border
                bg-white dark:bg-slate-900
                border-gray-300 dark:border-gray-600
                rounded-md px-3 py-1.5 text-sm
                focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={ingreso}
            >
                {#each tipomovimiento as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(ingreso, tipomovimiento)}
            </label>
        {/if}
    </div>
    
    
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="Fecha" class="label mb-0 pb-0">
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
                id="Fecha"
                type="date"
                class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        bg-transparent
                        ${estilos.bgdark2} 
                    `}
                bind:value={fecha}
            />
        {:else}
            <label
                for="ingreso"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getDateCorrect(fecha)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="remito" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Remito</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="remito"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={remito}
                />
            </label>
        {:else}
            <label
                for="observacion"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(remito)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="observacion" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Observacion</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="observacion"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={observacion}
                />
            </label>
        {:else}
            <label
                for="observacion"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(observacion)}
            </label>
        {/if}
    </div>
    {#if add}
        <div>
            <label
                for="Cliente"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
                Cliente
            </label>
            <select
                class="
                    w-full border
                    bg-white dark:bg-slate-900
                    border-gray-300 dark:border-gray-600
                    rounded-md px-3 py-1.5 text-sm
                    focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                "
                bind:value={cliente}
                onchange={selectCliente}
            >
                {#each clientes as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        </div>
    {/if}
    {#if add && ingreso == 1}
        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
            <div class="mb-1 lg:mb-0 col-span-1 lg:col-span-2">
                <label class="label">
                    <input
                        type="checkbox"
                        bind:checked={cerrarLotes}
                        class="checkbox"
                        onchange={onChangeCierre}
                    />
                    Cerrar lotes
                </label>
            </div>
        </div>
    {/if}
</div>
