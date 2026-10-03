<script>
    //import grupos from "$lib/genericos/grupos";
    import Navbar from "$lib/components/Navbar.svelte";
    import Buscador from "$lib/components/agrupamiento/Buscador.svelte";
    import TablaGrupos from "$lib/components/agrupamiento/TablaGrupos.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";
    import ListaGrupos from "$lib/components/agrupamiento/ListaGrupos.svelte";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let buscar = $state("");
    let grupos = $state([]);
    let gruposrows = $state([]);
    let defaultgrupo = {
        id: "",
        nombre: "",
        codigo: "",
        unidad: "",
        cliente: "",
        producto: "",
        cantidad: "",
        edit: false,
    };
    let detallegrupo = $state(defaultgrupo);
    let storageGrupo = createStorageProxy("detallegrupo", defaultgrupo);
    function filterUpdate() {
        gruposrows = grupos;
        if (buscar != "") {
            gruposrows = gruposrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
    }
    function openNew() {
        storageGrupo.save(defaultgrupo);
        goto("/agrupamientos/0");
    }
    function openEditModal(p_id) {
        let c_idx = grupos.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = grupos[c_idx];
            detallegrupo = {
                id: c.id,
                nombre: c.nombre,
                codigo: c.codigo,
                cliente: c.cliente,
                unidad: c.unidad,
                producto: c.producto,
                cantidad: c.cantidad,
                edit: true,
            };
            storageGrupo.save(detallegrupo);
            goto("/agrupamientos/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = grupos.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = grupos[c_idx];
            detallegrupo = {
                id: c.id,
                nombre: c.nombre,
                codigo: c.codigo,
                cliente: c.cliente,
                producto: c.producto,
                unidad: c.unidad,
                cantidad: c.cantidad,
                edit: false,
            };
            storageGrupo.save(detallegrupo);
            goto("/agrupamientos/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let c_idx = grupos.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let data = {
                active: false,
            };
            try {
                await pb.collection("grupos").update(p_id, data);
                await getData();
                filterUpdate();
                Swal.fire(
                    "Éxito eliminar",
                    `Se logró eliminar el grupo`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error eliminar",
                    `No se logró eliminar el grupo`,
                    "error",
                );
            }
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar grupo",
            text: "¿Seguro que deseas eliminar el grupo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el grupo con éxito",
                    "success",
                );
            }
        });
    }
    async function getData() {
        //OJo con este full list
        const recordsc = await pb.collection("grupos").getFullList({
            filter: `active = true`,
            expand: "producto,unidad",
        });

        grupos = recordsc.map((c) => ({ ...c }));
    }
    onMount(async () => {
        await getData();
        filterUpdate();
    });
</script>

<Navbar>
    <Buscador bind:buscar {filterUpdate} nuevo={openNew} />
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
            <TablaGrupos
                {gruposrows}
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
        <ListaGrupos
            {gruposrows}
            {openDelModal}
            {openViewModal}
            {openEditModal}
        />
    </div>
</Navbar>
