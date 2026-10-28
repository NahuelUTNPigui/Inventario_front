<script>
    //import movimientos from "$lib/genericos/movimientos";
    import Navbar from "$lib/components/Navbar.svelte";
    import Buscador from "$lib/components/movimientos/Buscador.svelte";
    import TablaMovimientos from "$lib/components/movimientos/TablaMovimientos.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    import ListaMovimientos from "$lib/components/movimientos/ListaMovimientos.svelte";
    import Cargando from "$lib/components/Cargando.svelte";
    import { getDateCorrect } from "$lib/genericos/strings";
    import estilos from "$lib/estilos";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false);
    let cargadoListas = $state(false);
    //filtros

    let buscar = $state("");
    let clientes = $state([]);
    let tipos = [
        { id: "todos", nombre: "Todos" },
        { id: "0", nombre: "Ingreso" },
        { id: "1", nombre: "Egreso" },
    ];

    let cliente = $state("");
    let remito = $state("");
    let tipo = $state("todos");
    let fechadesde = $state("");
    let fechahasta = $state("");

    let movimientos = $state([]);
    let movimientosrows = $state([]);
    //storage
    let defaultmovimiento = {
        id: "",
        codigo: "",
        fecha: "",
        observacion: "",
        ingreso: 0,
        lote: "",
        edit: false,
        cliente: "",
        remito: "",
    };
    let detallemovimiento = $state(defaultmovimiento);
    let storageMovimiento = createStorageProxy(
        "detallemovimiento",
        defaultmovimiento,
    );
    let defaultFiltros = {
        cliente: "",
        tipo: "todos",
        fechadesde: "",
        fechahasta: "",
    };
    let detalleFiltos = $state(defaultFiltros);
    let storageFiltro = createStorageProxy("movimientoFiltros", defaultFiltros);
    //fin storage
    function limpiarFiltros() {
        buscar = "";
        cliente = "";
        tipo = "todos";
        fechadesde = "";
        fechahasta = "";
        detalleFiltos = defaultFiltros;
        storageFiltro.save(detalleFiltos);
        filterUpdate();
    }
    function filterUpdate() {
        detalleFiltos.cliente = cliente;
        detalleFiltos.tipo = tipo;
        detalleFiltos.fechadesde = fechadesde;
        detalleFiltos.fechahasta = fechahasta;
        storageFiltro.save(detalleFiltos);
        movimientosrows = movimientos;
        if (buscar != "") {
            movimientosrows = movimientosrows.filter(
                (t) =>
                    t.expand &&
                    t.expand.producto &&
                    t.expand.producto.nombre
                        .toLocaleLowerCase()
                        .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (remito != "") {
            movimientosrows = movimientosrows.filter((mov) =>
                mov.remito.includes(remito),
            );
        }
        if (fechadesde != "") {
            movimientosrows = movimientosrows.filter(
                (l) =>
                    new Date(l.expand.movimiento.fecha) >= new Date(fechadesde),
            );
        }
        if (fechahasta != "") {
            movimientosrows = movimientosrows.filter(
                (l) =>
                    new Date(l.expand.movimiento.fecha) < new Date(fechahasta),
            );
        }
        if (cliente != "") {
            movimientosrows = movimientosrows.filter(
                (l) => l.expand.producto.cliente == cliente,
            );
        }
        if (tipo != "todos") {
            movimientosrows = movimientosrows.filter(
                (l) => l.expand.movimiento.ingreso == tipo,
            );
        }
    }
    function openNew() {
        storageMovimiento.save(defaultmovimiento);
        goto("/movimientos/0");
    }
    function openEgresoModal(d_id) {
        let d_idx = movimientos.findIndex((u) => u.id == d_id);

        if (d_idx != -1) {
            let m = movimientos[d_idx];
            iddetalle = d_id;
            idlotedetalle = m.lote;
            productodetalle = m.expand.producto.nombre;
            pendientedetalle = m.pendiente;
            pendientelote = m.expand.lote.pendiente;
            cantidaddetalle = m.cantidad;
            cantidadlote = m.expand.lote.cantidad;
            fechaegreso = m.expand.movimiento.fecha;
            egresomov.showModal()
        }
    }
    function openEditModal(p_id) {
        let c_idx = movimientos.findIndex((u) => u.movimiento == p_id);

        if (c_idx != -1) {
            let m = movimientos[c_idx];
            let c = m.expand.movimiento;
            detallemovimiento = {
                id: c.id,
                codigo: c.codigo,
                fecha: c.fecha.length > 0 ? c.fecha.split(" ")[0] : "",
                observacion: c.observacion,
                ingreso: c.ingreso,
                remito: m.remito,
                edit: true,
            };
            storageMovimiento.save(detallemovimiento);
            goto("/movimientos/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = movimientos.findIndex((u) => u.movimiento == p_id);

        if (c_idx != -1) {
            let m = movimientos[c_idx];
            let c = m.expand.movimiento;
            detallemovimiento = {
                id: c.id,
                codigo: c.codigo,
                fecha: c.fecha.length > 0 ? c.fecha.split(" ")[0] : "",
                observacion: c.observacion,
                ingreso: c.ingreso,
                remito: m.remito,
                edit: false,
            };
            storageMovimiento.save(detallemovimiento);
            goto("/movimientos/" + c.id);
        }
    }
    //Deberia eliminar los detalles
    // NO esta activo todavía. Porque no esta claro si se elimina el movimiento o el detalle
    async function eliminar(p_id) {
        try {
            let detalles = await pb
                .collection("detallemovimientos")
                .getFullList({
                    filter: `movimiento='${p_id}'`,
                });
            let dataeliminado = { eliminado: true };
            for (let i = 0; i < detalles.length; i++) {
                let fila = detalles[i];
                await pb
                    .collection("detallemovimientos")
                    .update(fila.id, dataeliminado);
            }
            await pb.collection("movimientos").update(p_id, dataeliminado);
            await getData();
            filterUpdate();
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
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar movimiento",
            text: "¿Seguro que deseas eliminar el movimiento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
            }
        });
    }
    async function getData() {
        const recordsm = await pb.collection("detallemovimientos").getFullList({
            expand: "movimiento,producto,lote",
            filter: `movimiento.active = true && eliminado=false`,
            sort: "-movimiento.fecha",
        });

        movimientos = recordsm.map((c) => ({ ...c }));
        cargado = true;
    }
    async function getListas() {
        clientes = [];
        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active = true",
            sort: "nombre",
        });

        clientes = [{ id: "", nombre: "Todos" }].concat(
            recordsc.map((c) => ({ ...c })),
        );
        cargadoListas = true;
    }
    onMount(async () => {
        detalleFiltos = storageFiltro.load();
        cliente = detalleFiltos.cliente;
        tipo = detalleFiltos.tipo;
        fechadesde = detalleFiltos.fechadesde;
        fechahasta = detalleFiltos.fechahasta;
        await getListas();
        await getData();
        filterUpdate();
    });
    //edicion
    let iddetalle = $state("");
    let idlotedetalle = $state("");
    let fechaegreso = $state("");
    let productodetalle = $state("");
    let cantidaddetalle = $state(0);
    let pendientedetalle = $state(0);
    let cantidadlote = $state(0);
    let pendientelote = $state(0);
    async function crearEgreso() {
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
            Swal.fire("Éxito egreso", "Se logró crear el egreso", "success");
            await getData()
            filterUpdate()
        } catch (err) {
            Swal.fire("Error egreso", "No se logró crear el egreso", "error");
        }
    }
</script>

<Navbar>
    {#if cargadoListas}
        <Buscador
            bind:buscar
            {filterUpdate}
            nuevo={openNew}
            {limpiarFiltros}
            bind:fechadesde
            bind:fechahasta
            bind:tipo
            bind:cliente
            bind:remito
            {clientes}
            {tipos}
            data={movimientosrows}
        />
    {:else}
        <Cargando />
    {/if}
    {#if cargado}
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
                <TablaMovimientos
                    {movimientosrows}
                    {openDelModal}
                    {openViewModal}
                    {openEditModal}
                    {openEgresoModal}
                />
            </div>
        </div>
        <div
            class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <ListaMovimientos
                {movimientosrows}
                {openDelModal}
                {openViewModal}
                {openEditModal}
                {openEgresoModal}
            />
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
<dialog id="egresomov" class="modal">
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
                        Fecha movimiento</span
                    >
                </label>
                <label
                    for="ingreso"
                    class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
                >
                    {getDateCorrect(fechaegreso)}
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
                        Cantidad: {cantidaddetalle}</span
                    >
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
                        Pendiente: {pendientedetalle}</span
                    >
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
                    onclick={crearEgreso}
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    >Crear Egreso</button
                >
            </form>
        </div>
    </div>
</dialog>
