<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import DetalleGrupo from "$lib/components/grupos/DetalleGrupo.svelte";
    import SelectTabs from "$lib/components/SelectTabs.svelte";
    import HorizontalTabs from "$lib/components/HorizontalTabs.svelte";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import DatosBasicos from "$lib/components/grupos/DatosBasicos.svelte";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    let defaultgrupo = {
        id: "",
        nombre: "",
        codigo: "",
        unidad: "",
        producto: "",
        cliente: "",
        cantidad: "",
        edit: false,
    };
    let detallegrupo = $state(defaultgrupo);
    let storageGrupo = createStorageProxy("detallegrupo", defaultgrupo);
    //Data
    let clientes = $state([]);
    let productos = $state([]);
    let unidades = $state([]);
    let id = $state("");
    let nombre = $state("");
    let codigo = $state("");
    let cliente = $state("");
    let unidad = $state("");
    let producto = $state("");
    let cantidad = $state("");
    let edit = $state(false);
    let add = $state(false);
    async function getData() {
        detallegrupo = storageGrupo.load();
        id = detallegrupo.id;
        nombre = detallegrupo.nombre;
        codigo = detallegrupo.codigo;
        producto = detallegrupo.producto;
        unidad = detallegrupo.unidad;
        cliente = detallegrupo.cliente;
        cantidad = detallegrupo.cantidad;
        edit = detallegrupo.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
        }
        const recordsc = await pb.collection("clientes").getFullList({});
        clientes = recordsc.map((c) => ({ ...c }));
        const recordsp = await pb.collection("productos").getFullList({});

        productos = recordsp.map((c) => ({ ...c }));
        const recordsu = await pb.collection("unidades").getFullList({});

        unidades = recordsu.map((c) => ({ ...c }));
    }
    function volver() {
        goto("/agrupamientos");
    }
    async function editarGrupo() {
        let data = {
            nombre,
            unidad,
            codigo,
            producto,
            cantidad,
        };
        try {
            let recordc = await pb.collection("grupos").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el grupo`, "success");
        } catch (err) {
            Swal.fire("Error edición", `No se logró editar el grupo`, "error");
        } finally {
            volver();
        }
    }
    async function guardarGrupo() {
        if (id != "0 " && !add) {
            await editarGrupo();
        } else {
            let data = {
                nombre,
                unidad,
                codigo,
                producto,
                cantidad,
                active: true,
            };
            try {
                let recordc = await pb.collection("grupos").create(data);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el grupo`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el grupo`,
                    "error",
                );
            } finally {
                volver();
            }
        }
    }
    async function eliminar() {
        let data = {
            active: false,
        };

        try {
            let recordc = await pb.collection("grupos").update(id, data);
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el grupo`,
                "success",
            );
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el grupo`,
                "error",
            );
        }
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar grupo",
            text: "¿Seguro que deseas eliminar el grupo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el grupo con éxito",
                    "success",
                );
            }
        });
    }
    onMount(async () => {
        await getData();
    });
</script>

<Navbar>
    <DetalleGrupo {nombre} {add}>
        <DatosBasicos
            bind:nombre
            bind:unidad
            bind:cantidad
            bind:codigo
            bind:cliente
            bind:producto
            {add}
            bind:edit
            {id}
            {volver}
            {clientes}
            {productos}
            {unidades}
            guardar={guardarGrupo}
        />
    </DetalleGrupo>
</Navbar>

