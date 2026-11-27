<script>
    import Buscador from "$lib/components/historial/Buscador.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Tabla from "$lib/components/historial/Tabla.svelte";
    import Lista from "$lib/components/historial/Lista.svelte";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";

    import Cargando from "$lib/components/Cargando.svelte";
    import FilterPill from "$lib/components/FilterPill.svelte";

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


        let idx_fecha_may = fila.movimientos.findIndex(
            (item) => new Date(item.fecha) > new Date(fechaLimite+" 03:00:00"),
        );
        let idx_fecha_eq = fila.movimientos.findIndex(
            (item) => new Date(item.fecha) == new Date(fechaLimite),
        );
        if (idx_fecha_eq != -1) {
            let mov = fila.movimientos[idx_fecha_eq];
            result.cantidad = mov.historial + mov.cantidad;
        } else if (idx_fecha_may != -1) {
            let mov = fila.movimientos[idx_fecha_may - 1];
            result.cantidad = mov.historial + mov.cantidad;
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
        //Tenes un bloque de bloquecitos. El bloque largo es el lote con fecha inicion y fecha fin
        // Si la fecha desde esta entre ese rango entonces debe haber un bloque pequeño que lo represente
        if (fechadesde.length > 0) {
            let datedesde = new Date(fechadesde);
            let datedesdecorregido = new Date(
                datedesde.setHours(datedesde.getHours() + 4),
            );
            //Esto no lo entiendo
            filas = filas.filter((h) => {
                let fechaValidacion = h.inicio <= datedesdecorregido;
                if (h.fin != "") {
                    fechaValidacion =
                        fechaValidacion && h.fin > datedesdecorregido;
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
            //filter: `movimiento.active = true && eliminado = false`,
            filter: `eliminado = false`,
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
        //movimientos
        for (let i = 0; i < movimientos.length; i++) {
            let movimiento = movimientos[i];
            let fecha = movimiento.expand.movimiento.fecha;
            let ingresofactor =
                movimiento.expand.movimiento.ingreso == 0 ? 1 : -1;
            if (fecha) {
                let m = {
                    fecha: fecha,
                    cantidad: ingresofactor * movimiento.cantidad,
                    historial: movimiento.historial,
                    created: movimiento.created,
                    ingreso: movimiento.ingreso,
                };
                let idlote = movimiento.lote;

                if (tablalotes[idlote]) {
                    if (tablalotes[idlote].movimientos[m.fecha]) {
                        let fila = tablalotes[idlote].movimientos[m.fecha];
                        //Para mi aca se convinan
                        if (fila.created < m.created) {
                            tablalotes[idlote].movimientos[m.fecha] = {
                                ...fila,
                                cantidad: m.cantidad + fila.cantidad,
                            };
                        } else {
                            tablalotes[idlote].movimientos[m.fecha] = {
                                ...m,
                                cantidad: m.cantidad + fila.cantidad,
                            };
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
        //lotes
        for (let i = 0; i < lotes.length; i++) {
            let lote = lotes[i];
            let idlote = lote.id;
            let listamovs = [];
            if (tablalotes[idlote]) {
                let tablamovimientos = tablalotes[idlote].movimientos;
                Object.values(tablamovimientos).forEach((mov) => {
                    listamovs.push(mov);
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
                    codigoproducto: lote.expand.producto.codigo,
                };

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
                    codigoproducto: lote.expand.producto.codigo,
                };

                let fechainicio = new Date(lote.fechaingreso);
                //fecha fin puede ser un string o un date, eso siempre trae problemass
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
    function getNombreCliente(p_cliente) {
        let c_idx = clientes.findIndex((c) => c.id == p_cliente);
        if (c_idx != -1) {
            return clientes[c_idx].nombre;
        } else {
            return "";
        }
    }
    let nombrecliente = $derived(
        cliente == "" ? "" : getNombreCliente(cliente),
    );
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
        <div class={`container mx-auto py-1 max-w-7xl w-full `}>
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 my-2"
            >
                <FilterPill
                    etiqueta="Fecha :"
                    valor={new Date(
                        fechadesde + " 03:00:00",
                    ).toLocaleDateString()}
                />
                <FilterPill etiqueta="Cliente:" valor={nombrecliente} />
                <FilterPill etiqueta="Remito:" valor={remito} />
                <FilterPill etiqueta="Lote:" valor={lote} />
            </div>
        </div>
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
