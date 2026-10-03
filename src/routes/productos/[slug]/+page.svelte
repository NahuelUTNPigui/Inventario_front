<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import DetalleProducto from "$lib/components/productos/DetalleProducto.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import DatosBasicos from "$lib/components/productos/DatosBasicos.svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import { makecodigo } from "$lib/genericos/strings";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
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
    let clientes = $state([]);
    //Data
    let id = $state("");
    let nombre = $state("");
    let codigo = $state("");
    let cliente = $state("");
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);
    async function getData() {
        detalleproducto = storageProducto.load();
        id = detalleproducto.id;
        nombre = detalleproducto.nombre;
        codigo = detalleproducto.codigo;
        cliente = detalleproducto.cliente;
        edit = detalleproducto.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
            codigo = makecodigo("prod");
        }
        const recordsc = await pb.collection("clientes").getFullList({
            filter:"active=true"
        });
        cargado = true;
        clientes = recordsc.sort((a,b)=>a.nombre.toLocaleLowerCase()<b.nombre.toLocaleLowerCase()?-1:1);
    }
    function volver() {
        goto("/productos");
    }
    async function guardarProducto() {
        if(nombre.length == 0){
            Swal.fire("Error nombre","Debe escribir un nombre","error")
            return
        }
        if(cliente.length == 0){
            Swal.fire("Error cliente","Debe seleccionar un cliente","error")
            return
        }
        if (id.length > 0 && !add) {
            await editarProducto();
        } else {
            let data = {
                nombre,
                cliente,
                codigo,
                active: true,
            };
            try {
                let recordc = await pb.collection("productos").create(data);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el producto`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el producto`,
                    "error",
                );
            } finally {
                volver();
            }
        }
    }
    async function editarProducto() {
        let data = {
            nombre,
            codigo,
            cliente,
        };
        try {
            let recordc = await pb.collection("productos").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el producto`, "success");
        } catch (err) {
            Swal.fire(
                "Error edición",
                `No se logró editar el producto`,
                "error",
            );
        } finally {
            volver();
        }
    }
    async function eliminar() {
        let data = {
            active: false,
        };

        try {
            let recordc = await pb.collection("productos").update(id, data);
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el producto`,
                "success",
            );
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el producto`,
                "error",
            );
        }
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar producto",
            text: "¿Seguro que deseas eliminar el producto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(id);
                
            }
        });
    }
    onMount(async () => {
        await getData();
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleProducto {add} {nombre}>
        {#if cargado}
            <DatosBasicos
                bind:nombre
                bind:cliente
                bind:codigo
                bind:edit
                {add}
                {id}
                {volver}
                eliminar={openDelModal}
                guardar={guardarProducto}
                {clientes}
            />
        {/if}
    </DetalleProducto>
</Navbar>
