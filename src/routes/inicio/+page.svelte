<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import Navbar2 from "$lib/components/Navbar2.svelte";
    import CardBase from "$lib/components/CardBase.svelte";
    import StatCard from "$lib/components/StatCard.svelte";
    import estilos from "$lib/estilos";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    import Swal from "sweetalert2";
    import estadoslote from "$lib/genericos/estadoslote";
    import {
        addDays,
        dateDiffInDays,
        formatearFecha,
        getNombreLista,
        makecodigo,
    } from "$lib/genericos/strings";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import Buscador from "$lib/components/inicio/Buscador.svelte";
    import TablaStock from "$lib/components/inicio/TablaStock.svelte";
    import NuevoProducto from "$lib/components/NuevoProducto.svelte";
    import ListaStock from "$lib/components/inicio/ListaStock.svelte";
    
    let buscar = $state("");
    let clientes = $state([]);
    let cliente = $state("");
    let stock = $state([]);
    let productos = $state([])
    let unidades = $state([])
    let stockrows = $state([]);
    let usuario = $state({ id: "-1" });
    let nivel = $state(0);
    
    //storage
    
    let defaultInicio = {cliente:""}
    let detalleInicio = $state(defaultInicio)
    let storageInicio = createStorageProxy("inicio",defaultInicio)
    //fin storage
    //nuevo producto
    let nombre = $state("");
    let codigo = $state("");
    //lote
    let defaultlote = {
        id: "",
        codigo: "",
        cerrado: 0,
        producto: "",
        cantidad: "",
        unidad: "",
        vencimiento: "",
        ingreso: "",
        cliente: "",
        remito: "",
        lote: "",
        cierre:"",
        edit: false,
    };
    let detallelote = $state(defaultlote);
    let storageLote = createStorageProxy("detallelote", defaultlote);
    //nuevo lote
    let cargado  =$state(false)
    let conmovimiento = $state(true);
    let codigolote = $state("");
    let cerradolote = $state(0);
    let productolote = $state("");
    let cantidadlote = $state("");
    let unidadlote = $state("");
    let remitolote = $state("");
    let lotelote = $state("");
    let vencimientolote = $state("");
    let ingresolote = $state("");
    //ruta
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let usuarioid = $state("");
    async function guardarProducto() {
        if (nombre.length == "") {
            Swal.fire("Error nombre", "Debe escribir algún nombre", "error");
            return;
        }
        let data = {
            active: true,
            nombre,
            cliente,
            codigo,
        };
        try {
            let recordc = await pb.collection("productos").create(data);
            Swal.fire(
                "Éxito guardar",
                `Se logró registar el producto`,
                "success",
            );
            await getProductos()
            cerrarProducto();
        } catch (err) {
            Swal.fire(
                "Error guardar",
                `No se logró registar el producto`,
                "error",
            );
        }
    }
    function nuevoProducto() {
        nombre = "";

        codigo = makecodigo("prod");
        inicioProducto.showModal();
    }
    function cerrarProducto() {
        nombre = "";

        codigo = "";
        inicioProducto.close();
    }

    async function guardarLote() {
        if (codigolote == "" ) {
            Swal.fire(
                "Error datos",
                "Debe escribir un código. Por ejemplo,el nombre del producto",
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
        if (cantidadlote == "" ) {
            Swal.fire(
                "Error datos",
                "Debe escribir una cantidad. Cero es válido",
                "error",
            );
            return;
        }
        if(conmovimiento && ingresolote.length==0){
            Swal.fire(
                "Error datos",
                "Para guardar con movimiento debe seleccionar una fecha",
                "error",
            );
            return
        }
        let data = {
            codigo: codigolote,
            unidad: unidadlote,
            cerrado: cerradolote,
            producto: productolote,
            cantidad: cantidadlote,
            fechavencimiento: vencimientolote.length>0?vencimientolote + " 03:00:00":"",
            fechaingreso:ingresolote.length>0? ingresolote + " 03:00:00":"",
            cliente,
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
            cliente,
            producto: productolote,
            unidad: unidadlote,
            lote: "",
            movimiento: "",
            historial:0
        };
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
                    detallemovimiento:recorddetalle.id
                }
                await pb.collection("lotes").update(recordc.id,datalotedetalle)
            }
            await getStock();
            
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
    function nuevoLote() {
        conmovimiento = true;
        codigolote = "";
        cerradolote = 0;
        productolote = "";
        cantidadlote = "";
        unidadlote = "";
        remitolote = "";
        lotelote = "";
        vencimientolote = "";
        ingresolote = "";
        inicioStock.showModal();
    }
    function cerrarLote() {
        inicioStock.close();
    }
    function nuevoIngreso() {
        detallemovimiento = {
            id: "",
            codigo: "",
            fecha: "",
            observacion: "",
            ingreso: 0,
            lote: "",
            edit: false,
        };

        storageMovimiento.save(detallemovimiento);
        goto("/movimientos/0");
    }

    async function getData() {
        let hoy = new Date();
        let ayer = addDays(hoy, -1);
        let mañana = addDays(hoy, 1);

        let s_ayer = formatearFecha(ayer);
        let s_mañana = formatearFecha(mañana);

        clientes = [];
        const recordsc = await pb.collection("clienteslote").getFullList();
        let recordu = await pb.collection("unidades").getFullList({
            filter:"active=true"
        });
        unidades = recordu;
        clientes = recordsc.map((c) => ({ ...c }));
        clientes = clientes.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );

        let pb_record = JSON.parse(localStorage["pocketbase_auth"]);
        usuario = pb_record.record;
        nivel = usuario.nivel;
    }
    function openViewModal(p_id) {
        let c_idx = stock.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = stock[c_idx];
            let detallelote = {
                id: c.id,
                codigo: c.codigo,
                cerrado: c.cerrado,
                producto: c.producto,
                cantidad: c.cantidad,
                unidad: c.unidad,
                cliente: c.expand ? c.expand.producto.cliente : c.cliente,
                vencimiento:
                    c.fechavencimiento.length > 0
                        ? c.fechavencimiento.split(" ")[0]
                        : "",
                ingreso:
                    c.fechaingreso.length > 0
                        ? c.fechaingreso.split(" ")[0]
                        : "",
                cierre:
                    c.fechacierre.length > 0
                        ? c.fechacierre.split(" ")[0]
                        : "",
                edit: false,
                remito:c.remito,
                lote:c.lote
            };
            storageLote.save(detallelote);
            goto("/lotes/" + c.id);
        }
    }
    async function getStock() {
        const recordsl = await pb.collection("lotes").getFullList({
            filter: `active = true && producto.cliente = '${cliente}'`,
            expand: "producto,unidad",
            sort: "-fechaingreso",
        });
        stock = recordsl;
        filterUpdate();
    }
    async function getProductos() {
        productos = []
        const recordsc = await pb.collection("productos").getFullList({
            filter: `active = true && cliente ='${cliente}'`,
        });

        productos = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        cargado = true
    }
    async function seleccionarCliente() {
        detalleInicio.cliente = cliente
        storageInicio.save(detalleInicio)
        if (cliente != "") {

            stock = [];
            await getStock();
            await getProductos()
        }
    }
    function filterUpdate() {
        stockrows = stock;
        if (stockrows != "") {
            stockrows = stockrows.filter(
                (t) =>
                    t.expand &&
                    t.expand.producto &&
                    t.expand.producto.nombre
                        .toLocaleLowerCase()
                        .includes(buscar.toLocaleLowerCase()),
            );
        }
    }
    function getStorage(){
        detalleInicio = storageInicio.load()
        cliente = detalleInicio.cliente
    }
    onMount(async () => {
        getStorage()
        await getData();
        await seleccionarCliente()
    });
</script>

<Navbar>
    <Buscador
        bind:buscar
        bind:cliente
        {nivel}
        {clientes}
        {productos}
        {seleccionarCliente}
        {filterUpdate}
        {nuevoProducto}
        {nuevoIngreso}
        {nuevoLote}
    />
    {#if cliente != ""}
        <!--Tabla-->
        <div
            class={`
                hidden w-full xl:w-3/4 md:grid
                mx-auto py-0 my-0 px-4 max-w-7xl  
            `}
        >
            <div
                class={`
                    py-0 my-0
                    overflow-hidden rounded-xl
                    border border-gray-300 dark:border-gray-700
                `}
            >
                <TablaStock lotesrows={stockrows} {openViewModal} />
            </div>
        </div>
        <!--Celu-->
        <div
            class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <ListaStock TablaStock lotesrows={stockrows} {openViewModal} />
        </div>
    {/if}
</Navbar>
<dialog id="inicioProducto" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo producto</h3>
        <NuevoProducto bind:nombre bind:codigo {cliente} {clientes} />

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
<dialog id="inicioStock" class="modal">
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
