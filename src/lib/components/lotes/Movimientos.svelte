<script>
    import BuscadorDetalle from "./BuscadorDetalle.svelte";

    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import PocketBase from "pocketbase";
    import Listadetalles from "./Listadetalles.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let buscar = $state("");
    let fechadesde = $state("");
    let fechahasta = $state("");
    let { 
        lote = "",codigolote="",
        openEgresoModal=()=>{},
        openIngresoModal=()=>{}
     } = $props();
    //movimiento
    let defaultmovimiento = {
        id: "",
        codigo: "",
        fecha: "",
        observacion: "",
        ingreso: 0,
        lote: "",
        edit: false,
    };
    let detallemovimiento = $state(defaultmovimiento);
    let storageMovimiento = createStorageProxy(
        "detallemovimiento",
        defaultmovimiento,
    );
    let detallemovimientos = $state([]);
    let detallemovimientosrows = $state([]);
    function filterUpdate() {
        detallemovimientosrows = detallemovimientos;
        if (buscar != "") {
            detallemovimientosrows = detallemovimientosrows.filter((t) =>
                t.codigo
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (fechadesde != "") {

            detallemovimientosrows =detallemovimientosrows.filter((l) =>
                new Date(l.fecha) >= new Date(fechadesde)
            );
        }
        if (fechahasta != "") {
            detallemovimientosrows =detallemovimientosrows.filter((l) =>
                new Date(l.fecha) < new Date(fechahasta)
            );
        }
    }
    function openViewModal(p_mov, movimiento) {
        detallemovimiento = {
            id: p_mov,
            codigo: movimiento.codigo,
            fecha:
                movimiento.fecha.length > 0
                    ? movimiento.fecha.split(" ")[0]
                    : "",
            observacion: movimiento.observacion,
            ingreso: movimiento.ingreso,
            lote: "",
            edit: false,
        };
        storageMovimiento.save(detallemovimiento);
        goto("/movimientos/" + p_mov);
    }
    function ingreso() {
        detallemovimiento = {
            id: "",
            codigo:"",
            fecha: "",
            observacion: "",
            ingreso: 0,
            lote:codigolote,
            edit: false,
        };

        filterUpdate();
        detallemovimiento = {
            id: "",
            codigo:"",
            fecha: "",
            observacion:"",
            ingreso: 1,
            lote:codigolote, 
            edit: false,
        };
        storageMovimiento.save(detallemovimiento)
        s
        goto("/movimientos/0");
    }
    export async function getData() {
        let records = await pb.collection("movimientoslote").getFullList({
            sort:"-fecha",
            filter: `lote='${lote}' && eliminado=false`,
        });
 
        detallemovimientos = records;
        filterUpdate()
    }
    onMount(async () => {
        await getData();
    });
</script>

<BuscadorDetalle bind:buscar bind:fechadesde bind:fechahasta {filterUpdate} ingreso={openIngresoModal} egreso={openEgresoModal} />
<Listadetalles {detallemovimientosrows} {openViewModal} />
