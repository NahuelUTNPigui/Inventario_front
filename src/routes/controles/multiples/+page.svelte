<script>
    import Navbar from "$lib/components/Navbar.svelte";

    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import DetalleMultiple from "$lib/components/controles/DetalleMultiple.svelte";
    import { makecodigo } from "$lib/genericos/strings";
    import MultipleForm from "$lib/components/controles/MultipleForm.svelte";
    import MultipleControles from "$lib/components/controles/MultipleControles.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);

    //listas
    let clientes = $state([]);
    let usuarios = $state([]);
    let productos = $state([]);
    let productosrows = $derived(
        cliente.length > 0
            ? productos.filter((p) => p.cliente == cliente)
            : productos,
    );
    let unidades = $state([]);

    let lotes = $state([]);
    //Data
    let cliente = $state("");
    let id = $state("");
    let fecha = $state("");
    let producto = $state("");
    let unidad = $state("");
    let cantidad = $state(0);
    let lote = $state("");
    let responsable = $state("");
    let idresponsable = $state("");
    let cargado = $state(false);
    let controles = $state([]);
    function volver() {
        goto("/controles");
    }
    function setNombreProducto(idproducto) {
        let idx_prod = productos.findIndex((p) => p.id == idproducto);
        if (idx_prod != -1) {
            return productos[idx_prod].nombre;
        }
        return "";
    }
    function setNombreUnidad(idunidad) {
        let idx_prod = unidades.findIndex((p) => p.id == idunidad);
        if (idx_prod != -1) {
            return unidades[idx_prod].nombre;
        }
        return "";
    }
    function setCodigoLote(idlote){
        let idx_prod = lotes.findIndex((p) => p.id == idunidad);
        if (idx_prod != -1) {
            return lotes[idx_prod].codigo;
        }
        return "";
    }
    function guardarControl() {
        if (fecha.length == 0) {
            Swal.fire("Error fecha", "Debe seleccionar alguna fecha", "error");
            return;
        }
        if (producto.length == 0) {
            Swal.fire(
                "Error producto",
                "Debe seleccionar algun producto",
                "error",
            );
            return;
        }
        if (unidad.length == 0) {
            Swal.fire(
                "Error unidad",
                "Debe seleccionar alguna unidad",
                "error",
            );
            return;
        }
        if (fecha.length == 0) {
            Swal.fire("Error fecha", "Debe seleccionar alguna fecha", "error");
            return;
        }
        
        let data = {
            idtemp: makecodigo(id, 10, false),
            fecha: fecha + " 03:00:00",
            producto,
            productonombre: setNombreProducto(producto),
            unidad,
            unidadnombre:setNombreUnidad(unidad),
            cantidad,
            lote:setCodigoLote(lote),
            responsable: idresponsable,
            active: true,
        };
        controles.push(data);
        producto = ""
        unidad = ""
        cantidad = 0
    }
    function quitarControl(idtemp) {
        controles = controles.filter((c) => c.idtemp != idtemp);
    }
    async function guardarControles() {
        if(controles.length==0){
            Swal.fire(
                "Error controles",
                "Debe haber controles agregados",
                "error",
            );
            return
        }
        let conerrores = false;
        for (let i = 0; i < controles.length; i++) {
            let data = {
                ...controles[i],
            };
            try {
                let recordc = await pb.collection("controles").create(data);
            } catch (err) {
                console.error(err);
                conerrores = true;
            }
        }
        if (conerrores) {
            Swal.fire(
                "Error controles",
                "No se pudieron guardar todos los controles",
                "error",
            );
        } else {
            Swal.fire(
                "Éxito controles",
                "Se lograron guardar todos los controles",
                "success",
            );
        }
        volver();
    }
    async function getData() {
        let user = JSON.parse(localStorage["pocketbase_auth"]);
        responsable = user.record.correo;
        idresponsable = user.record.id;
        const recordsu = await pb.collection("users").getFullList({
            filter: "active=true",
        });
        cargado = true;
        usuarios = recordsu;
        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active=true",
        });
        clientes = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        const resproductos = await pb.collection("productos").getFullList({
            filter: "active=true",
        });
        productos = resproductos.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        const resunidades = await pb.collection("unidades").getFullList({
            filter: "active=true",
        });
        unidades = resunidades;
    }
    onMount(async () => {
        await getData();
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleMultiple>
        <MultipleForm
            bind:fecha
            bind:producto
            bind:unidad
            bind:cantidad
            bind:lote
            bind:cliente
            {responsable}
            guardar={guardarControl}
            {clientes}
            productos={productosrows}
            {unidades}
        />
        <MultipleControles
            {guardarControles}
            controlesrows={controles}
            {quitarControl}
        />
    </DetalleMultiple>
</Navbar>
