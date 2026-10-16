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
    import productos from "$lib/genericos/productos";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);

    let clientes = $state([]);
    let productospending = $state([]);
    //Data
    let id = $state("");
    let nombre = $state("");
    let codigo = $state("");
    let cliente = $state("");

    let add = $state(true);
    let cargado = $state(false);
    let botonhabilitado = $state(true);
    async function getData() {
        codigo = makecodigo("prod");

        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active=true",
        });
        cargado = true;
        clientes = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
    }
    function volver() {
        goto("/productos");
    }
    function agregarProducto() {
        if (nombre.length == 0) {
            Swal.fire("Error nombre", "Debe escribir un nombre", "error");
            return;
        }
        if (cliente.length == 0) {
            Swal.fire("Error cliente", "Debe seleccionar un cliente", "error");
            return;
        }
        let data = {
            nombre,
            codigo,
        };
        productos.push(data)
    }
    async function guardarProductos() {
        if (nombre.length == 0) {
            Swal.fire("Error nombre", "Debe escribir un nombre", "error");
            return;
        }
        if (cliente.length == 0) {
            Swal.fire("Error cliente", "Debe seleccionar un cliente", "error");
            return;
        }
        for (let i = 0; i < productos.length; i++) {
            let fila = productos[i];
            let data = {
                nombre: fila.nombre,
                cliente,
                codigo: fila.codigo,
                active: true,
            };
            try {
                let recordc = await pb.collection("productos").create(data);
            } catch (err) {
                console.log(err);
            }
        }
    }

    onMount(async () => {
        await getData();
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleProducto {add} {nombre}>
        {#if cargado}{/if}
    </DetalleProducto>
</Navbar>
