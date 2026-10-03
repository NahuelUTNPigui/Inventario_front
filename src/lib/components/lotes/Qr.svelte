<script>
    import { onMount } from "svelte";
    import QrCode from "svelte-qrcode";
    import * as htmlToImage from "html-to-image";
    import { toPng } from "html-to-image";

    let {
        codigo,
        idlote,
        //imprimirQR
    } = $props();
    let cargado = $state(false);
    let qrContainer = $state({});
    let superidlote = $derived(idlote+"-"+idlote+"-"+idlote)
    onMount(() => {
        cargado = true;
    });
    async function imprimirQR() {
        try {
            // Asegúrate que el elemento esté cargado
            if (!qrContainer) return;

            // Genera la imagen PNG
            const dataUrl = await toPng(qrContainer, {
                backgroundColor: "#ffffff", // Fondo blanco para el QR
                quality: 1, // Máxima calidad
            });

            // Crea un enlace temporal para descargar
            const link = document.createElement("a");
            //link.download = `QR-${codigo}.png`; // Nombre del archivo
            link.download = `QR-${idlote}.png`; // Nombre del archivo
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Error al generar QR:", error);
        }
    }
</script>

<div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <div class="flex items-center gap-2 mb-4">
        
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Código QR
        </h2>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
        {#if cargado}
            <div bind:this={qrContainer} class="flex justify-center">
                <!--<QrCode size="500" value={codigo} />-->
                <QrCode size="500" value={superidlote} />
            </div>
        {:else}
            <!-- QR Code Placeholder -->
            <div
                class="w-32 h-32 mx-auto bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center mb-4"
            >
                <svg
                    class="w-16 h-16 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm0 4h2v2h-2V9zm-8 8h8v-8H3v8zm2-6h4v4H5v-4zm6 0h2v2h-2v-2zm0 4h2v2h-2v-2zm6-12v8h8V3h-8zm6 6h-4V5h4v4zm-6 6h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z"
                    />
                </svg>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">
                ID del lote:
            </p>
            <p class="text-sm font-mono text-gray-800 dark:text-gray-200">
                {codigo}
            </p>
        {/if}
    </div>
    <div class="mt-4 text-center">
        <button
            onclick={imprimirQR}
            class="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
            Descargar QR
        </button>
    </div>
</div>
