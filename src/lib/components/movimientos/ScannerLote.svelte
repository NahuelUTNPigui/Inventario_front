<script>
    import Swal from "sweetalert2";
    
    let {
        codigo = $bindable(""),
        getLoteCodigo=async ()=>{},
        seleccionarLote=(p_lote)=>{},
        limpiarNombre=()=>{},
        verificado = $bindable(false),
        malverificado=$bindable(false)
    } = $props();
    let conerror = $state(false);
    let nombre = $state("");
    let result = $state();
    let conscaner = $state(false);
    function mostrarExito(mensaje) {
        Swal.fire({
            title: "Lote encontrado!",
            text: mensaje,
            icon: "success",
            showConfirmButton: false,
        });
    }
    async function verificarLote() {
        verificado = false;
        malverificado = false;
        let record_lote = await getLoteCodigo(codigo)
        
        if (record_lote) {
            seleccionarLote(record_lote)
            
            verificado = true;

            
            
            conerror = false;
        } else {
            conerror = false;
            malverificado = true;
        }
    }
    function _onPermissionError() {
        alert("No funciona");
        conerror = true;
    }
    function _onResulted() {
        let p_idx = productos.findIndex((p) => p.codigo == result);

        if (p_idx != -1) {
            let p = productos[p_idx];
            nombre = p.nombre;
            verificado = true;
            seleccionarProducto(p_idx);
            mostrarExito(nombre);
            conerror = false;
        } else {
            conerror = false;
            malverificado = true;
        }
    }
    function escanear() {
        conscaner = true;
    }
    function limpiar() {
        limpiarNombre();
        verificado = false;
        malverificado = false;
        conerror = false;
        conscaner = false;
        nombre = "";
        codigo = "";
    }
</script>

<!-- Escáner de Productos -->
<div
    class=" rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Código del lote
    </h2>
    <div>
        <label
            for="codigolote"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
            Código
        </label>
        <input
            id="codigolote"
            type="text"
            placeholder="codigo"
            bind:value={codigo}
            class="w-full px-3 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
        />
    </div>
    <br />
    <button
        onclick={verificarLote}
        class="
            cursor-pointer w-full 
            dark:bg-red-900 dark:hover:bg-red-800
            bg-red-900 hover:bg-red-800
            text-white font-medium py-3 px-4 
            rounded-lg transition-colors duration-200
        "
    >
        Verificar codigo
    </button>
    
    {#if verificado}
        <!-- Estado después de escanear -->
        <div id="scanner-scanned mt-3">
            <div
                class="bg-gray-100 dark:bg-transparent rounded-lg p-6 mb-4 text-center"
            >
                <div
                    class="w-12 h-12 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-3"
                >
                    <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <p
                    class="text-green-600 dark:text-green-400 font-semibold mb-1"
                >
                    ¡Lote encontrado!
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {nombre}
                </p>
            </div>
            <button
                onclick={limpiar}
                class="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Buscar Otro
            </button>
        </div>
    {/if}
    {#if malverificado}
        <!-- Estado después de escanear -->
        <div id="scanner-scanned mt-3">
            <div
                class="bg-gray-100 dark:bg-transparent rounded-lg p-6 mb-4 text-center"
            >
                <div
                    class="w-12 h-12 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-3"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <p class="text-red-600 dark:text-red-400 font-semibold mb-1">
                    Lote no encontrado!
                </p>
            </div>
            <button
                onclick={limpiar}
                class="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Buscar de vuelta
            </button>
        </div>
    {/if}
</div>
