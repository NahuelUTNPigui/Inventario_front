<script>
    import PocketBase from "pocketbase";
    import { ScanQRCode } from "@kuiper/svelte-scan-qrcode";
    import Navbar from "$lib/components/Navbar.svelte";
    import CardBase from "$lib/components/CardBase.svelte";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { getNombreLista, shorterWord } from "$lib/genericos/strings";
    import estadoslote from "$lib/genericos/estadoslote";
    import Eye from "$lib/components/svg/Eye.svelte";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Storage
    let defaultlote = {
        id: "",
        codigo: "",
        cerrado: 0,
        producto: "",
        cantidad: "",
        unidad: "",
        vencimiento: "",
        ingreso: "",
        cierre: "",
        cliente: "",
        remito: "",
        lote: "",
        edit: false,
    };
    let detallelote = $state(defaultlote);
    let storageLote = createStorageProxy("detallelote", defaultlote);
    //scner
    // Variable para forzar la recreación del scanner
    let scannerKey = $state(0);
    let scanning = $state(true);
    //fin scanner
    //fin storage
    let result = $state("");
    let idlote = $state("");
    let codigolote = $state("");
    let conerror = $state(false);
    let cargado = $state(false);
    let datalote = $state({});
    async function getLoteId(p_id) {
        try {
            let reslote = await pb
                .collection("lotes")
                .getOne(p_id, { expand: "producto,unidad" });
            if (reslote) {
                Swal.fire("Éxito", "Lote encontrado", "success");
                return reslote;
            } else {
                return { id: "-1", codigo: "" };
            }
        } catch (err) {
            console.error(err);
            return { id: "-1", codigo: "error" };
        }
    }
    async function getLote() {
        let reslote = await pb
            .collection("lotes")
            .getFirstListItem(`codigo='${codigolote}'`, {
                expand: "producto,unidad",
            });
        if (reslote) {
            return reslote;
        } else {
            return { id: "-1", codigo: "" };
        }
    }
    function reniciar() {
        conerror = false;
        cargado = false;
        idlote = "";
        codigolote = "";
        scannerKey += 1;
        scanning = true;
    }
    function _onPermissionError() {
        conerror = true;
        scanning = false;
    }
    async function verLoteResulted() {
        let listaresult = result.split("-");
        if (listaresult.length > 0) {
            let primerid = listaresult[0];
            let lote = await getLoteId(primerid);
            detallelote = {
                id: lote.id,
                codigo: lote.codigo,
                cerrado: lote.cerrado,
                producto: lote.producto,
                cantidad: lote.cantidad,
                unidad: lote.unidad,
                remito: lote.remito,
                lote: lote.lote,
                cliente: lote.expand ? lote.expand.producto.cliente : "",
                vencimiento:
                    lote.fechavencimiento.length > 0
                        ? lote.fechavencimiento.split(" ")[0]
                        : "",
                ingreso:
                    lote.fechaingreso.length > 0
                        ? lote.fechaingreso.split(" ")[0]
                        : "",
                cierre:
                    lote.fechacierre.length > 0
                        ? lote.fechacierre.split(" ")[0]
                        : "",
                edit: true,
            };

            storageLote.save(detallelote);
            conerror = false;
            cargado = true;
            datalote = lote;
            scanning = false;
        } else {
            conerror = true;
            cargado = false;
        }
    }

    async function verLoteCodigo() {
        if (codigolote.length > 0) {
            let lote = await getLote();
            try {
                datalote = lote;
                detallelote = {
                    id: lote.id,
                    codigo: lote.codigo,
                    cerrado: lote.cerrado,
                    producto: lote.producto,
                    cantidad: lote.cantidad,
                    unidad: lote.unidad,
                    remito: lote.remito,
                    lote: lote.lote,
                    cliente: lote.expand ? lote.expand.producto.cliente : "",
                    vencimiento:
                        lote.fechavencimiento.length > 0
                            ? lote.fechavencimiento.split(" ")[0]
                            : "",
                    ingreso:
                        lote.fechaingreso.length > 0
                            ? lote.fechaingreso.split(" ")[0]
                            : "",
                    cierre:
                        lote.fechacierre.length > 0
                            ? lote.fechacierre.split(" ")[0]
                            : "",
                    edit: true,
                };

                storageLote.save(detallelote);
                cargado = true;
                conerror = false;
                scanning = false;
            } catch (err) {
                console.error(err);
                conerror = true;
                cargado = false;
            }
        } else {
            conerror = true;
            cargado = false;
        }
    }
    async function _onResulted() {
        await verLoteResulted();
    }
    async function irALote() {
        if (datalote.id.length > 0) {
            goto("/lotes/" + datalote.id);
        }
    }
