<script>
    //import clientes from "$lib/genericos/clientes";
    import Navbar from "$lib/components/Navbar.svelte";
    import Cargando from "$lib/components/Cargando.svelte";
    import Buscador from "$lib/components/clientes/Buscador.svelte";
    import TablaClientes from "$lib/components/clientes/TablaClientes.svelte";
    import Swal from "sweetalert2";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    import ListaClientes from "$lib/components/clientes/ListaClientes.svelte";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let cargado = $state(false);
    let buscar = $state("");
    let clientes = $state([]);
    let clientesrows = $state([]);

    function filterUpdate() {
        clientesrows = clientes;
        if (buscar != "") {
            clientesrows = clientesrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
    }
    let defaultcliente = {
        id: "",
        nombre: "",
        edit: false,
    };
    let detallecliente = $state(defaultcliente);
    let storageCliente = createStorageProxy("detallecliente", defaultcliente);
    function openNew() {
        storageCliente.save(defaultcliente);
        goto("/clientes/0");
    }
    function openEditModal(p_id) {
        let c_idx = clientes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = clientes[c_idx];
            detallecliente = {
                id: c.id,
                nombre: c.nombre,
                edit: true,
            };
            storageCliente.save(detallecliente);
            goto("/clientes/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = clientes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = clientes[c_idx];
            detallecliente = {
                id: c.id,
                nombre: c.nombre,
                edit: false,
            };
            storageCliente.save(detallecliente);
            goto("/clientes/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("clientes").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el cliente`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el cliente`,
                "error",
            );
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar cliente",
            text: "¿Seguro que deseas eliminar el cliente?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el cliente con éxito",
                    "success",
                );
            }
        });
    }
    async function getData() {
        const recordsc = await pb
            .collection("clienteslote")
            .getFullList({ sort: "nombre" });

        clientes = recordsc.map((c) => ({ ...c }));
        cargado = true;

        //clientes = []
    }
    onMount(async () => {
        await getData();
        filterUpdate();
    });
</script>

<Navbar>
    <Buscador bind:buscar {filterUpdate} nuevo={openNew} data={clientesrows} />
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
                <TablaClientes
                    {clientesrows}
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
            <ListaClientes
                {clientesrows}
                {openDelModal}
                {openViewModal}
                {openEditModal}
            />
        </div>
    {:else}
        <div
            class={`
            w-full justify-items-center 
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <Cargando />
        </div>
    {/if}
</Navbar>
