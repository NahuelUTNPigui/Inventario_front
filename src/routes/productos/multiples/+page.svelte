<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import DetalleProducto from "$lib/components/productos/DetalleProducto.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import DatosBasicos from "$lib/components/productos/DatosBasicos.svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import { makecodigo } from "$lib/genericos/strings";
    import estilos from "$lib/estilos";
    import Eye from "$lib/components/svg/Eye.svelte";
    import Trash from "$lib/components/svg/Trash.svelte";
    import Pencil from "$lib/components/svg/Pencil.svelte";
    import { shorterWord } from "$lib/genericos/strings";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);

    let clientes = $state([]);
    let productospending = $state([]);
    //Data
    let productos = $state([]);
    let id = $state("");
    let nombre = $state("");
    let codigo = $state("");
    let cliente = $state("");

    let add = $state(true);
    let cargado = $state(false);
    let botonhabilitado = $state(true);
    let inputRef = $state(null);

    // Se ejecuta apenas el componente se monta y el input está disponible
    $effect(() => {
        if (inputRef) {
            inputRef.focus();
        }
    });
    async function getData() {
        codigo = makecodigo("prod");

        const recordsc = await pb.collection("clientes").getFullList({
            filter: "active=true",
        });
        cargado = true;
        clientes = recordsc.sort((a, b) =>
            a.nombre.toLocaleLowerCase() < b.nombre.toLocaleLowerCase()
                ? -1
                : 1,
        );
    }
    function volver() {
        goto("/productos");
    }
    function limpiarFormulario() {
        id = "";
        nombre = "";
        codigo = "";
    }
    function agregarProducto() {
        if (nombre.length == 0) {
            Swal.fire("Error nombre", "Debe escribir un nombre", "error");
            return;
        }
        if (cliente.length == 0) {
            Swal.fire("Error cliente", "Debe seleccionar un cliente", "error");
            return;
        }
        let data = {
            tempid: makecodigo("prod", 10),
            nombre,
            codigo,
        };
        nombre = ""
        codigo = ""
        inputRef.focus()
        productos.push(data);
    }
    function eliminarProducto(p_id) {
        productos = productos.filter((p = p.tempid != p_id));
    }
    function verProducto(p_id) {
        let p_idx = productos.findIndex((p) => p.tempid == p_id);
        if (p_idx != -1) {
            let p = productos[p_idx];
            nombre = p.nombre;
            codigo = p.codigo;
            id = p.tempid;
        }
    }
    function editarProducto() {
        let p_idx = productos.findIndex((p) => p.tempid == id);
        if (p_idx != -1) {
            let p = productos[p_idx];
            p = {
                ...p,
                nombre,
                codigo,
            };
            productos[p_idx] = p;
            inputRef.focus()
        }

    }
    async function guardarProductos() {
        
        if (cliente.length == 0) {
            Swal.fire("Error cliente", "Debe seleccionar un cliente", "error");
            return;
        }
        let productosid = [] 
        for (let j = 0; j < productos.length; j++) {
            let fila = productos[j];
            let data = {
                nombre: fila.nombre,
                cliente,
                codigo: fila.codigo,
                active: true,
            };
            try {
                
                await pb.collection("productos").create(data);
                
                productosid.push(fila.tempid)
                
                
            } catch (err) {
                console.log(err);
                Swal.fire(
                    "Error producto",
                    "No se logró guardar el producto: " + fila.nombre,
                    "success",
                );
            }
        }
        productos = productos.filter(p=>!productosid.includes(p.tempid))
        Swal.fire(
            "Productos procesados",
            "Se terminó de registrar los procesos",
            "success",
        );
    }

    onMount(async () => {
        await getData();
    });
    let pyfila = "py-1";
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <DetalleProducto add={false} {nombre} multiples={true}>
        {#if cargado}
            <div class="grid grid-cols-2 gap-1 lg:gap-6 mx-1 mb-2">
                <div class="mb-1 lg:mb-0 flex flex-col">
                    <label for="cliente" class="label mb-0 pb-0">
                        <span
                            class="
                                label-text tracking-wide
                                text-md uppercase
                                font-semibold dark:text-gray-400
                                text-gray-500
                            "
                        >
                            Cliente</span
                        >
                    </label>

                    <select
                        class="
                        bg-white dark:bg-slate-900
                        border
                        border-gray-300 dark:border-gray-600
                        rounded-md px-3 py-1.5 text-sm
                        focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700
                        "
                        bind:value={cliente}
                    >
                        {#each clientes as s}
                            <option value={s.id}>{s.nombre}</option>
                        {/each}
                    </select>
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
                            Nombre</span
                        >
                    </label>

                    <label class="input-group">
                        <input
                            id="rp"
                            type="text"
                            class={`input input-bordered w-full ${estilos.bgdark}`}
                            bind:this={inputRef}
                            bind:value={nombre}
                        />
                    </label>
                </div>
                <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
                    <label for="rp" class="label mb-0 pb-0">
                        <span
                            class="
                    label-text tracking-wide
                    text-md uppercase
                    font-semibold dark:text-gray-400
                    text-gray-500
                "
                        >
                            Código</span
                        >
                    </label>

                    <label class="input-group">
                        <input
                            id="rp"
                            type="text"
                            class={`input input-bordered w-full ${estilos.bgdark}`}
                            bind:value={codigo}
                        />
                    </label>
                </div>
            </div>
            <div
                class={`mt-6 flex space-x-3 justify-end border-t border-gray-300 dark:border-gray-800 `}
            >
                {#if id != ""}
                    <button
                        onclick={limpiarFormulario}
                        class="hover:cursor-pointer mt-2 px-10 py-2 bg-[#A94442] text-white font-medium rounded-full shadow-sm hover:bg-red-800 transition-colors text-base"
                    >
                        Limpiar
                    </button>
                {/if}
                <button
                    class={`
                        hover:cursor-pointer 
                        mt-2 px-5 py-1 md:py-2 md:px-10 
                        bg-blue-600 text-white font-medium rounded-full shadow-sm 
                        hover:bg-blue-700 transition-colors text-base  
                    `}
                    onclick={() =>
                        id == "" ? agregarProducto() : editarProducto()}
                >
                    {id == "" ? "Agregar" : "Editar"}
                </button>
                <button
                    class={`
                        hover:cursor-pointer 
                        mt-2 px-5 py-1 md:py-2 md:px-10 
                        bg-[#115642] text-white font-medium rounded-full shadow-sm 
                        hover:bg-green-700 transition-colors text-base  
                    `}
                    onclick={guardarProductos}
                >
                    Guardar productos
                </button>
            </div>
            <table
                class="mt-1     table table-lg w-full bg-white dark:bg-slate-900 rounded-none"
            >
                <thead
                    class={`${estilos.tableheader}  sticky top-0 z-5 shadow-sm`}
                >
                    <tr>
                        <th
                            class={`
                        ${estilos.tableth}   
                    `}
                        >
                            <div
                                class="flex flex-row justify-between uppercase"
                            >
                                Nombre
                            </div>
                        </th>
                        <th
                            class={`
                        ${estilos.tableth}   
                    `}
                        >
                            <div
                                class="flex flex-row justify-between uppercase"
                            >
                                Código
                            </div>
                        </th>
                        <th class="text-base mx-1 px-1 text-center uppercase">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each productos as t}
                        <tr>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {`${shorterWord(t.nombre, 30)}`}
                            </td>
                            <td class={`text-base mx-1 px-4 ${pyfila}`}>
                                {`${t.codigo}`}
                            </td>
                            <td
                                class={`flex text-base  items-center justify-center gap-2 px-1 ${pyfila}`}
                            >
                                <button
                                    onclick={() => verProducto(t.tempid)}
                                    class="hover:cursor-pointer hover:scale-105"
                                >
                                    <Pencil size="size-6" />
                                </button>
                                <button
                                    onclick={() => eliminarProducto(t.tempid)}
                                    class="hover:cursor-pointer hover:scale-105"
                                >
                                    <Trash size="size-6" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </DetalleProducto>
</Navbar>
