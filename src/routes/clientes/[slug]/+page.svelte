<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import DetalleCliente from "$lib/components/clientes/DetalleCliente.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import DatosBasicos from "$lib/components/clientes/DatosBasicos.svelte";
    import estilos from "$lib/estilos";
    import { goto } from "$app/navigation";
    import SelectTabs from "$lib/components/SelectTabs.svelte";
    import HorizontalTabs from "$lib/components/HorizontalTabs.svelte";
    import Productos from "$lib/components/clientes/Productos.svelte";
    import Lotes from "$lib/components/clientes/Lotes.svelte";
    import PocketBase from "pocketbase";
    import Swal from "sweetalert2";
    import { error } from "@sveltejs/kit";
    import estadoslote from "$lib/genericos/estadoslote";
    import { makecodigo } from "$lib/genericos/strings";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    let defaultcliente = {
        id: "",
        nombre: "",
        edit: false,
    };
    let detallecliente = $state(defaultcliente);
    let storageCliente = createStorageProxy("detallecliente", defaultcliente);
    //Data
    let id = $state("");
    let nombre = $state("");
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);

    let productos = $state([]);
    let lotes = $state([]);
    let unidades = $state([]);

    //nuvo producto
    let productosRef = $state({});
    let nombreproducto = $state("");
    let codigoproducto = $state("");
    function openProductoModal() {
        nombreproducto = "";
        codigoproducto = "";
        nuevoProductoCliente.showModal();
    }
    function cerrarProducto() {
        nuevoProductoCliente.close();
    }
    async function guardarProducto() {
        if (nombreproducto.length == "") {
            return;
        }
        let data = {
            active: true,
            nombre: nombreproducto,
            cliente: id,
            codigo: codigoproducto,
        };
        try {
            let recordc = await pb.collection("productos").create(data);
            Swal.fire(
                "Éxito guardar",
                `Se logró registar el producto`,
                "success",
            );
            cerrarProducto();

            await productosRef.getData();
            productosRef.setFocus();
        } catch (err) {
            console.error(err);

            Swal.fire(
                "Error guardar",
                `No se logró registar el producto`,
                "error",
            );
        }
    }
    //nuevolote
    let conmovimiento = $state(true);
    let lotesRef = $state({});
    let codigolote = $state("");
    let cerradolote = $state(0);
    let productolote = $state("");
    let cantidadlote = $state("");
    let unidadlote = $state("");
    let remitolote = $state("");
    let lotelote = $state("");
    let vencimientolote = $state("");
    let ingresolote = $state("");
    function openLoteModal() {
        codigolote = "";
        cerradolote = 0;
        productolote = "";
        cantidadlote = "";
        unidadlote = "";
        remitolote = "";
        lotelote = "";
        vencimientolote = "";
        ingresolote = "";
        nuevoStockCliente.showModal();
    }
    function cerrarLote() {
        nuevoStockCliente.close();
    }
    async function guardarLote() {
        if (codigolote == "") {
            Swal.fire(
                "Error datos",
                "Debe escribir el código del lote. Puede ser el nombre del producto",
                "error",
            );
            return;
        }
        if (cantidadlote == "") {
            Swal.fire(
                "Error datos",
                "Debe escribir alguna cantidad. El cero es válido",
                "error",
            );
            return;
        }
        if (unidadlote == "" || productolote == "") {
            Swal.fire(
                "Error datos",
                "Debe seleccionar una unidad y un producto",
                "error",
            );
            return;
        }
        let data = {
            codigo: codigolote,
            unidad: unidadlote,
            cerrado: cerradolote,
            producto: productolote,
            cantidad: cantidadlote,
            fechavencimiento:
                vencimientolote.length > 0 ? vencimientolote + " 03:00:00" : "",
            fechaingreso:
                ingresolote.length > 0 ? ingresolote + " 03:00:00" : "",
            cliente: id,
            remito: remitolote,
            lote: lotelote,
            active: true,
        };
        let nombreproducto = getNombreProducto();
        let movimiento = {
            active: true,
            fecha: ingresolote + " 03:00:00",
            observacion: "Nuevo stock",
            ingreso: 0,
            codigo: makecodigo("mov", 3, true),
            precargado: false,
        };
        let detalle = {
            cantidad: cantidadlote,
            cliente: id,
            producto: productolote,
            unidad: unidadlote,
            lote: "",
            movimiento: "",
        };
        if (conmovimiento && ingresolote.length == 0) {
            Swal.fire(
                "Error datos",
                "Debe seleccionar una fecha de ingreso si quiere crear un movimiento",
                "error",
            );
            return;
        }
        try {
            let recordc = await pb.collection("lotes").create(data);
            if (conmovimiento) {
                let recordmov = await pb
                    .collection("movimientos")
                    .create(movimiento);
                detalle.movimiento = recordmov.id;
                detalle.lote = recordc.id;
                let recorddetalle = await pb
                    .collection("detallemovimientos")
                    .create(detalle);
                let datalotedetalle = {
                    detallemovimiento: recorddetalle.id,
                };
                await pb
                    .collection("lotes")
                    .update(recordc.id, datalotedetalle);
            }

            await lotesRef.getData();
            lotesRef.setFocus();
            cerrarLote();
            Swal.fire("Éxito guardar", `Se logró registar el lote`, "success");
        } catch (err) {
            Swal.fire("Error guardar", `No se logró registar el lote`, "error");
        }
    }
    function getNombreProducto() {
        let idx_prod = productos.findIndex((p) => p.id == productolote);
        if (idx_prod != -1) {
            let nombreproducto = productos[idx_prod].nombre;
            return nombreproducto;
        }
        return "";
    }
    function onchangeproducto() {
        let idx_prod = productos.findIndex((p) => p.id == productolote);
        if (idx_prod != -1) {
            let nombreproducto = productos[idx_prod].nombre;
            if (codigolote == "") {
                codigolote = makecodigo(nombreproducto);
            }
        }
    }
    //tabs
    let tab = $state("base");
    let tabs = [
        { id: "base", nombre: "Datos básicos" },
        { id: "prod", nombre: "Productos" },
        { id: "lote", nombre: "Stock" },
    ];
    function getData() {
        detallecliente = storageCliente.load();

        id = detallecliente.id;

        nombre = detallecliente.nombre;

        edit = detallecliente.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
        }
    }
    function volver() {
        goto("/clientes");
    }
    async function guardarCliente() {
        if (nombre.length == 0) {
            Swal.fire("Error guardar", "Debe escribir algún nombre", "error");
            return;
        }
        if (id.length > 0 && !add) {
            await editarCliente();
        } else {
            let data = {
                nombre,
                active: true,
            };
            try {
                let recordc = await pb.collection("clientes").create(data);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el cliente`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el cliente`,
                    "error",
                );
            } finally {
                volver();
            }
        }
    }
    async function editarCliente() {
        let data = {
            nombre,
        };
        try {
            let recordc = await pb.collection("clientes").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el cliente`, "success");
        } catch (err) {
            Swal.fire(
                "Error edición",
                `No se logró editar el cliente`,
                "error",
            );
        } finally {
            volver();
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("clientes").update(p_id, data);
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el cliente`,
                "success",
            );
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el cliente`,
                "error",
            );
        }
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar cliente",
            text: "¿Seguro que deseas eliminar el cliente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el cliente con éxito",
                    "success",
                );
            }
        });
    }
    async function getLista() {
        unidades = await pb.collection("unidades").getFullList({
            filter: `active = true`,
            sort: "nombre",
        });
        productos = await pb.collection("productos").getFullList({
            filter: `active = true && cliente ='${id}'`,
            sort: "nombre",
        });

        const recordsl = await pb.collection("lotes").getFullList({
            filter: `active = true && producto.cliente = '${id}'`,
            expand: "producto,unidad",
            sort: "-fechaingreso",
        });

        lotes = recordsl;
        cargado = true;
    }
    onMount(async () => {
        getData();
        await getLista();
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleCliente {add} {nombre}>
        {#if !add}
            <div class="flex justify-center mt-1">
                <div class="w-full max-w-7xl px-4">
                    <!-- Combo alineado al borde izquierdo de la card -->
                    {#if esCelu}
                        <SelectTabs pestañas={tabs} bind:tab />
                    {:else}
                        <HorizontalTabs pestañas={tabs} bind:tab />
                    {/if}
                </div>
            </div>
        {/if}
        {#if tab == "base"}
            {#if cargado}
                <DatosBasicos
                    bind:nombre
                    bind:edit
                    {add}
                    {id}
                    {volver}
                    guardar={guardarCliente}
                    eliminar={openDelModal}
                />
            {/if}
        {:else if tab == "prod"}
            <Productos
                bind:this={productosRef}
                bind:productos
                {pb}
                cliente={id}
                {openProductoModal}
            />
        {:else}
            <Lotes
                bind:lotes
                bind:this={lotesRef}
                {pb}
                cliente={id}
                {openLoteModal}
            />
        {/if}
    </DetalleCliente>
</Navbar>
<dialog id="nuevoProductoCliente" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo producto</h3>
        <div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
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
                        id="nombre"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={nombreproducto}
                    />
                </label>
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
                <label class="input-group">
                    <input
                        id="codigo"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={codigoproducto}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
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
                <label
                    for="cliente"
                    class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
                >
                    {nombre}
                </label>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    onclick={cerrarProducto}>Cerrar</button
                >
                <button
                    onclick={guardarProducto}
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    >Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
<dialog id="nuevoStockCliente" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo Stock</h3>
        <div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
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
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="codigolote" class="label mb-0 pb-0">
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
                <label class="input-group">
                    <input
                        id="codigolote"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={codigolote}
                    />
                </label>
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
                    onchange={onchangeproducto}
                    bind:value={productolote}
                >
                    {#each productos as s}
                        <option value={s.id}>{s.nombre}</option>
                    {/each}
                </select>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="cantidadlote" class="label mb-0 pb-0">
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
                        id="cantidadlote"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={cantidadlote}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="ingresolote" class="label mb-0 pb-0">
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
                <input
                    id="ingresolote"
                    type="date"
                    class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                    bind:value={ingresolote}
                />
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="vencimientolote" class="label mb-0 pb-0">
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
                <input
                    id="vencimientolote"
                    type="date"
                    class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        ${estilos.bgdark2} 
                    `}
                    bind:value={vencimientolote}
                />
            </div>
            {#if cargado}
                <div class="mb-1 lg:mb-0 flex flex-col">
                    <label for="unidadlote" class="label mb-0 pb-0">
                        <span
                            class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                        >
                            Unidad
                        </span>
                    </label>
                    <select
                        class="
                        bg-white dark:bg-slate-900
                        border
                        border-gray-300 dark:border-gray-600
                        rounded-md px-3 py-1.5 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                        "
                        bind:value={unidadlote}
                    >
                        {#each unidades as s}
                            <option value={s.id}>{s.nombre}</option>
                        {/each}
                    </select>
                </div>
            {/if}
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
                <select
                    class="
                        bg-white dark:bg-slate-900
                        border
                        border-gray-300 dark:border-gray-600
                        rounded-md px-3 py-1.5 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                    "
                    bind:value={cerradolote}
                >
                    {#each estadoslote as s}
                        <option value={s.id}>{s.nombre}</option>
                    {/each}
                </select>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="remitolote" class="label mb-0 pb-0">
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
                <label class="input-group">
                    <input
                        id="remitolote"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={remitolote}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="lotelote" class="label mb-0 pb-0">
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
                <label class="input-group">
                    <input
                        id="lotelote"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={lotelote}
                    />
                </label>
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    onclick={cerrarLote}>Cerrar</button
                >
                <button
                    onclick={guardarLote}
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    >Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
