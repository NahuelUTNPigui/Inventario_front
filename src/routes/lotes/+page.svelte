<script>
    //import lotes from "$lib/genericos/lotes";
    import Cargando from "$lib/components/Cargando.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Buscador from "$lib/components/lotes/Buscador.svelte";
    import TablaLotes from "$lib/components/lotes/TablaLotes.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    import ListaLotes from "$lib/components/lotes/ListaLotes.svelte";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false);
    let cargadoListas = $state(false);
    //filtros
    let buscar = $state("");
    let cliente = $state("");
    let codigo = $state("");
    let estado = $state("open");
    let fechadesde = $state("");
    let fechahasta = $state("");
    let fechadesdevenc = $state("");
    let fechahastavenc = $state("");
    let remito = $state("");
    let lote = $state("");

    //listas
    let estados = [
        { id: "todos", nombre: "Todos" },
        { id: "open", nombre: "Abierto" },
        { id: "close", nombre: "Cerrado" },
    ];
    let clientes = $state([]);
    let lotes = $state([]);
    let lotesrows = $state();
    //storage
    let defaultlote = {
        id: "",
        codigo: "",
        cerrado: 0,
        producto: "",
        cantidad: "",
        unidad: "",
        vencimiento: "",
        ingreso: "",
        cierre: "",
        cliente: "",
        remito: "",
        lote: "",
        edit: false,
    };
    let detallelote = $state(defaultlote);
    let storageLote = createStorageProxy("detallelote", defaultlote);
    let defaultFiltros = {
        cliente:"",
        codigo:"",
        estado:"open",
        fechadesde:"",
        fechahasta:"",
        fechadesdevenc:"",
        fechahastavenc:"",
        remito:"",
        lote:""
    }
    let detalleFiltos = $state(defaultFiltros)
    let storageFiltro = createStorageProxy("lotesFiltros",defaultFiltros)
    //fin storage
    function limpiarFiltros() {
        buscar = "";
        cliente = "";
        codigo = "";
        estado = "open";
        fechadesde = "";
        fechahasta = "";
        fechadesdevenc = "";
        fechahastavenc = "";
        remito = "";
        lote = "";
        detalleFiltos  = defaultFiltros
        filterUpdate();
    }
    function filterUpdate() {
        detalleFiltos.cliente = cliente
        detalleFiltos.codigo = codigo
        detalleFiltos.estado = estado
        detalleFiltos.fechadesde = fechadesde
        detalleFiltos.fechahasta = fechahasta
        detalleFiltos.fechadesdevenc = fechadesdevenc
        detalleFiltos.fechahastavenc = fechahastavenc
        detalleFiltos.remito = remito
        detalleFiltos.lote = lote
        storageFiltro.save(detalleFiltos)
        lotesrows = lotes;
        if (buscar != "") {
            lotesrows = lotesrows.filter(
                (t) =>
                    t.expand &&
                    t.expand.producto &&
                    t.expand.producto.nombre
                        .toLocaleLowerCase()
                        .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (codigo != "") {
            lotesrows = lotesrows.filter((l) =>
                l.codigo.toLocaleLowerCase().includes(codigo),
            );
        }
        if (remito != "") {
            lotesrows = lotesrows.filter((l) =>
                l.remito.toLocaleLowerCase().includes(remito),
            );
        }
        if (lote != "") {
            lotesrows = lotesrows.filter((l) =>
                l.lote.toLocaleLowerCase().includes(lote),
            );
        }
        if (cliente != "") {
            lotesrows = lotesrows.filter((lt) => lt.cliente == cliente);
        }

        if (estado != "todos") {
            let filtro_estado = estado == "open" ? 0 : 1;
            lotesrows = lotesrows.filter((l) => l.cerrado == filtro_estado);
        }
        if (fechadesde != "") {
            lotesrows = lotesrows.filter(
                (l) => new Date(l.fechaingreso) >= new Date(fechadesde),
            );
        }
        if (fechahasta != "") {
            lotesrows = lotesrows.filter(
                (l) => new Date(l.fechaingreso) < new Date(fechahasta),
            );
        }
        if (fechadesdevenc != "") {
            lotesrows = lotesrows.filter(
                (l) => new Date(l.fechavencimiento) >= new Date(fechadesdevenc),
            );
        }
        if (fechahastavenc != "") {
            lotesrows = lotesrows.filter(
                (l) => new Date(l.fechavencimiento) < new Date(fechahastavenc),
            );
        }
    }
    function openNew() {
        storageLote.save(defaultlote);
        goto("/lotes/0");
    }
    function openEditModal(p_id) {
        let c_idx = lotes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = lotes[c_idx];
            detallelote = {
                id: c.id,
                codigo: c.codigo,
                cerrado: c.cerrado,
                producto: c.producto,
                cantidad: c.cantidad,
                unidad: c.unidad,
                remito: c.remito,
                lote: c.lote,
                cliente: c.expand ? c.expand.producto.cliente : "",
                vencimiento:
                    c.fechavencimiento.length > 0
                        ? c.fechavencimiento.split(" ")[0]
                        : "",
                ingreso:
                    c.fechaingreso.length > 0
                        ? c.fechaingreso.split(" ")[0]
                        : "",
                cierre:
                    c.fechacierre.length > 0 ? c.fechacierre.split(" ")[0] : "",
                edit: true,
            };

            storageLote.save(detallelote);
            goto("/lotes/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = lotes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = lotes[c_idx];
            detallelote = {
                id: c.id,
                codigo: c.codigo,
                cerrado: c.cerrado,
                producto: c.producto,
                cantidad: c.cantidad,
                unidad: c.unidad,
                remito: c.remito,
                lote: c.lote,
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
                    c.fechacierre.length > 0 ? c.fechacierre.split(" ")[0] : "",
                edit: false,
            };
            storageLote.save(detallelote);
            goto("/lotes/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("lotes").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire("Éxito eliminar", `Se logró eliminar el lote`, "success");
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el usuario`,
                "error",
            );
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar lote",
            text: "¿Seguro que deseas eliminar el lote?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el lote con éxito",
                    "success",
                );
            }
        });
    }
    function reiniciar() {
        filterUpdate();
    }
    async function ordenarPorVencimiento() {
        filterUpdate();
        lotesrows = lotesrows.filter(
            (item) => item.fechavencimiento.length > 0,
        );

        lotesrows = lotesrows.sort((a, b) => {
            if (
                a.fechavencimiento.length == 0 &&
                b.fechavencimiento.length == 0
            ) {
                return 0;
            } else if (a.fechavencimiento.length == 0) {
                return -1;
            } else if (b.fechavencimiento.length == 0) {
                return 1;
            } else {
                return a.fechavencimiento > b.fechavencimiento ? 1 : -1;
            }
        });
    }
    async function getData() {
        const recordsl = await pb.collection("lotes").getFullList({
            filter: `active = true`,
            expand: "producto,unidad",
            sort: "-fechaingreso",
        });

        lotes = recordsl.map((c) => ({ ...c }));
        cargado = true;
    }
    async function getListas() {
        clientes = [];
        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active = true",
            sort: "nombre",
        });
        cargadoListas = true;
        clientes = [{ id: "", nombre: "Todos" }].concat(
            recordsc.map((c) => ({ ...c })),
        );
    }
    onMount(async () => {
        detalleFiltos = storageFiltro.load()
        cliente = detalleFiltos.cliente  
        codigo = detalleFiltos.codigo  
        estado = detalleFiltos.estado  
        fechadesde = detalleFiltos.fechadesde  
        fechahasta = detalleFiltos.fechahasta  
        fechadesdevenc = detalleFiltos.fechadesdevenc  
        fechahastavenc = detalleFiltos.fechahastavenc  
        remito = detalleFiltos.remito  
        lote = detalleFiltos.lote  
        await getData();
        await getListas();
        filterUpdate();
    });
</script>

<Navbar>
    {#if cargadoListas}
        <Buscador
            bind:buscar
            {filterUpdate}
            {limpiarFiltros}
            nuevo={openNew}
            bind:cliente
            bind:codigo
            bind:estado
            bind:fechadesde
            bind:fechahasta
            bind:remito
            bind:lote
            bind:fechadesdevenc
            bind:fechahastavenc
            {clientes}
            {estados}
            data={lotesrows}
        />
    {/if}
    <div class={`container mx-auto py-1 max-w-7xl w-full `}>
        <div class="flex flex-wrap gap-2">
            <button
                class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                onclick={ordenarPorVencimiento}
            >
                Ordenar por vencimiento
            </button>
            <button
                class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                onclick={reiniciar}
            >
                Limpiar
            </button>
        </div>
    </div>
    {#if cargado}
        <!--Tabla-->
        <div
            class={`
                hidden w-full  xl:grid
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
                <TablaLotes
                    {lotesrows}
                    {openDelModal}
                    {openViewModal}
                    {openEditModal}
                />
            </div>
        </div>
        <div
            class={`
            xl:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <ListaLotes
                {lotesrows}
                {openDelModal}
                {openViewModal}
                {openEditModal}
            />
        </div>
    {:else}
        <div
            class={`
            
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <Cargando />
        </div>
    {/if}
</Navbar>
