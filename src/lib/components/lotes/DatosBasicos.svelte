<script>
    import estilos from "$lib/estilos";
    import estadoslote from "$lib/genericos/estadoslote";
    import Swal from "sweetalert2";
    import { getDateCorrect, shorterWord } from "$lib/genericos/strings";
    import { getNombreLista } from "$lib/genericos/strings";
    import { onMount } from "svelte";
    let {
        edit = $bindable(false),
        conmovimiento = $bindable(false),
        id = $bindable(""),
        codigo = $bindable(""),
        cerrado = $bindable(0),
        cerradoviejo = $bindable(0),
        cantidadviejo = $bindable(0),
        producto = $bindable(""),
        cantidad = $bindable(""),
        unidad = $bindable(""),
        vencimiento = $bindable(""),
        ingreso = $bindable(""),
        cliente = $bindable(""),
        remito = $bindable(""),
        lote = $bindable(""),
        cierre = "",
        add = false,
        guardar = () => {},
        eliminar = () => {},
        onchangeproducto = () => {},
        volver = () => {},
        clientes = [],
        productos = [],
        unidades = [],
    } = $props();
    let clientesrows = $derived(
        add
            ? clientes
                  .filter((c) => c.active)
                  .sort((a, b) =>
                      a.nombre.toLocaleLowerCase() <
                      b.nombre.toLocaleLowerCase()
                          ? -1
                          : 1,
                  )
            : clientes.sort((a, b) =>
                  a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                      ? -1
                      : 1,
              ),
    );
    let productosclientes = $derived(
        cliente.length > 0
            ? productos.filter((p) => p.cliente == cliente)
            : productos,
    );

    let productosrows = $derived(
        add
            ? productosclientes
                  .filter((c) => c.active)
                  .sort((a, b) =>
                      a.nombre.toLocaleLowerCase() <
                      b.nombre.toLocaleLowerCase()
                          ? -1
                          : 1,
                  )
            : productos.sort((a, b) =>
                  a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                      ? -1
                      : 1,
              ),
    );
    let unidadesrows = $derived(
        add ? unidades.filter((c) => c.active) : unidades,
    );
    let codigoviejo = $state("");
    let productoviejo = $state("");
    
    let unidadviejo = $state("");
    let clienteviejo = $state("");
    let vencimientoviejo = $state("");
    let ingresoviejo = $state("");
    let remitoviejo = $state("");
    let loteviejo = $state("");
    function setEditar() {
        codigoviejo = codigo;

        productoviejo = producto;
        cantidadviejo = cantidad;
        unidadviejo = unidad;
        clienteviejo = cliente;

        vencimientoviejo = vencimiento;
        ingresoviejo = ingreso;
        remitoviejo = remito;
        loteviejo = lote;
        cerradoviejo = cerrado;
    }
    function openEditar() {
        setEditar();
        edit = true;
    }
    function cerrarEditar() {
        codigo = codigoviejo;
        producto = productoviejo;
        cantidad = cantidadviejo;
        unidad = unidadviejo;
        cliente = clienteviejo;
        vencimiento = vencimientoviejo;
        ingreso = ingresoviejo;
        remito = remitoviejo;
        lote = loteviejo;
        cerrado = cerradoviejo;
        edit = false;
    }
    onMount(() => setEditar());
</script>

<div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
    {#if add}
        <div class="mb-1 lg:mb-0 col-span-1 lg:col-span-2">
            <label class="label">
                <input
                    type="checkbox"
                    bind:checked={conmovimiento}
                    class="checkbox"
                />
                Crear movimiento
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
                Codigo</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="nombre"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={codigo}
                />
            </label>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {shorterWord(codigo)}
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
        <label for="ingreso" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Ingreso</span
            >
        </label>
        {#if edit}
            <input
                id="ingreso"
                type="date"
                class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                bind:value={ingreso}
            />
        {:else}
            <label
                for="ingreso"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getDateCorrect(ingreso)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="Vencimiento" class="label mb-0 pb-0">
            <span
                class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
            >
                Vencimiento</span
            >
        </label>
        {#if edit}
            <input
                id="Vencimiento"
                type="date"
                class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                bind:value={vencimiento}
            />
        {:else}
            <label
                for="Vencimiento"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getDateCorrect(vencimiento)}
            </label>
        {/if}
    </div>
    <div class="mb-1 lg:mb-0 flex flex-col">
        <label for="Cliente" class="label mb-0 pb-0">
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
                {#each clientes as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="Cliente"
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
                {#each productosclientes as s}
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
                Estado</span
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
                bind:value={cerrado}
            >
                {#each estadoslote as s}
                    <option value={s.id}>{s.nombre}</option>
                {/each}
            </select>
        {:else}
            <label
                for="Unidad"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getNombreLista(cerrado, estadoslote)}
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
                Remito</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="nombre"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={remito}
                />
            </label>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {remito}
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
                Lote</span
            >
        </label>
        {#if edit}
            <label class="input-group">
                <input
                    id="nombre"
                    type="text"
                    class={`input input-bordered w-full ${estilos.bgdark}`}
                    bind:value={lote}
                />
            </label>
        {:else}
            <label
                for="rp"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {lote}
            </label>
        {/if}
    </div>
    {#if !add}
        <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
            <label for="cierre" class="label mb-0 pb-0">
                <span
                    class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
                >
                    Cierre</span
                >
            </label>
            <label
                for="cierre"
                class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
            >
                {getDateCorrect(cierre)}
            </label>
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
