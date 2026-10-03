<script>
    import { onMount } from "svelte";

    import Buscador from "../productos/Buscador.svelte";

    import TablaProductos from "../productos/TablaProductos.svelte";
    import ListaProductos from "../productos/ListaProductos.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    let {
        productos = $bindable([]),
        pb = {},
        cliente = "",
        openProductoModal = () => {},
    } = $props();
    let buscadorRef = $state(null);
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
    let buscar = $state("");
    let buscarcodigo = $state("");
    let productosrows = $state();

    export function setFocus() {
        buscadorRef.setFocus();
    }
    export async function getData() {
        const recordsc = await pb.collection("productos").getFullList({
            filter: `active = true && cliente ='${cliente}'`,
        });

        productos = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );

        filterUpdate();
    }
    function filterUpdate() {
        productosrows = [];
        productosrows = productos;
        if (buscar != "") {
            productosrows = productosrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (buscarcodigo != "") {
            productosrows = productosrows.filter((t) =>
                t.codigo.includes(buscarcodigo),
            );
        }
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
    onMount(() => {
        //await getData();
        filterUpdate();
    });
</script>

<Buscador
    enclientes={true}
    bind:this={buscadorRef}
    bind:buscar
    bind:buscarcodigo
    {filterUpdate}
    nuevo={openProductoModal}
    data={productosrows}
/>
<!--Tabla-->
<div
    class={`
            hidden w-full md:grid
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
            concliente={false}
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
        concliente={false}
        {openDelModal}
        {openViewModal}
        {openEditModal}
    />
</div>
