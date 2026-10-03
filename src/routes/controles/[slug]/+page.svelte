<script>
    import Navbar from "$lib/components/Navbar.svelte";

    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";

    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import DetalleControl from "$lib/components/controles/DetalleControl.svelte";
    import DatosBasicos from "$lib/components/controles/DatosBasicos.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
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
    //listas
    let clientes = $state([]);
    let usuarios = $state([]);
    let productos = $state([]);
    let productosrows = $derived(cliente.length>0?productos.filter(p=>p.cliente==cliente):productos);
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
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);

    function volver() {
        goto("/controles");
    }
    async function editarControl() {
        let data = {
            fecha:fecha+ " 03:00:00",
            producto,
            unidad,
            cantidad,
            lote
        };
        try {
            let recordc = await pb.collection("controles").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el control`, "success");
        } catch (err) {
            Swal.fire(
                "Error edición",
                `No se logró editar el control`,
                "error",
            );
        } finally {
            volver();
        }
    }
    async function guardarControl() {
        if(fecha.length==0){
            Swal.fire("Error fecha","Debe seleccionar alguna fecha","error")
            return
        }
        if(producto.length==0){
            Swal.fire("Error producto","Debe seleccionar algun producto","error")
            return
        }
        if(unidad.length==0){
            Swal.fire("Error unidad","Debe seleccionar alguna unidad","error")
            return
        }
        if(fecha.length==0){
            Swal.fire("Error fecha","Debe seleccionar alguna fecha","error")
            return
        }
        if (id.length > 0 && !add) {
            await editarControl();
        } else {
            let user = JSON.parse(localStorage["pocketbase_auth"]);
            let idresponsable = user.record.id
            let data = {
                fecha:fecha+ " 03:00:00",
                producto,
                unidad,
                cantidad,
                lote,
                responsable:idresponsable,
                active: true,
            };
            try {
                let recordc = await pb.collection("controles").create(data);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el control`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el control`,
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
            let recordc = await pb.collection("controles").update(id, data);
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el control`,
                "success",
            );
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el control`,
                "error",
            );
        }
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar control",
            text: "¿Seguro que deseas eliminar el control?",
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
    async function getData() {
        
        detallecontrol = storageControl.load();
        id = detallecontrol.id;
        cliente = detallecontrol.cliente;
        fecha = detallecontrol.fecha;
        producto = detallecontrol.producto;
        unidad = detallecontrol.unidad;
        cantidad = detallecontrol.cantidad;
        lote = detallecontrol.lote;
        responsable = detallecontrol.responsable;
        edit = detallecontrol.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
            let user = JSON.parse(localStorage["pocketbase_auth"]);
            responsable = user.record.correo
            
        }
        const recordsu = await pb.collection("users").getFullList({
            filter:"active=true"
        });
        cargado = true;
        usuarios = recordsu;
        const recordsc = await pb.collection("clientes").getFullList({
            filter:"active=true"
        });
        clientes = recordsc.sort((a,b)=>a.nombre.toLocaleLowerCase()<b.nombre.toLocaleLowerCase()?-1:1);
        const resproductos = await pb.collection("productos").getFullList({
            filter:"active=true"
        });
        productos = resproductos.sort((a,b)=>a.nombre.toLocaleLowerCase()<b.nombre.toLocaleLowerCase()?-1:1);
        const resunidades = await pb.collection("unidades").getFullList({
            filter:"active=true"
        });
        unidades = resunidades;
    }
    onMount(async () => {
        
        await getData();
    });
</script>
<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleControl
        {add}
    >
        <DatosBasicos
            bind:fecha
            bind:producto
            bind:unidad
            bind:cantidad
            bind:lote
            bind:cliente
            bind:edit
            {responsable}
            {id}
            {add}
            guardar={guardarControl}
            eliminar={openDelModal}
            {volver}
            {clientes}
            productos={productosrows}
            {unidades}
        />
    </DetalleControl>
</Navbar>