</script>

<Navbar>
    <CardBase titulo="Leer QR de Lote" cardsize="max-w-5xl">
        <div class="mb-4">
            <label
                for="codigolote"
                class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                >Codigo del lote</label
            >
            <input
                type="text"
                id="codigolote"
                bind:value={codigolote}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el codigo del lote"
            />
        </div>
        <div class="flex flex-wrap gap-2">
            <button
                class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                onclick={reniciar}
            >
                Reiniciar
            </button>
            <button
                class={`
                        hover:cursor-pointer
                        border rounded-full px-3 py-1 text-md flex items-center gap-1
                        bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
                        dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
                    `}
                onclick={verLoteCodigo}
            >
                Leer codigo
            </button>
        </div>

        <br />
        {#if conerror}
            <span>Hubo errores 🔴. Pruebe reiniciar</span>
        {/if}
        <br />
        {#if cargado}
            <div
                class={`
                rounded-xl border p-4 transition-all
                border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900
            `}
            >
                <!-- Cabecera con checkbox y código -->
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="flex-1 min-w-0">
                            <p
                                class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                            >
                                {shorterWord(datalote.codigo, 40)}
                            </p>
                        </div>
                    </div>

                    <!-- Acciones -->
                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            onclick={() => irALote()}
                            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors hover:cursor-pointer hover:scale-105"
                        >
                            <Eye size="size-5" />
                        </button>
                    </div>
                </div>

                <!-- Grid de datos -->
                <div class="grid grid-cols-1 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Producto
                        </span>
                        <p
                            class="text-gray-900 dark:text-gray-100 font-medium truncate"
                        >
                            {datalote.expand?.producto?.nombre || "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Cantidad
                        </span>
                        <p class="text-gray-900 dark:text-gray-100 font-medium">
                            {datalote.cantidad ?? "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Unidad
                        </span>
                        <p
                            class="text-gray-900 dark:text-gray-100 font-medium truncate"
                        >
                            {datalote.expand?.unidad?.nombre || "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Estado
                        </span>
                        <p
                            class="text-gray-900 dark:text-gray-100 font-medium truncate"
                        >
                            {getNombreLista(datalote.cerrado, estadoslote)}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Vencimiento
                        </span>
                        <p class="text-gray-900 dark:text-gray-100 font-medium">
                            {datalote.fechavencimiento?.length > 0
                                ? new Date(
                                      datalote.fechavencimiento,
                                  ).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Ingreso
                        </span>
                        <p class="text-gray-900 dark:text-gray-100 font-medium">
                            {datalote.fechaingreso
                                ? new Date(
                                      datalote.fechaingreso,
                                  ).toLocaleDateString()
                                : "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Remito
                        </span>
                        <p class="text-gray-900 dark:text-gray-100 font-medium">
                            {datalote.remito ?? "-"}
                        </p>
                    </div>
                    <div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                            Lote
                        </span>
                        <p class="text-gray-900 dark:text-gray-100 font-medium">
                            {datalote.lote ?? "-"}
                        </p>
                    </div>
                </div>
            </div>
            <br />
        {:else}
            <span>No Cargado 🔴</span>
            <br />
        {/if}
        {#if scanning}
            <ScanQRCode
                key={scannerKey}
                bind:scanResult={result}
                enableQRCodeReaderButton={false}
                options={{
                    onPermissionError: () => _onPermissionError(),
                    onResulted: () => _onResulted(),
                }}
            />
        {/if}
    </CardBase>
</Navbar>
