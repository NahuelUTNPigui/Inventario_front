<script>
    import Buscador from "$lib/components/historial/Buscador.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Tabla from "$lib/components/historial/Tabla.svelte";
    import Lista from "$lib/components/historial/Lista.svelte";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";
    import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
    import Cargando from "$lib/components/Cargando.svelte";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);

    let cargado = $state(false);
    let cargadoListas = $state(false);

    //filtros
    let buscar = $state("");
    let cliente = $state("");
    let fechadesde = $state("");
    let remito = $state("");
    let lote = $state("");

    let clientes = $state([]);
    let historial = $state([]);
    let lotes = $state([]);
    let movimientos = $state([]);
    let historialrows = $state([]);
    function encontrarMovimiento(fila, fechaLimite) {
        let result = {
            expand: fila.expand,
            remito: fila.remito,
            lote: fila.lote,
            cantidad: fila.cantidad,
            codigo: fila.codigo,
        };
        let idx_fecha = fila.movimientos.findIndex(
            (item) => new Date(item.fecha) >= new Date(fechaLimite),
        );
        if (idx_fecha != -1) {
            result.cantidad = fila.movimientos[idx_fecha].cantidad;
        }
        return result;
    }
    function limpiarFiltros() {
        buscar = "";
        cliente = "";
        fechadesde = new Date().toISOString().split("T")[0];
        remito = "";
        lote = "";
        filterUpdate();
    }
    function filterUpdate() {
        let filas = historial;
        if (buscar.length > 0) {
            filas = filas.filter((h) =>
                h.nombreproducto
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
        if (cliente.length > 0) {
            filas = filas.filter((h) => h.cliente == cliente);
        }
        if (remito.length > 0) {

            filas = filas.filter((h) =>
                
                h.remito
                    .toLocaleLowerCase()
                    .includes(remito.toLocaleLowerCase()),
            );
        }
        if (lote.length > 0) {
            filas = filas.filter((h) =>
                h.lote.toLocaleLowerCase().includes(lote.toLocaleLowerCase()),
            );
        }
        if (fechadesde.length > 0) {
            let fechaFilter = new Date(fechadesde);
            let expiryDate2 = new Date(
                fechaFilter.setHours(fechaFilter.getHours() + 4),
            );
            filas = filas.filter((h) => {
                let fechaValidacion = h.inicio <= expiryDate2;
                if (h.fin != "") {
                    fechaValidacion = fechaValidacion && h.fin > expiryDate2;
                }
                return fechaValidacion;
            });
        }

        historialrows = filas.map((h) => encontrarMovimiento(h, fechadesde));
    }

    async function getData() {
        historial = [];
        clientes = [];
        lotes = [];
        const recordsl = await pb.collection("lotes").getFullList({
            filter: `active = true`,
            expand: "producto,unidad",
        });
        const recordsm = await pb.collection("detallemovimientos").getFullList({
            expand: "movimiento",
            filter: `movimiento.active = true`,
        });

        movimientos = recordsm.map((c) => ({ ...c }));
        lotes = recordsl.map((c) => ({ ...c }));

        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active = true",
            sort: "nombre",
        });

        clientes = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
        clientes = [{ id: "", nombre: "Todos" }].concat(
            clientes.map((c) => ({ ...c })),
        );
        cargado = true;
        cargadoListas = true;
    }
    onMount(async () => {
        fechadesde = new Date().toISOString().split("T")[0];

        await getData();
        procesarDatos();
        filterUpdate();
    });

    function procesarDatos() {
        let tablalotes = {};
        for (let i = 0; i < movimientos.length; i++) {
            let movimiento = movimientos[i];
            let fecha = movimiento.expand.movimiento.fecha;

            if (fecha) {
                let m = {
                    fecha: fecha,
                    cantidad: movimiento.historial,
                    created: movimiento.created,
                };
                let idlote = movimiento.lote;

                if (tablalotes[idlote]) {
                    if (tablalotes[idlote].movimientos[m.fecha]) {
                        let fila = tablalotes[idlote].movimientos[m.fecha];
                        if (fila.created < m.created) {
                            tablalotes[idlote].movimientos[m.fecha] = { ...m };
                        }
                    } else {
                        tablalotes[idlote].movimientos[fecha] = {
                            ...m,
                        };
                    }
                } else {
                    tablalotes[idlote] = {
                        lote: {},
                        movimientos: {},
                    };
                    tablalotes[idlote].movimientos[fecha] = {
                        ...m,
                    };
                }
            }
        }

        for (let i = 0; i < lotes.length; i++) {
            let lote = lotes[i];
            let idlote = lote.id;
            let listamovs = [];
            if (tablalotes[idlote]) {
                let tablamovimientos = tablalotes[idlote].movimientos;
                Object.entries(tablamovimientos).forEach((fila) => {
                    listamovs.push(fila[1]);
                });
                listamovs.sort((a, b) =>
                    new Date(a.fecha) < new Date(b.fecha) ? -1 : 1,
                );
                let filahistorial = {
                    id: lote.id,
                    lote: lote.lote,
                    remito: lote.remito,
                    cliente: lote.cliente,
                    expand: lote.expand,
                    codigo: lote.codigo,
                    movimientos: listamovs,
                    cantidad: lote.cantidad,
                    nombreproducto: lote.expand.producto.nombre,
                };
                let ultimos_idx = listamovs.length - 1;
                let fechainicio = new Date(listamovs[0].fecha);
                let fechafin =
                    lote.fechacierre.length > 0
                        ? new Date(lote.fechacierre)
                        : "";
                filahistorial.inicio = fechainicio;
                filahistorial.fin = fechafin;
                historial.push(filahistorial);
            } else {
                let filahistorial = {
                    id: lote.id,
                    lote: lote.lote,
                    remito: lote.remito,
                    cliente: lote.cliente,
                    expand: lote.expand,
                    codigo: lote.codigo,
                    movimientos: listamovs,
                    cantidad: lote.cantidad,
                    nombreproducto: lote.expand.producto.nombre,
                };
                let ultimos_idx = listamovs.length - 1;
                let fechainicio = new Date(lote.fechaingreso);
                let fechafin =
                    lote.fechacierre.length > 0
                        ? new Date(lote.fechacierre)
                        : "";
                filahistorial.inicio = fechainicio;
                filahistorial.fin = fechafin;
                historial.push(filahistorial);
            }
        }

    }
</script>

<Navbar>
    {#if cargadoListas}
        <Buscador
            bind:buscar
            {filterUpdate}
            {limpiarFiltros}
            bind:cliente
            bind:fechadesde
            bind:remito
            bind:lote
            {clientes}
            data={historialrows}
        />
    {:else}
        <Cargando />
    {/if}
    {#if cargado}
        <!--Tabla-->
        <div
            class={`
                hidden w-full  md:grid
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
                <Tabla {historialrows} />
            </div>
        </div>
        <div
            class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <Lista {historialrows} />
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
