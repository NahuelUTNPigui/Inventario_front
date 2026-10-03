<script>
    import Buscador from "../lotes/Buscador.svelte";
    import TablaLotes from "../lotes/TablaLotes.svelte";
    import ListaLotes from "../lotes/ListaLotes.svelte";
    import { onMount } from "svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    let { pb = {}, cliente = "",openLoteModal=()=>{},lotes=$bindable([]) } = $props();
    let buscadorRef = $state(null);
    let defaultlote = {
        id: "",
        codigo: "",
        cerrado: 0,
        producto: "",
        cantidad: "",
        unidad: "",
        vencimiento: "",
        ingreso: "",
        cliente: "",
        edit: false,
    };
    let detallelote = $state(defaultlote);
    let storageLote = createStorageProxy("detallelote", defaultlote);
    //filtros
    
    let buscar = $state("");
    let codigo = $state("");
    let estado = $state("open");
    let fechadesde = $state("");
    let fechahasta = $state("");
    let fechadesdevenc = $state("");
    let fechahastavenc = $state("");
    let remito = $state("");
    let lote = $state("");

    
    let lotesrows = $state([]);
    //listas
    let estados = [
        { id: "todos", nombre: "Todos" },
        { id: "open", nombre: "Abierto" },
        { id: "close", nombre: "Cerrado" },
    ];
    export function filterUpdate() {
        
        lotesrows = lotes;
        if (buscar != "") {
            lotesrows = lotesrows.filter(
                (t) =>
                    t.expand &&
                    t.expand.producto &&
                    t.expand.producto.nombre
                        .toLocaleLowerCase()
                        .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (codigo != "") {
            lotesrows = lotesrows.filter((l) =>
                l.codigo.toLocaleLowerCase().includes(codigo),
            );
        }
        if (remito != "") {
            lotesrows = lotesrows.filter((l) =>
                l.remito.toLocaleLowerCase().includes(remito),
            );
        }
        if (lote != "") {
            lotesrows = lotesrows.filter((l) =>
                l.lote.toLocaleLowerCase().includes(lote),
            );
        }
        
        if (estado != "todos") {
            let filtro_estado = estado=="open"?0:1
            lotesrows =lotesrows.filter((l) =>
                l.cerrado == filtro_estado  
            );
        }
        if (fechadesde != "") {

            lotesrows =lotesrows.filter((l) =>
                new Date(l.fechaingreso) >= new Date(fechadesde)
            );
        }
        if (fechahasta != "") {
            lotesrows =lotesrows.filter((l) =>
                new Date(l.fechaingreso) < new Date(fechahasta)
            );
        }
        if (fechadesdevenc != "") {
            lotesrows =lotesrows.filter((l) =>
                new Date(l.fechavencimiento) >= new Date(fechadesdevenc)
            );
        }
        if (fechahastavenc != "") {
            lotesrows =lotesrows.filter((l) =>
                new Date(l.fechavencimiento) < new Date(fechahastavenc)
            );
        }
    }
    export function setFocus() {
        
        buscadorRef.setFocus();
    }
    export async function getData() {
        
        const recordsl = await pb.collection("lotes").getFullList({
            filter: `active = true && producto.cliente = '${cliente}'`,
            expand: "producto,unidad",
            sort:"-fechaingreso"
        });
        
        lotes = recordsl;

        filterUpdate()
        
    }
    function openEditModal(p_id) {
        let c_idx = lotes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = lotes[c_idx];
            detallelote = {
                id: c.id,
                codigo: c.codigo,
                cerrado: c.cerrado,
                producto: c.producto,
                cantidad: c.cantidad,
                unidad: c.unidad,
                cliente: c.expand ? c.expand.producto.cliente : "",
                vencimiento:
                    c.fechavencimiento.length > 0
                        ? c.fechavencimiento.split(" ")[0]
                        : "",
                ingreso:
                    c.fechaingreso.length > 0
                        ? c.fechaingreso.split(" ")[0]
                        : "",
                cierre:
                    c.fechacierre.length > 0
                        ? c.fechacierre.split(" ")[0]
                        : "",
                edit: true,
            };

            storageLote.save(detallelote);
            goto("/lotes/" + c.id);
        }
    }
    function openViewModal(p_id) {
        let c_idx = lotes.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = lotes[c_idx];
            detallelote = {
                id: c.id,
                codigo: c.codigo,
                cerrado: c.cerrado,
                producto: c.producto,
                cantidad: c.cantidad,
                unidad: c.unidad,
                cliente: c.expand ? c.expand.producto.cliente : "",
                vencimiento:
                    c.fechavencimiento.length > 0
                        ? c.fechavencimiento.split(" ")[0]
                        : "",
                ingreso:
                    c.fechaingreso.length > 0
                        ? c.fechaingreso.split(" ")[0]
                        : "",
                cierre:
                    c.fechacierre.length > 0
                        ? c.fechacierre.split(" ")[0]
                        : "",
                edit: false,
            };
            storageLote.save(detallelote);
            goto("/lotes/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("lotes").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire("Éxito eliminar", `Se logró eliminar el lote`, "success");
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el usuario`,
                "error",
            );
        }
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar lote",
            text: "¿Seguro que deseas eliminar el lote?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el lote con éxito",
                    "success",
                );
            }
        });
    }
    onMount( () => {
        filterUpdate()
        
    });
</script>

<Buscador 
data={lotesrows}
bind:this={buscadorRef}
bind:buscar
        {filterUpdate}
        nuevo = {openLoteModal}
        bind:cliente
        bind:codigo
        bind:estado
        bind:fechadesde
        bind:fechahasta
        bind:remito
        bind:lote
        bind:fechadesdevenc
        bind:fechahastavenc
        
        {estados}

encliente={true}/>
<!--Tabla-->
<div
    class={`
            hidden w-full md:grid
            mx-auto py-0 my-0 px-2 max-w-7xl  
    `}
>
    <div
        class={`
                    py-0 my-0
                    overflow-hidden rounded-xl
                    border border-gray-300 dark:border-gray-700
                `}
    >
        <TablaLotes {lotesrows} 
        {openDelModal}
                {openViewModal}
                {openEditModal}
        />
    </div>
    
</div>
<div
        class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
    >
        <ListaLotes {lotesrows} 
        {openDelModal}
                {openViewModal}
                {openEditModal}
        />
    </div>
