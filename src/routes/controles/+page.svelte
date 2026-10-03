<script>
    //import productos from "$lib/genericos/productos";
    import Navbar from "$lib/components/Navbar.svelte";

    import Swal from "sweetalert2";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";
    import Buscador from "$lib/components/controles/Buscador.svelte";
    import TablaControles from "$lib/components/controles/TablaControles.svelte";
    import ListaControles from "$lib/components/controles/ListaControles.svelte";
    import Cargando from "$lib/components/Cargando.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false);
    let cargadoListas = $state(false);
    //lista
    let usuarios = $state([]);
    let controles = $state([]);
    let controlesrows = $state([]);
    //filtros
    let buscar = $state("");
    let buscarcodigo = $state("");
    let responsable = $state("");
    let fechadesde = $state("");
    let fechahasta = $state("");
    let cliente = $state("");
    //listsa
    let clientes = $state([]);
    //detallcontrol
    let defaultcontrol = {
        id: "",
        fecha: "",
        producto: "",
        unidad: "",
        cantidad: 0,
        lote: "",
        responsable: "",
        cliente: "",
        edit: false,
    };
    let detallecontrol = $state(defaultcontrol);
    let storageControl = createStorageProxy("detallecontrol", defaultcontrol);
    function openNew() {
        storageControl.save(detallecontrol);
        goto("/controles/0");
    }
    function openNewMultiple() {
        goto("/controles/multiples");
    }
    function openEditModal(p_id) {
        let c_idx = controles.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = controles[c_idx];
            detallecontrol = {
                id: c.id,
                fecha: c.fecha.split(" ")[0],
                producto: c.producto,
                unidad: c.unidad,
                cantidad: c.cantidad,
                lote: c.lote,
                responsable: c.expand.responsable.correo || "",
                cliente: c.expand.producto.cliente || "",
                edit: true,
            };
            storageControl.save(detallecontrol);
            goto("/controles/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = controles.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = controles[c_idx];
            detallecontrol = {
                id: c.id,
                fecha: c.fecha.split(" ")[0],
                producto: c.producto,
                unidad: c.unidad,
                cantidad: c.cantidad,
                lote: c.lote,
                responsable: c.expand.responsable.correo || "",
                cliente: c.expand.producto.cliente || "",
                edit: false,
            };
            storageControl.save(detallecontrol);
            goto("/controles/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("controles").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el control`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el control`,
                "error",
            );
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar control",
            text: "¿Seguro que deseas eliminar el control?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el control con éxito",
                    "success",
                );
            }
        });
    }
    function limpiarFiltros() {
        buscar = "";
        buscarcodigo = "";
        responsable = "";
        fechadesde = "";
        fechahasta = "";
        cliente = "";
        filterUpdate();
    }
    function filterUpdate() {
        controlesrows = controles;
        if (buscar != "") {
            controlesrows = controlesrows.filter((t) =>
                t.expand
                    ? t.expand.producto
                        ? t.expand.producto.nombre
                              .toLocaleLowerCase()
                              .includes(buscar.toLocaleLowerCase())
                        : ""
                    : "",
            );
        }
        if (responsable != "") {
            controlesrows = controlesrows.filter(
                (l) => l.responsable == responsable,
            );
        }
        if (fechadesde != "") {
            controlesrows = controlesrows.filter(
                (l) => new Date(l.fecha) >= new Date(fechadesde),
            );
        }
        if (fechahasta != "") {
            controlesrows = controlesrows.filter(
                (l) => new Date(l.fecha) < new Date(fechahasta),
            );
        }
        if (cliente != "") {
            controlesrows = controlesrows.filter(
                (t) =>
                    t.expand &&
                    t.expand.producto &&
                    t.expand.producto.cliente == cliente,
            );
        }
    }
    async function getData() {
        const recordsc = await pb.collection("controles").getFullList({
            filter: `active = true`,
            expand: "producto,responsable,unidad",
            sort: "-fecha",
        });

        controles = recordsc.map((c) => ({ ...c }));
        cargado = true;
    }
    async function getListas() {
        usuarios = [];
        const recordsu = await pb.collection("users").getFullList({
            sort: "apellido",
        });

        usuarios = [{ id: "", nombre: "Todos" }].concat(
            recordsu.map((c) => ({ ...c })),
        );
        clientes = [];
        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active = true",
            sort: "nombre",
        });

        clientes = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        clientes = [{ id: "", nombre: "Todos" }].concat(
            clientes.map((c) => ({ ...c })),
        );
        cargadoListas = true;
    }
    onMount(async () => {
        await getData();
        await getListas();
        filterUpdate();
    });
</script>

<Navbar>
    {#if cargadoListas}
        <Buscador
            bind:buscar
            bind:buscarcodigo
            bind:fechadesde
            bind:fechahasta
            bind:responsable
            bind:cliente
            {filterUpdate}
            {limpiarFiltros}
            nuevo={openNew}
            {openNewMultiple}
            {usuarios}
            {clientes}
            data={controlesrows}
        />
    {:else}
        <Cargando />
    {/if}
    {#if cargado}
        <!--Tabla-->
        <div
            class={`
                hidden w-full  md:grid
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
                <TablaControles
                    {controlesrows}
                    {openDelModal}
                    {openViewModal}
                    {openEditModal}
                />
            </div>
        </div>
        <!--Celular-->
        <div
            class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <ListaControles
                {controlesrows}
                {openDelModal}
                {openViewModal}
                {openEditModal}
            />
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
