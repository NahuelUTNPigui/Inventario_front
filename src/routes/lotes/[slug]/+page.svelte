<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import DetalleLote from "$lib/components/lotes/DetalleLote.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import DatosBasicos from "$lib/components/lotes/DatosBasicos.svelte";
    import NuevoProducto from "$lib/components/NuevoProducto.svelte";

    import { goto } from "$app/navigation";
    import SelectTabs from "$lib/components/SelectTabs.svelte";
    import HorizontalTabs from "$lib/components/HorizontalTabs.svelte";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import { makecodigo } from "$lib/genericos/strings";
    import Movimientos from "$lib/components/lotes/Movimientos.svelte";
    import estilos from "$lib/estilos";
    import Qr from "$lib/components/lotes/Qr.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    let defaultlote = {
        id: "",
        codigo: "",
        cerrado: 0,
        producto: "",
        cantidad: "",
        unidad: "",
        cliente: "",
        vencimiento: "",
        ingreso: "",
        cierre:"",
        lote: "",
        remito: "",
        edit: false,
    };
    let detallelote = $state(defaultlote);
    let storageLote = createStorageProxy("detallelote", defaultlote);
    //listas
    let cargado = $state(false);
    let clientes = $state([]);
    let unidades = $state([]);
    let productos = $state([]);
    //Data
    let conmovimiento = $state(true);
    let id = $state("");
    let codigo = $state("");
    let cerrado = $state(0);
    let producto = $state("");
    let cantidad = $state(0);
    let unidad = $state("");
    let cliente = $state("");
    let remito = $state("");
    let lote = $state("");
    let vencimiento = $state("");
    let ingreso = $state("");
    let cierre = $state("")
    //Data viejo
    
    let cerradoviejo = $state(0);
    let cantidadviejo = $state(0)
    //banderas
    let edit = $state(false);
    let add = $state(false);
    //productos
    //nuevo producto
    let nombre = $state("");
    let codigoprod = $state("");
    
    function nuevoProducto() {
        nombre = "";

        codigoprod = makecodigo("prod");
        loteProducto.showModal();
    }
    function cerrarProducto() {
        nombre = "";

        codigoprod = "";
        loteProducto.close();
    }
    async function guardarProducto() {
        if (nombre.length == "") {
            return;
        }
        let data = {
            active: true,
            nombre,
            cliente,
            codigo: codigoprod,
        };
        try {
            let recordc = await pb.collection("productos").create(data);
            Swal.fire(
                "Éxito guardar",
                `Se logró registar el producto`,
                "success",
            );
            await getProductos();
            cerrarProducto();
        } catch (err) {
            Swal.fire(
                "Error guardar",
                `No se logró registar el producto`,
                "error",
            );
        }
    }
    //movimiento
    let movimientoRef = $state({});
    let fechamovimiento = $state("");
    let observacion = $state("");
    let codigomovimiento = $state("");
    let cantidadmov = $state(0);
    let tipomov = $state(0);
    function openIngresoModal() {
        fechamovimiento = "";
        observacion = "";
        codigomovimiento = makecodigo("mov", 3, true);
        cantidadmov = 0;
        tipomov = 0;
        ingresoLote.showModal();
    }
    function openEgresoModal() {
        fechamovimiento = "";
        observacion = "";
        codigomovimiento = makecodigo("mov", 3, true);
        cantidadmov = 0;
        tipomov = 1;
        egresoLote.showModal();
    }
    function closeIngreso() {
        ingresoLote.close();
    }
    function closeEgreso() {
        egresoLote.close();
    }
    async function guardarIngreso() {
        console.log(cantidad)
        
        if (fechamovimiento.length == 0) {
            Swal.fire("Error fecha", "Debe seleccionar una fecha", "error");
            return;
        }
        let movimiento = {
            active: true,
            fecha: fechamovimiento + " 03:00:00",
            observacion,
            ingreso: 0,
            codigo: codigomovimiento,
            precargado: false,
        };
        try {
            let recordmov = await pb
                .collection("movimientos")
                .create(movimiento);
            
            let detalle = {
                movimiento: recordmov.id,
                cantidad: cantidadmov,
                producto: producto,
                unidad: unidad,
                active: true,
                lote: id,
                cliente: cliente,
                historial:cantidad
            };
            
            let recorddetalle = await pb
                .collection("detallemovimientos")
                .create(detalle);
            let lotedata = {
                cantidad: cantidad + cantidadmov,
                detallemovimiento:recorddetalle.id
            };
            let recordlote = await pb.collection("lotes").update(id, lotedata);
            closeIngreso();
            cantidad = cantidad + cantidadmov;
            await movimientoRef.getData();
            Swal.fire(
                "Éxito movimiento",
                "Se pudo crear el ingreso",
                "success",
            );
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error movimiento",
                "No se pudo crear el ingreso",
                "error",
            );
        }
    }
    async function guardarEgreso() {
        console.log(cantidad)
        
        if (fechamovimiento.length == 0) {
            Swal.fire("Error fecha", "Debe seleccionar una fecha", "error");
            return;
        }
        let movimiento = {
            active: true,
            fecha: fechamovimiento + " 03:00:00",
            observacion,
            ingreso: 1,
            codigo: codigomovimiento,
            precargado: false,
        };
        try {
            let recordmov = await pb
                .collection("movimientos")
                .create(movimiento);
            
            let detalle = {
                movimiento: recordmov.id,
                cantidad: cantidadmov,
                producto: producto,
                unidad: unidad,
                active: true,
                lote: id,
                cliente: cliente,
                historial:cantidad
            };
            let recorddetalle = await pb
                .collection("detallemovimientos")
                .create(detalle);
            let lotedata = {
                cantidad: cantidad - cantidadmov,
                detallemovimiento:recorddetalle.id

            };
            let recordlote = await pb.collection("lotes").update(id, lotedata);
            closeEgreso();
            cantidad = cantidad - cantidadmov;
            await movimientoRef.getData();
            Swal.fire("Éxito movimiento", "Se pudo crear el egreso", "success");
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error movimiento",
                "No se pudo crear el egreso",
                "error",
            );
        }
    }
    //tabs
    let tab = $state("base");
    let tabs = [
        { id: "base", nombre: "Datos básicos" },
        { id: "mov", nombre: "Movimientos" },
        { id: "qr", nombre: "QR" },
    ];
    async function getProductos() {
        let recordp = await pb.collection("productos").getFullList({
            filter:"active=true"
        });
        productos = recordp;
    }
    
    async function getData() {
        detallelote = storageLote.load();

        id = detallelote.id;
        codigo = detallelote.codigo;
        producto = detallelote.producto;
        cerrado = detallelote.cerrado;
        cantidad = detallelote.cantidad;
        unidad = detallelote.unidad;
        cliente = detallelote.cliente;
        vencimiento = detallelote.vencimiento;
        ingreso = detallelote.ingreso;
        cierre = detallelote.cierre;
        remito = detallelote.remito;
        lote = detallelote.lote;
        edit = detallelote.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
        }

        let recordu = await pb.collection("unidades").getFullList({
            filter:"active=true"
        });

        let recordc = await pb.collection("clientes").getFullList({
            filter:"active=true"
        });
        await getProductos();
        
        unidades = recordu;

        clientes = recordc;
        cargado = true;
    }
    function volver() {
        goto("/lotes");
    }
    function esCerrando(){
        return cerradoviejo == 0 && cerrado == 1
    }
    function cambiarCantidad(){
        return cantidadviejo != cantidad
    }
    async function guardarLote() {
        if (unidad == "" || producto == "") {
            Swal.fire(
                "Error datos",
                "Debe seleccionar una unidad y un producto",
                "error",
            );
            return;
        }
        if (cliente == "") {
            Swal.fire("Error datos", "Debe seleccionar un cliente", "error");
            return;
        }
        if(cantidad == ""){
            Swal.fire("Error datos", "Debe escribir alguna cantidad. Puede ser cero", "error");
            return;
        }
        if(codigo == ""){
            Swal.fire("Error datos", "Debe escribir algún código. Puede ser el nombre del producto", "error");
            return;
        }
        if (id.length > 0 && !add) {
            await editarLote();
        } else {
            if(conmovimiento && ingreso.length==0){
                Swal.fire("Error datos", "Para crear el movimiento debe seleccionar la fecha de ingreso", "error");
            return;
            }
            let nombreproducto = getNombreProducto()
            let movimiento = {
                active: true,
                fecha: ingreso + " 03:00:00",
                observacion: "Nuevo stock",
                ingreso: 0,
                codigo: makecodigo("mov", 3, true),
                precargado: false,
            };

            let detalle = {
                
                cantidad: cantidad,
                cliente,
                producto: producto,
                unidad,
                lote: "",
                movimiento: "",
                historial:0
            };
            let data = {
                codigo,
                unidad,
                cerrado: 0,
                producto,
                cantidad,
                fechavencimiento:
                    vencimiento.length > 0 ? vencimiento + " 03:00:00" : "",
                fechaingreso: ingreso.length>0? ingreso + " 03:00:00":"",
                cliente,
                remito,
                lote,
                active: true,
            };
            try {
                let recordc = await pb.collection("lotes").create(data);
                if (conmovimiento) {
                    let recordmov = await pb
                        .collection("movimientos")
                        .create(movimiento);
                    detalle.movimiento = recordmov.id;
                    detalle.lote = recordc.id;
                    let recorddetalle = await pb
                        .collection("detallemovimientos")
                        .create(detalle);
                    let datalotedetalle = {detallemovimiento:recorddetalle.id}
                    await pb.collection("lotes").update(recordc.id,datalotedetalle)
                }
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el lote`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el lote`,
                    "error",
                );
            } finally {
                volver();
            }
        }
    }
    async function editarLote() {
        let data = {
            codigo,
            unidad,
            cerrado,
            producto,
            cantidad,
            fechavencimiento:vencimiento.length>0? vencimiento + " 03:00:00":"",
            fechaingreso:ingreso.length>0? ingreso + " 03:00:00":"",
            cliente,
            remito,
            lote,
            fechacierre:""
        };
        if(esCerrando()){
            data.fechacierre = new Date().toISOString().split("T")[0]+" 03:00:00"
        }
        if(cambiarCantidad()){
            data.detallemovimiento=""
        }
        try {
            let recordc = await pb.collection("lotes").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el lote`, "success");
        } catch (err) {
            Swal.fire("Error edición", `No se logró editar el lote`, "error");
        } finally {
            volver();
        }
    }
    async function eliminar() {
        let data = {
            active: false,
        };

        try {
            let recordc = await pb.collection("lotes").update(id, data);
            Swal.fire("Éxito eliminar", `Se logró eliminar el lote`, "success");
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el lote`,
                "error",
            );
        }
    }
    function openDelModal() {
        Swal.fire({
            title: "Eliminar lote",
            text: "¿Seguro que deseas eliminar el lote?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el lote con éxito",
                    "success",
                );
            }
        });
    }
    function getNombreProducto() {
        let idx_prod = productos.findIndex((p) => p.id == producto);
        if (idx_prod != -1) {
            let nombreproducto = productos[idx_prod].nombre;
            return nombreproducto;
        }
        return "";
    }
    function onchangeproducto() {
        if (add) {
            let idx_prod = productos.findIndex((p) => p.id == producto);
            if (idx_prod != -1) {
                let nombreproducto = productos[idx_prod].nombre;
                let codigolote = makecodigo(nombreproducto);

                if (codigo == "") {
                    codigo = codigolote;
                }
            }
        }
    }
    onMount(async () => {
        
        await getData();
        
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleLote {add} nombre={codigo} {nuevoProducto} {cliente} {id}>
        {#if !add}
            <div class="flex justify-center mt-1">
                <div class="w-full max-w-7xl px-4">
                    <!-- Combo alineado al borde izquierdo de la card -->
                    {#if esCelu}
                        <SelectTabs pestañas={tabs} bind:tab />
                    {:else}
                        <HorizontalTabs pestañas={tabs} bind:tab />
                    {/if}
                </div>
            </div>
        {/if}
        {#if cargado}
            {#if tab == "base"}
                <DatosBasicos
                    bind:conmovimiento
                    bind:edit
                    bind:codigo
                    bind:producto
                    bind:cerrado
                    bind:cantidad
                    bind:unidad
                    bind:vencimiento
                    bind:ingreso
                    bind:cliente
                    bind:remito
                    bind:lote
                    bind:cerradoviejo
                    bind:cantidadviejo
                    {cierre}
                    {clientes}
                    {unidades}
                    {productos}
                    {add}
                    {id}
                    {volver}
                    {onchangeproducto}
                    guardar={guardarLote}
                    eliminar={openDelModal}
                />
            {:else if tab == "mov"}
                <Movimientos
                    bind:this={movimientoRef}
                    codigolote={codigo}
                    lote={id}
                    {openEgresoModal}
                    {openIngresoModal}
                />
            {:else}
                <Qr {codigo} idlote={id}/>
            {/if}
        {/if}
    </DetalleLote>
</Navbar>
<dialog id="ingresoLote" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo ingreso</h3>
        <div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Codigo</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={codigomovimiento}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="Fecha" class="label mb-0 pb-0">
                    <span
                        class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                    
                "
                    >
                        Fecha</span
                    >
                </label>
                <input
                    id="Fecha"
                    type="date"
                    class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-green-500 
                        focus:border-gray-500
                        bg-transparent
                        ${estilos.bgdark2} 
                    `}
                    bind:value={fechamovimiento}
                />
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Observacion</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={observacion}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Cantidad</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="number"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={cantidadmov}
                    />
                </label>
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    onclick={closeIngreso}>Cerrar</button
                >
                <button
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    onclick={guardarIngreso}>Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
<dialog id="egresoLote" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo egreso</h3>
        <div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Codigo</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={codigomovimiento}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="Fecha" class="label mb-0 pb-0">
                    <span
                        class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                    
                "
                    >
                        Fecha</span
                    >
                </label>
                <input
                    id="Fecha"
                    type="date"
                    class={`
                        input input-bordered w-full
                        border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 
                        focus:ring-gray-500 
                        focus:border-gray-500
                        bg-transparent
                        ${estilos.bgdark2} 
                    `}
                    bind:value={fechamovimiento}
                />
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Observacion</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="text"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={observacion}
                    />
                </label>
            </div>
            <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                <label for="nombre" class="label mb-0 pb-0">
                    <span
                        class="
                            label-text tracking-wide
                            text-md uppercase
                            font-semibold dark:text-gray-400
                            text-gray-500
                        "
                    >
                        Cantidad</span
                    >
                </label>
                <label class="input-group">
                    <input
                        id="nombre"
                        type="number"
                        class={`input input-bordered w-full ${estilos.bgdark}`}
                        bind:value={cantidadmov}
                    />
                </label>
            </div>
        </div>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    onclick={closeEgreso}>Cerrar</button
                >
                <button
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    onclick={guardarEgreso}>Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
<dialog id="loteProducto" class="modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Nuevo producto</h3>
        <NuevoProducto
            bind:nombre
            bind:codigo={codigoprod}
            {cliente}
            {clientes}
        />

        <div class="modal-action">
            <form method="dialog">
                <button
                    class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    onclick={cerrarProducto}>Cerrar</button
                >
                <button
                    onclick={guardarProducto}
                    class="hover:cursor-pointer mt-2 px-5 py-1 md:py-2 md:px-10 bg-[#115642] text-white font-medium rounded-full shadow-sm hover:bg-green-700 transition-colors text-base"
                    >Guardar</button
                >
            </form>
        </div>
    </div>
</dialog>
