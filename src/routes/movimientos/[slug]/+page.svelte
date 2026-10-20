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
    import {
        makecodigo,
        makeid,
        makenumber,
        randomString,
    } from "$lib/genericos/strings";
    import Swal from "sweetalert2";
    import ScannerLote from "$lib/components/movimientos/ScannerLote.svelte";
    import AgregarLote from "$lib/components/movimientos/AgregarLote.svelte";
    import ProcesarEgreso from "$lib/components/movimientos/ProcesarEgreso.svelte";
    import TablaDetalles from "$lib/components/movimientos/TablaDetalles.svelte";
    import SeleccionarProducto from "$lib/components/movimientos/SeleccionarProducto.svelte";
    import SeleccionarLote from "$lib/components/movimientos/SeleccionarLote.svelte";
    import NuevoProducto from "$lib/components/NuevoProducto.svelte";
    import estilos from "$lib/estilos";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    //storage
    let defaultmovimiento = {
        id: "",
        codigo: "",
        fecha: "",
        observacion: "",
        ingreso: 0,
        lote: "",
        edit: false,
        remito: "",
        cliente: "",
    };
    let detallemovimiento = $state(defaultmovimiento);
    let storageMovimiento = createStorageProxy(
        "detallemovimiento",
        defaultmovimiento,
    );
    let defaultcierre = {
        cerrarLotes: false,
    };
    let detallecierre = $state(defaultcierre);
    let storagecierre = createStorageProxy("detallecierre", defaultcierre);
    //fin storage
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
    let pendientelote = $state(0);
    let cantidadlotenegativa = $derived(cantidadlote < 0);
    //lote individuaal
    let producto = $state("");
    let remito = $state("");
    let lote = $state("");
    let codigostock = $state("");
    let selectedLote = $state("");
    function onSelectProducto() {
        if (producto != "") {
            let idx = productosrows.findIndex((p) => p.id == producto);
            if (idx != -1) {
                let p = productosrows[idx];
                codigostock = p.codigo;
            }
        }
    }
    //Feedback
    let malverificadogrupo = $state(false);
    let malverificadoproducto = $state(false);
    let malverificadolote = $state(false);
    let verificadogrupo = $state(false);
    let verificadoproducto = $state(false);
    let verificadolote = $state(false);
    let procesando = $state(false);
    //Data
    let id = $state("");
    let codigo = $state("");
    let cerrarLotes = $state(false);
    let observacion = $state("");
    let fecha = $state("");
    let ingreso = $state(0);
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);
    let remitoMov = $state("");
    // editar
    let remitoViejo = $state("");
    let cambioRemito = $derived(remitoMov != remitoViejo);
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
                expand: "lote,producto",
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
            expand: "producto",
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
        remitoMov = detallemovimiento.remito;
        remitoViejo = detallemovimiento.remito;

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
                    let pendientedetalle = fila.pendiente;
                    let cantidadlote = lote.cantidad;
                    let pendientelote = lote.pendiente;
                    let nuevacantidad =
                        cantidadlote + antiingreso * cantidaddetalle;
                    let nuevopendiente =
                        pendientelote + antiingreso * pendientedetalle;
                    let loteupdate = {
                        detallemovimiento: "",
                        cantidad: nuevacantidad,
                        pendiente: pendientedetalle,
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
                        let pendientedetalle = deta.pendiente;
                        let pendientelote = lote.pendiente;
                        let nuevacantidad =
                            cantidadlote + antiingreso * cantidaddetalle;
                        let nuevopendiente =
                            pendientelote + antiingreso * pendientedetalle;
                        let loteupdate = {
                            detallemovimiento: "",
                            cantidad: nuevacantidad,
                            pendiente: nuevopendiente,
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
            text: "¿Seguro que deseas eliminar el detalle?",
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
    function onChangeCierre() {
        detallecierre.cerrarLotes = cerrarLotes;
        storagecierre.save(detallecierre);
    }
    onMount(async () => {
        detallecierre = storagecierre.load();
        cerrarLotes = detallecierre.cerrarLotes;
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
                let pendiente = p_pendiente;
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
                    pendiente,
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
        if (p_cantidad < 0) {
            Swal.fire(
                "Cantidad negativa",
                "La cantidad no puede ser negativa",
                "error",
            );
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
                    nombrelote: lote,
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
        if (cantidadlotenegativa) {
            Swal.fire(
                "Cantidad negativa",
                "La cantidad no puede ser negativa",
                "error",
            );
            return;
        }
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
    function seleccionarLoteMovimiento(p_cantidad, p_pendiente = 0) {
        if (p_cantidad < 0) {
            Swal.fire(
                "Cantidad negativa",
                "La cantidad no puede ser negativa",
                "error",
            );
            return;
        }
        if (selectedLote != "") {
            let idx_lote = stock.findIndex((s) => s.id == selectedLote);

            if (idx_lote != -1) {
                let filastock = stock[idx_lote];
                let cantidadxgrupo = p_cantidad;
                let pendientedetalle = p_pendiente;
                let p = productos.find((pro) => pro.id == filastock.producto);
                if (!p) {
                    return;
                }

                nombreproducto = p.nombre;
                unidad = filastock.unidad;
                cantidadlote = filastock.cantidad;
                pendientelote = filastock.pendiente;
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
                    pendientelote,
                    pendiente: pendientedetalle,
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
    function onInputRemito() {
        remito = remitoMov;
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
        procesando = true;

        let movimiento = {
            active: true,
            fecha: fecha + " 03:00:00",
            observacion,
            ingreso,
            codigo,
            precargado: false,
            remito: remitoMov,
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
                        let pidx = productos.findIndex(
                            (p) => p.id == fila.producto,
                        );

                        let fecha_hoy = new Date();
                        let dia = fecha_hoy.getDate();
                        let mes = fecha_hoy.getMonth() + 1;
                        let año = fecha_hoy.getFullYear();
                        let datecodigo = dia + "_" + mes + "_" + año + "-";
                        let codigolote = `${productos[pidx].codigo} ${fila.lote.length > 0 ? " - " + fila.lote : ""}${fila.remito.length > 0 ? " - " + fila.remito : ""} ${datecodigo + " - " + makenumber(4)}`;
                        let lotedata = {
                            cantidad: fila.cantidad,
                            producto: fila.producto,
                            unidad: fila.unidad,
                            codigo: codigolote,
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
                            cantidad: fila.cantidadlote + fila.cantidad,
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
                        remito: remitoMov,
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
            } finally {
                procesando = false;
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
                        pendiente: fila.pendientelote + fila.pendiente,
                    };
                    if (lotedata.cantidad <= 0 && cerrarLotes) {
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
                        remito: remitoMov,
                        pendiente: fila.pendiente,
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
            } finally {
                procesando = false;
            }
        }
    }

    //edicion
    let iddetalle = $state("");
    let iddetallelote = $state("");
    let desingreso = $derived(ingreso == 1 ? 0 : 1);
    let unidaddetalle = $state("");
    let productodetalle = $state("");
    let cantidaddetallelote = $state(0);
    let pendientedetallelote = $state(0);
    let cantidaddetalle = $state(0);
    let pendientedetalle = $state(0);
    let cantidaddetalleviejo = $state(0);
    let pendientedetalleviejo = $state(0);
    let cantidadcambiada = $derived(
        cantidaddetalleviejo != cantidaddetalle ||
            pendientedetalleviejo != pendientedetalle,
    );
    async function editarMovimiento() {
        let data = {
            codigo,
            fecha: fecha + " 03:00:00",
            observacion,
            remito: remitoMov,
        };

        try {
            let recordc = await pb.collection("movimientos").update(id, data);
            if (cambioRemito) {
                let datadeta = {
                    remito: remitoMov,
                };
                for (let i = 0; i < detalles.length; i++) {
                    let fila = detalles[i];

                    await pb
                        .collection("detallemovimientos")
                        .update(fila.id, datadeta);
                }
            }
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

    function openEdicionDetalle(p_detalle) {
        iddetalle = p_detalle.id;
        unidaddetalle = p_detalle.unidad;
        cantidaddetalle = p_detalle.cantidad;
        pendientedetalle = p_detalle.pendiente;
        pendientedetalleviejo = p_detalle.pendiente;
        cantidaddetalleviejo = p_detalle.cantidad;
        productodetalle = p_detalle.expand.producto.nombre;
        cantidaddetallelote = p_detalle.expand.lote.cantidad;
        pendientedetallelote = p_detalle.expand.lote.pendiente;
        iddetallelote = p_detalle.lote;
        detallemov.showModal();
    }

    async function editarDetalle() {
        if (cantidadcambiada) {
            let antiingreso = ingreso == 0 ? -1 : 1;
            let datastock = {
                cantidad:
                    cantidaddetallelote +
                    antiingreso * (cantidaddetalleviejo - cantidaddetalle),
                pendiente:
                    pendientedetallelote +
                    antiingreso * (pendientedetalleviejo - pendientedetalle),
            };
            let datadetalle = {
                unidad: unidaddetalle,
                cantidad: cantidaddetalle,
                pendiente: pendientedetalle,
            };

            try {
                let lote = await pb.collection("lotes").getOne(iddetallelote);

                if (lote) {
                    //Es decir este es el ultimo movimiento
                    if (lote.detallemovimiento == iddetalle) {
                        await pb
                            .collection("detallemovimientos")
                            .update(iddetalle, datadetalle);
                        await pb
                            .collection("lotes")
                            .update(iddetallelote, datastock);
                        await getDetalles();
                        Swal.fire(
                            "Éxito edición",
                            "Se logró editar el detalle",
                            "success",
                        );
                    } else {
                        Swal.fire(
                            "Error edición",
                            "Solo se puede editar la cantidad del último movimiento",
                            "error",
                        );
                        return;
                    }
                }
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error edición",
                    "No se logró editar el datalle",
                    "error",
                );
            }
        } else {
            let data = {
                unidad: unidaddetalle,
            };
            try {
                await pb
                    .collection("detallemovimientos")
                    .update(iddetalle, data);

                Swal.fire(
                    "Éxito edición",
                    "Se logró editar el detalle",
                    "success",
                );
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error edición",
                    "No se logró editar el datalle",
                    "error",
                );
            }
        }
    }
    async function confirmEgreso(p_id) {
        Swal.fire({
            title: "Crear egreso",
            text: "¿Seguro que deseas crear el egreso?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await crearEgreso(p_id);
            }
        });
    }
    async function crearEgreso(d_id) {
        let d_idx = detalles.findIndex((deta) => deta.id == d_id);
        if (d_idx != -1) {
            let deta = detalles[d_idx];
            let cantidadlote = deta.expand.lote.cantidad;
            let pendientelote = deta.expand.lote.pendiente;
            let cantidaddetalle = deta.cantidad;
            let pendientedetalle = deta.pendiente;
            let iddetalle = deta.id;
            let idlotedetalle = deta.lote;
            let datalote = {
                cantidad: cantidadlote - pendientedetalle,
                pendiente: pendientelote - pendientedetalle,
            };
            let datadetalle = {
                pendiente: 0,
                cantidad: cantidaddetalle + pendientedetalle,
            };
            try {
                await pb
                    .collection("detallemovimientos")
                    .update(iddetalle, datadetalle);
                await pb.collection("lotes").update(idlotedetalle, datalote);
                Swal.fire(
                    "Éxito egreso",
                    "Se logró crear el egreso",
                    "success",
                );
                await getData();
                
            } catch (err) {
                
                Swal.fire(
                    "Error egreso",
                    "No se logró crear el egreso",
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
                bind:cerrarLotes
                bind:remito={remitoMov}
                {clientes}
                {add}
                {id}
                {volver}
                {selectCliente}
                {onChangeCierre}
                {onInputRemito}
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
                                        ingreso={fecha}
                                    />
                                </div>
                            {:else}
                                <SeleccionarLote
                                    {ingreso}
                                    {stockrows}
                                    {productosrows}
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
                                {procesando}
                            />
                        </div>
                    </div>
                {:else}
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3">
                        <div>
                            <SeleccionarLote
                                {ingreso}
                                {stockrows}
                                {productosrows}
                                bind:selectedLote
                                agregarLote={seleccionarLoteMovimiento}
                            />
                        </div>
                        <div class="mt-1">
                            <ProcesarEgreso
                                bind:lote={detalles}
                                {quitarLote}
                                {procesar}
                                {procesando}
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
                        openDetalle={openEdicionDetalle}
                        crearEgreso={confirmEgreso}
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
<dialog id="detallemov" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Editar detalle</h3>
        <div class="grid grid-cols-1 gap-1 lg:gap-6 mx-1 mb-2">
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="productodetalle" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Producto :{productodetalle}</span
                    >
                </label>
            </div>
            <div class="mb-1 lg:mb-0 flex flex-col">
                <label for="unidaddetalle" class="label mb-0 pb-0">
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
                    bind:value={unidaddetalle}
                >
                    {#each unidades as s}
                        <option value={s.id}>{s.nombre}</option>
                    {/each}
                </select>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="cantidaddetalle" class="label mb-0 pb-0">
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
                        id="cantidaddetalle"
                        type="number"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={cantidaddetalle}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="cantidaddetalle" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Pendiente</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="cantidaddetalle"
                        type="number"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={pendientedetalle}
                    />
                </label>
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    >Cerrar</button
                >
                <button
                    onclick={editarDetalle}
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    >Editar</button
                >
            </form>
        </div>
    </div>
</dialog>
