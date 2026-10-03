<script>
    //import productos from "$lib/genericos/productos";
    import Navbar from "$lib/components/Navbar.svelte";
    import Buscador from "$lib/components/productos/Buscador.svelte";
    import TablaProductos from "$lib/components/productos/TablaProductos.svelte";
    import Swal from "sweetalert2";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";
    import ListaProductos from "$lib/components/productos/ListaProductos.svelte";
    import Cargando from "$lib/components/Cargando.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false);
    let cargadoListas = $state(false);
    //filtros
    let buscar = $state("");
    let buscarcodigo = $state("");
    let cliente = $state("");
    let clientes = $state([]);
    let productos = $state([]);
    let productosrows = $state([]);

    let defaultproducto = {
        id: "",
        nombre: "",
        codigo: "",
        cliente: "",
        edit: false,
    };
    let detalleproducto = $state(defaultproducto);
    let storageProducto = createStorageProxy(
        "detalleproducto",
        defaultproducto,
    );
    function openNew() {
        storageProducto.save(defaultproducto);
        goto("/productos/0");
    }
    function openEditModal(p_id) {
        let c_idx = productos.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = productos[c_idx];
            detalleproducto = {
                id: c.id,
                nombre: c.nombre,
                codigo: c.codigo,
                cliente: c.cliente,
                edit: true,
            };
            storageProducto.save(detalleproducto);
            goto("/productos/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = productos.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = productos[c_idx];
            detalleproducto = {
                id: c.id,
                nombre: c.nombre,
                codigo: c.codigo,
                cliente: c.cliente,
                edit: false,
            };
            storageProducto.save(detalleproducto);
            goto("/productos/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("productos").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el producto`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el producto`,
                "error",
            );
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar producto",
            text: "¿Seguro que deseas eliminar el producto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el producto con éxito",
                    "success",
                );
            }
        });
    }
    function limpiarFiltros() {
        buscar = "";
        buscarcodigo = "";
        cliente = "";
        filterUpdate();
    }
    function filterUpdate() {
        productosrows = productos;
        if (buscar != "") {
            productosrows = productosrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (cliente != "") {
            productosrows = productosrows.filter((t) => t.cliente == cliente);
        }
        if (buscarcodigo != "") {
            productosrows = productosrows.filter((t) =>
                t.codigo.includes(buscarcodigo),
            );
        }
    }
    async function getData() {
        const recordsc = await pb.collection("productos").getFullList({
            filter: `active = true`,
            expand: "cliente",
        });

        productos = recordsc
            .map((c) => ({ ...c }))
            .sort((a, b) =>
                a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                    ? -1
                    : 1,
            );
        cargado = true;
    }
    async function getListas() {
        clientes = [];
        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active=true",
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
            {limpiarFiltros}
            {filterUpdate}
            nuevo={openNew}
            bind:buscarcodigo
            bind:cliente
            {clientes}
            data={productosrows}
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
                <TablaProductos
                    {productosrows}
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
            <ListaProductos
                {productosrows}
                {openDelModal}
                {openViewModal}
                {openEditModal}
            />
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
