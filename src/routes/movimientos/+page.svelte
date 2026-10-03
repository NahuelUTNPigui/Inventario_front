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

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false)
    let cargadoListas = $state(false)
    //filtros

    let buscar = $state("");
    let clientes = $state([]);
    let  tipos = [
        { id: "todos", nombre: "Todos" },
        { id: "0", nombre: "Ingreso" },
        { id: "1", nombre: "Egreso" },
    ];
     
    let cliente = $state("");
    let tipo = $state("todos")
    let fechadesde = $state("");
    let fechahasta = $state(""); 
    
    
    let movimientos = $state([]);
    let movimientosrows = $state([]);
    let defaultmovimiento = {
        id: "",
        codigo: "",
        fecha: "",
        observacion: "",
        ingreso: 0,
        lote:"",
        edit: false,
        cliente:""
    };
    let detallemovimiento = $state(defaultmovimiento);
    let storageMovimiento = createStorageProxy(
        "detallemovimiento",
        defaultmovimiento,
    );
    function limpiarFiltros(){
        buscar = ""
        cliente = ""
        tipo = "todos"
        fechadesde = ""
        fechahasta = ""
        filterUpdate()
    }
    function filterUpdate() {
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
        if (fechadesde != "") {

            movimientosrows =movimientosrows.filter((l) =>
                new Date(l.expand.movimiento.fecha) >= new Date(fechadesde)
            );
        }
        if (fechahasta != "") {
            movimientosrows =movimientosrows.filter((l) =>
                new Date(l.expand.movimiento.fecha) < new Date(fechahasta)
            );
        }
        if (cliente != "") {
            movimientosrows =movimientosrows.filter((l) =>
                l.expand.producto.cliente == cliente
            );
        }
        if (tipo != "todos") {
            movimientosrows =movimientosrows.filter((l) =>
                l.expand.movimiento.ingreso == tipo
            );
        }
    }
    function openNew() {
        storageMovimiento.save(defaultmovimiento);
        goto("/movimientos/0");
    }
    function openEditModal(p_id) {
        
        let c_idx = movimientos.findIndex((u) => u.movimiento == p_id);
        
        if (c_idx != -1) {
            let m = movimientos[c_idx];
            let c = m.expand.movimiento
            detallemovimiento = {
                id: c.id,
                codigo: c.codigo,
                fecha: c.fecha.length > 0 ? c.fecha.split(" ")[0] : "",
                observacion: c.observacion,
                ingreso: c.ingreso,
                edit: true
            };
            storageMovimiento.save(detallemovimiento);
            goto("/movimientos/" + c.id);
        }
    }
    function openViewModal(p_id) {
        
        
        let c_idx = movimientos.findIndex((u) => u.movimiento == p_id);
        
        if (c_idx != -1) {
            let m = movimientos[c_idx];
            let c = m.expand.movimiento
            detallemovimiento = {
                id: c.id,
                codigo: c.codigo,
                fecha: c.fecha.length > 0 ? c.fecha.split(" ")[0] : "",
                observacion: c.observacion,
                ingreso: c.ingreso,
                edit: false
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
            let dataeliminado = {eliminado:true}
            for (let i = 0; i < detalles.length; i++) {
                let fila = detalles[i];
                await pb.collection("detallemovimientos").update(fila.id,dataeliminado);
            }
            await pb.collection("movimientos").update(p_id,dataeliminado);
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
            expand:"movimiento,producto,lote",
            filter: `movimiento.active = true && eliminado=false`,
            sort:"-movimiento.fecha"
        });

        movimientos = recordsm.map((c) => ({ ...c }));
        cargado = true
    }
    async function getListas() {
        clientes = [];
        const recordsc = await pb.collection("clientes").getFullList({
            filter:"active = true",
            sort:"nombre"
        });

        clientes = [{ id: "", nombre: "Todos" }].concat(
            recordsc.map((c) => ({ ...c })),
        );
        cargadoListas = true
    }
    onMount(async () => {
        await getListas()
        await getData();
        filterUpdate();
    });
</script>

<Navbar>
{#if cargadoListas}
    <Buscador 
        bind:buscar {filterUpdate} nuevo={openNew} 
        {limpiarFiltros}
        bind:fechadesde
        bind:fechahasta
        bind:tipo
        bind:cliente
        {clientes}
        {tipos}
    />
    {:else}
    <Cargando/>
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
        />
    </div>
    {:else}
        <Cargando/>
    {/if}
</Navbar>
