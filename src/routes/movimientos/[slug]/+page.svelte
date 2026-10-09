<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import DetalleMovimiento from "$lib/components/movimientos/DetalleMovimiento.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import DatosBasicos from "$lib/components/movimientos/DatosBasicos.svelte";
    import Acciones from "$lib/components/movimientos/Acciones.svelte";
    import Scanner from "$lib/components/movimientos/Scanner.svelte";
    import ScannerGrupos from "$lib/components/movimientos/ScannerGrupos.svelte";
    import { goto } from "$app/navigation";
    import PocketBase from "pocketbase";
    import ProcesarLotes from "$lib/components/movimientos/ProcesarLotes.svelte";
    import { makecodigo, makeid } from "$lib/genericos/strings";
    import Swal from "sweetalert2";
    import ScannerLote from "$lib/components/movimientos/ScannerLote.svelte";
    import AgregarLote from "$lib/components/movimientos/AgregarLote.svelte";
    import ProcesarEgreso from "$lib/components/movimientos/ProcesarEgreso.svelte";
    import TablaDetalles from "$lib/components/movimientos/TablaDetalles.svelte";
    import SeleccionarProducto from "$lib/components/movimientos/SeleccionarProducto.svelte";
    import SeleccionarLote from "$lib/components/movimientos/SeleccionarLote.svelte";
    import NuevoProducto from "$lib/components/NuevoProducto.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    let defaultmovimiento = {
        id: "",
        codigo: "",
        fecha: "",
        observacion: "",
        ingreso: 0,
        lote: "",
        edit: false,
        remito:"",
        cliente: "",
    };
    let detallemovimiento = $state(defaultmovimiento);
    let storageMovimiento = createStorageProxy(
        "detallemovimiento",
        defaultmovimiento,
    );
    let tab = $state("prod");
    let opciones = [
        //{ id: "grupo", nombre: "Grupos" },
        { id: "prod", nombre: "Productos" },
        { id: "lote", nombre: "Stock" },
    ];
    //listas
    let clientes = $state([]);
    let productos = $state([]);
    let productosrows = $state([]);
    let grupos = $state([]);
    let unidades = $state([]);
    let stock = $state([]);
    let stockrows = $state([]);
    //ids
    let idlote = $state("");
    let idproducto = $state("");
    let idgrupo = $state("");
    let cliente = $state("");
    //codigos
    let codigolote = $state("");
    let codigoproducto = $state("");
    let codigogrupo = $state("");
    //nombres
    let nombreproducto = $state("");
    let nombregrupo = $state("");
    //unidad
    let unidad = $state("");
    let unidadnombre = $state("");
    //fecha vencimiento
    let fechavencimiento = $state("");
    //Cantidad lote
    let cantidadlote = $state(0);
    //lote individuaal
    let producto = $state("");
    let remito = $state("");
    let lote = $state("");
    let selectedLote = $state("");
    //Feedback
    let malverificadogrupo = $state(false);
    let malverificadoproducto = $state(false);
    let malverificadolote = $state(false);
    let verificadogrupo = $state(false);
    let verificadoproducto = $state(false);
    let verificadolote = $state(false);

    //Data
    let id = $state("");
    let codigo = $state("");
    let observacion = $state("");
    let fecha = $state("");
    let ingreso = $state(0);
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);
    let remitoMov = $state("")

    //productos
    //nuevo producto
    let nombre = $state("");
    let codigoprod = $state("");
    function nuevoProducto() {
        nombre = "";

        codigoprod = makecodigo("prod");
        movimientoProducto.showModal();
    }
    function cerrarProducto() {
        nombre = "";

        codigoprod = "";
        movimientoProducto.close();
    }
    async function guardarProducto() {
        if (nombre.length == "") {
            return;
        }
        let data = {
            active: true,
            nombre,
            cliente,
            codigo: codigoprod,
        };
        try {
            let recordc = await pb.collection("productos").create(data);
            Swal.fire(
                "Éxito guardar",
                `Se logró registar el producto`,
                "success",
            );
            await getProductos();
            selectCliente();
            cerrarProducto();
        } catch (err) {
            Swal.fire(
                "Error guardar",
                `No se logró registar el producto`,
                "error",
            );
        }
    }
    let detalles = $state([]);
    async function getDetalles() {
        let res_detalles = await pb
            .collection("detallemovimientos")
            .getFullList({
                //expand:"lote",
                filter: `movimiento~'${id}' && eliminado=false`,
            });

        detalles = res_detalles;
        
    }
    async function getProductos() {
        productos = await pb.collection("productos").getFullList({
            filter: `active = true`,
        });
    }
    async function getStocks() {
        stock = await pb.collection("lotes").getFullList({
            filter: `active = true && cerrado = 0`,
        });
    }

    async function getData() {
        detallemovimiento = storageMovimiento.load();
        id = detallemovimiento.id;
        codigo = detallemovimiento.codigo;
        fecha = detallemovimiento.fecha;
        cliente = detallemovimiento.cliente;
        ingreso = detallemovimiento.ingreso;
        observacion = detallemovimiento.observacion;
        remitoMov=detallemovimiento.remito
        let slug = page.params.slug;
        grupos = await pb.collection("grupos").getFullList({
            filter: `active = true`,
        });

        await getStocks();
        unidades = await pb.collection("unidades").getFullList({
            filter: `active = true`,
        });
        const recordsc = await pb
            .collection("clientes")
            .getFullList({ filter: "active = true" });

        clientes = recordsc
            .map((c) => ({ ...c }))
            .sort((a, b) =>
                a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                    ? -1
                    : 1,
            );
        await getProductos();
        if (slug == "0") {
            add = true;
            edit = true;
            detalles = [];
            codigo = makecodigo("mov", 3, true);
            codigolote = detallemovimiento.lote;

            if (codigolote != "") {
                let p_lote = await getLoteCodigo(codigolote);
                if (p_lote) {
                    await seleccionarLote(p_lote);
                    tab = "lote";
                }
            }
        } else {
            edit = detallemovimiento.edit;
            await getDetalles();
        }
        cargado = true;
    }
    async function getLoteCodigo(p_codigo) {
        let record_lote = await pb
            .collection("lotes")
            .getFirstListItem(`codigo='${p_codigo}'`);
        return record_lote;
    }
    async function eliminar() {
        try {
            let detalles = await pb
                .collection("detallemovimientos")
                .getFullList({
                    expand: "lote",
                    filter: `movimiento='${id}'`,
                });
            let dataeliminar = { eliminado: true };
            for (let i = 0; i < detalles.length; i++) {
                let fila = detalles[i];
                await pb
                    .collection("detallemovimientos")
                    .update(fila.id, dataeliminar);
                let lote = fila.expand.lote;
                //Es decir este es el ultimo movimiento
                
                if (lote.detallemovimiento == fila.id) {
                    let antiingreso = ingreso == 0 ? -1 : 1;
                    let cantidaddetalle = fila.cantidad;
                    let cantidadlote = lote.cantidad;
                    let nuevacantidad =
                        cantidadlote + antiingreso * cantidaddetalle;
                    let loteupdate = {
                        detallemovimiento: "",
                        cantidad: nuevacantidad,
                    };
                    await pb.collection("lotes").update(lote.id, loteupdate);
                }
            }

            await pb.collection("movimientos").update(id, dataeliminar);
            await getData();
            volver();
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el movimiento`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el movimiento`,
                "error",
            );
        }
    }
    async function eliminarDetalle(p_id) {
        let idx_deta = detalles.findIndex((d) => d.id == p_id);
        if (idx_deta != -1) {
            let deta = detalles[idx_deta];
            let iddeta = deta.id;
            try {
                let lote = await pb.collection("lotes").getOne(deta.lote);

                let dataeliminar = { eliminado: true };
                if (lote) {
                    //Es decir este es el ultimo movimiento
                    if (lote.detallemovimiento == iddeta) {
                        let antiingreso = ingreso == 0 ? -1 : 1;
                        let cantidaddetalle = deta.cantidad;
                        let cantidadlote = lote.cantidad;
                        let nuevacantidad =
                            cantidadlote + antiingreso * cantidaddetalle;
                        let loteupdate = {
                            detallemovimiento: "",
                            cantidad: nuevacantidad,
                        };
                        await pb
                            .collection("lotes")
                            .update(lote.id, loteupdate);
                    }
                }

                await pb
                    .collection("detallemovimientos")
                    .update(iddeta, dataeliminar);

                await getData();
                if (detalles.length == 0) {
                    await pb.collection("movimientos").update(id, dataeliminar);
                }
                Swal.fire(
                    "Éxito eliminar",
                    `Se logró eliminar el detalle junto con el lote`,
                    "success",
                );
            } catch (err) {
                console.err(err);
                Swal.fire(
                    "Error eliminar",
                    `No se logró eliminar el detalle`,
                    "error",
                );
            }
        }
    }
    function confirmEliminarDetalle(p_id) {
        Swal.fire({
            title: "Eliminar detalle",
            text: "¿Seguro que deseas eliminar el detalle? Se va a eliminar el lote asociado",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminarDetalle(p_id);
            }
        });
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar movimiento",
            text: "¿Seguro que deseas eliminar el movimiento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar();
                
            }
        });
    }
    async function guardarMovimiento() {
        if (id.length > 0 && !add) {
            await editarMovimiento();
        }
    }
    async function editarMovimiento() {
        let data = {
            codigo,
            fecha: fecha + " 03:00:00",
            observacion,
        };
        try {
            let recordc = await pb.collection("movimientos").update(id, data);
            Swal.fire(
                "Éxito editar",
                `Se logró editar el movimiento`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error edición",
                `No se logró editar el movimiento`,
                "error",
            );
        } finally {
            volver();
        }
    }
    function volver() {
        goto("/movimientos");
    }
    function cerrarEditar() {
        edit = false;
    }
    function openEditar() {
        if (!edit) {
            edit = true;
            return;
        }
    }
    onMount(async () => {
        await getData();
    });
    function changeTab(p_tab) {
        tab = p_tab;
    }

    function quitarLote(p_id) {
        detalles = detalles.filter((d) => d.idfila != p_id);
    }

    function seleccionarProducto() {
        let idx_prod = productos.findIndex((p) => p.codigo == codigoproducto);

        if (idx_prod != -1) {
            let p = productos[idx_prod];
            nombreproducto = p.nombre;
            idproducto = p.id;
            malverificadoproducto = false;
            verificadoproducto = true;
        } else {
            verificadoproducto = false;
            malverificadoproducto = true;
        }
    }
    function agregarLoteProducto(p_cantidad) {
        if (unidad == "") {
            Swal.fire("Error producto", "Debe seleccionar una unidad", "error");
            return;
        }
        if (idproducto != "" && verificadoproducto && unidad != "") {
            let idx_prod = productos.findIndex((g) => g.id == idproducto);
            if (idx_prod != -1) {
                let p = productos[idx_prod];
                let idfila = makeid();
                let cantidadxgrupo = p_cantidad;
                let codigo = makecodigo(nombreproducto, 3, true);
                let fila = {
                    idfila,
                    nombre: nombreproducto,
                    codigo,
                    cantidad: cantidadxgrupo,
                    cantidadlote: 0,
                    producto: p.id,
                    unidad,
                    unidadnombre,
                    fechavencimiento:
                        fechavencimiento.length > 0
                            ? fechavencimiento + " 03:00:00"
                            : "",
                    fecha,
                    conlote: false,
                    lote: "",
                    nombrelote: "",
                };
                detalles.push(fila);
            }
        }
    }
    function limpiarNombreProducto() {
        idproducto = "";
        codigoproducto = "";
        nombreproducto = "";
        idunidad = "";
        nombreunidad = "";
        verificadoproducto = false;
        malverificadoproducto = false;
    }

    function seleccionarProductoParaLote(p_cantidad) {
        if (unidad == "") {
            Swal.fire("Error producto", "Debe seleccionar una unidad", "error");
            return;
        }

        if (producto != "") {
            let idx_prod = productos.findIndex((g) => g.id == producto);
            if (idx_prod != -1) {
                let p = productos[idx_prod];
                nombreproducto = p.nombre;
                let idfila = makeid();
                let cantidadxgrupo = p_cantidad;
                let codigo = makecodigo(nombreproducto, 3, true);
                let fila = {
                    idfila,
                    nombre: nombreproducto,
                    codigo,
                    cantidad: cantidadxgrupo,
                    cantidadlote: 0,
                    producto: p.id,
                    unidad,
                    unidadnombre,
                    fechavencimiento:
                        fechavencimiento.length > 0
                            ? fechavencimiento + " 03:00:00"
                            : "",
                    fecha,
                    conlote: false,
                    lote,
                    remito,
                    cliente,
                    nombrelote: "",
                };
                detalles.push(fila);
            }
        }
    }

    function selectCliente() {
        productosrows = productos.filter((p) => p.cliente == cliente);
        productosrows = productosrows.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        stockrows = stock.filter((s) => s.cliente == cliente);
    }

    function seleccionarLote(p_lote) {
        if (p_lote) {
            idlote = p_lote.id;
            idproducto = p_lote.producto;
            unidad = p_lote.unidad;
            cantidadlote = p_lote.cantidad;

            malverificadolote = false;
            verificadolote = true;
        } else {
            verificadolote = false;
            malverificadolote = true;
        }
    }
    function seleccionarLoteMovimiento(p_cantidad) {
        if (selectedLote != "") {
            let idx_lote = stock.findIndex((s) => s.id == selectedLote);

            if (idx_lote != -1) {
                let filastock = stock[idx_lote];
                let cantidadxgrupo = p_cantidad;
                let p = productos.find((pro) => pro.id == filastock.producto);
                if (!p) {
                    return;
                }

                nombreproducto = p.nombre;
                unidad = filastock.unidad;
                cantidadlote = filastock.cantidad;
                idlote = filastock.id;
                idproducto = p.producto;
                fechavencimiento = filastock.fechavencimiento;
                let idx_unidad = unidades.findIndex((u) => (u.id = unidad));
                if (idx_unidad != -1) {
                    unidadnombre = unidades[idx_unidad].nombre;
                }
                let idfila = makeid();

                let codigostock = filastock.codigo;
                let fila = {
                    idfila: idlote,
                    nombre: codigostock,
                    codigo: codigostock,
                    cantidad: cantidadxgrupo,
                    cantidadlote,
                    producto: p.id,
                    unidad,
                    unidadnombre,
                    fechavencimiento:
                        fechavencimiento.length > 0
                            ? fechavencimiento + " 03:00:00"
                            : "",
                    fecha,
                    conlote: true,
                    lote: idlote,
                    remito: filastock.remito,
                    cliente,
                    nombrelote: filastock.lote,
                };
                detalles.push(fila);
            }
        }
    }
    function agregarLoteEgreso(p_cantidad) {
        if (idlote != "" && verificadolote) {
            let idx_prod = productos.findIndex((p) => p.id == idproducto);

            let p = productos[idx_prod];

            let cantidadxgrupo = p_cantidad;
            let idx_unidad = unidades.findIndex((u) => (u.id = unidad));
            if (idx_unidad != -1) {
                unidadnombre = unidades[idx_unidad].nombre;
            }

            let fila = {
                idfila: idlote,
                nombre: codigolote,
                codigo: codigolote,
                cantidad: cantidadxgrupo,
                cantidadlote,
                producto: p.id,
                unidad,
                unidadnombre,
                fechavencimiento:
                    fechavencimiento.length > 0
                        ? fechavencimiento + " 03:00:00"
                        : "",
                fecha,
                conlote: true,
                lote: idlote,
                nombrelote: codigolote,
            };
            detalles.push(fila);
        }
    }

    function limpiarNombreLote() {
        idlote = "";
        codigolote = "";
    }

    async function procesar() {
        if (fecha.length == 0) {
            Swal.fire(
                "Sin fecha",
                "Debes elegir una fecha del movimiento",
                "error",
            );
            return;
        }
        let movimiento = {
            active: true,
            fecha: fecha + " 03:00:00",
            observacion,
            ingreso,
            codigo,
            precargado: false,
            remito:remitoMov
        };
        if (ingreso == 0) {
            try {
                let recordmov = await pb
                    .collection("movimientos")
                    .create(movimiento);
                for (let i = 0; i < detalles.length; i++) {
                    let fila = detalles[i];
                    let filalote = fila.lote;
                    let loteid = "";
                    if (!fila.conlote) {
                        let lotedata = {
                            cantidad: fila.cantidad,
                            producto: fila.producto,
                            unidad: fila.unidad,
                            codigo: fila.codigo,
                            active: true,
                            fechaingreso: fecha + " 03:00:00",
                            fechavencimiento: fila.fechavencimiento,
                            remito: fila.remito,
                            lote: fila.lote,
                            cliente: fila.cliente,
                        };
                        let recordlote = await pb
                            .collection("lotes")
                            .create(lotedata);
                        filalote = recordlote.id;
                        loteid = recordlote.id;
                    } else {
                        let lotedata = {
                            cantidad: cantidadlote + fila.cantidad,
                        };
                        let recordlote = await pb
                            .collection("lotes")
                            .update(fila.idfila, lotedata);
                        loteid = fila.idfila;
                    }

                    let detalle = {
                        movimiento: recordmov.id,
                        cantidad: fila.cantidad,
                        producto: fila.producto,
                        unidad: fila.unidad,
                        active: true,
                        lote: filalote,
                        cliente: fila.cliente,
                        remito:remitoMov
                        
                    };
                    if (fila.conlote) {
                        detalle.historial = cantidadlote;
                    }
                    let recorddetalle = await pb
                        .collection("detallemovimientos")
                        .create(detalle);
                    let datalotedetalle = {
                        detallemovimiento: recorddetalle.id,
                    };
                    await pb
                        .collection("lotes")
                        .update(loteid, datalotedetalle);
                }
                await getStocks();
                stockrows = stock.filter((s) => s.cliente == cliente);
                detalles = [];
                fecha = "";
                fechavencimiento = "";
                observacion = "";
                selectedLote = "";
                codigoproducto = "";
                idproducto = "";
                producto = "";
                idlote = "";
                Swal.fire(
                    "Éxito movimiento",
                    "Se logró guardar el movimiento",
                    "success",
                );
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error movimiento",
                    "Hubo un error en la creacion de movimientos",
                    "error",
                );
            }
        } else {
            try {
                let recordmov = await pb
                    .collection("movimientos")
                    .create(movimiento);
                for (let i = 0; i < detalles.length; i++) {
                    let fila = detalles[i];
                    let lotedata = {
                        cantidad: fila.cantidadlote - fila.cantidad,
                    };
                    if (lotedata.cantidad <= 0) {
                        lotedata.cerrado = 1;
                    }
                    let recordlote = await pb
                        .collection("lotes")
                        .update(fila.idfila, lotedata);
                    let detalle = {
                        movimiento: recordmov.id,
                        cantidad: fila.cantidad,
                        producto: fila.producto,
                        unidad: fila.unidad,
                        active: true,
                        lote: fila.idfila,
                        cliente: fila.cliente,
                        historial: fila.cantidadlote,
                        remito:remitoMov
                    };
                    let recorddetalle = await pb
                        .collection("detallemovimientos")
                        .create(detalle);
                    let datalotedetalle = {
                        detallemovimiento: recorddetalle.id,
                    };
                    await pb
                        .collection("lotes")
                        .update(fila.idfila, datalotedetalle);
                }
                await getStocks();
                stockrows = stock.filter((s) => s.cliente == cliente);
                detalles = [];
                selectedLote = "";
                codigoproducto = "";
                idproducto = "";
                producto = "";
                idlote = "";
                Swal.fire(
                    "Éxito movimiento",
                    "Se logró guardar el movimiento",
                    "success",
                );
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error movimiento",
                    "Hubo un error en la creacion de movimientos",
                    "error",
                );
            }
        }
    }
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    {#if cargado}
        <DetalleMovimiento {add} {ingreso} {cliente} {nuevoProducto}>
            <DatosBasicos
                bind:codigo
                bind:ingreso
                bind:fecha
                bind:observacion
                bind:detalles
                bind:edit
                bind:cliente
                bind:remito = {remitoMov}
                {clientes}
                {add}
                {id}
                {volver}
                {selectCliente}
            />
            {#if add}
                {#if ingreso == 0}
                    <div
                        class="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 pb-1"
                    >
                        {#each opciones as option}
                            <button
                                onclick={() => changeTab(option.id)}
                                class="hover:cursor-pointer px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap
                                {tab === option.id
                                    ? 'bg-transparent  text-red-900 dark:text-red-400  border-t-2 border-e-2 border-s-2 border-red-900 dark:border-red-400 shadow-sm'
                                    : 'text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}"
                            >
                                {option.nombre}
                            </button>
                        {/each}
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3">
                        <div>
                            {#if tab == "prod"}
                                <div class="flex flex-col gap-1 py-1">
                                    <SeleccionarProducto
                                        {clientes}
                                        bind:producto
                                        bind:cliente
                                        {productosrows}
                                        agregarLote={seleccionarProductoParaLote}
                                        {selectCliente}
                                        {unidades}
                                        bind:idunidad={unidad}
                                        bind:nombreunidad={unidadnombre}
                                        bind:fechavencimiento
                                        bind:lote
                                        bind:remito
                                    />
                                </div>
                            {:else}
                                <SeleccionarLote
                                    {ingreso}
                                    {stockrows}
                                    bind:selectedLote
                                    agregarLote={seleccionarLoteMovimiento}
                                />
                            {/if}
                        </div>
                        <div class="mt-1">
                            <ProcesarLotes
                                bind:lote={detalles}
                                {quitarLote}
                                {procesar}
                            />
                        </div>
                    </div>
                {:else}
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3">
                        <div>
                            <SeleccionarLote
                                {ingreso}
                                {stockrows}
                                bind:selectedLote
                                agregarLote={seleccionarLoteMovimiento}
                            />
                        </div>
                        <div class="mt-1">
                            <ProcesarEgreso
                                bind:lote={detalles}
                                {quitarLote}
                                {procesar}
                            />
                        </div>
                    </div>
                {/if}
            {:else}
                <div class="mt-1">
                    <TablaDetalles
                        bind:detalles
                        {productos}
                        {unidades}
                        quitarDetalle={confirmEliminarDetalle}
                    />
                </div>
            {/if}
            <Acciones
                bind:edit
                {add}
                {id}
                {volver}
                {openEditar}
                {cerrarEditar}
                guardar={guardarMovimiento}
                eliminar={openDelModal}
            />
        </DetalleMovimiento>
    {:else}
        <span class="loading loading-spinner loading-xl"></span>
    {/if}
</Navbar>
<dialog id="movimientoProducto" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo producto</h3>
        <NuevoProducto
            bind:nombre
            bind:codigo={codigoprod}
            {cliente}
            {clientes}
        />

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
