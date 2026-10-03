<script>
    import Cargando from "$lib/components/Cargando.svelte";

    //import unidades from "$lib/genericos/unidades";
    import Navbar from "$lib/components/Navbar.svelte";
    import Buscador from "$lib/components/unidades/Buscador.svelte";
    import ListaUnidades from "$lib/components/unidades/ListaUnidades.svelte";
    import NuevaUnidad from "$lib/components/unidades/NuevaUnidad.svelte";
    import PocketBase from "pocketbase";
    import { onMount } from "svelte";
    import Swal from "sweetalert2";
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let cargado = $state(false);
    let buscar = $state("");
    let unidades = $state([]);
    let unidadesrows = $state([]);
    let idunidad = $state("");
    let nombreunidad = $state("");
    let isOpenForm = $state(false);
    function filterUpdate() {
        unidadesrows = unidades;
        if (buscar != "") {
            unidadesrows = unidadesrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
    }
    function openNew() {
        isOpenForm = true;
        idunidad = "";
        nombreunidad = "";
    }
    function openEdit(p_id) {
        let u_idx = unidadesrows.findIndex((u) => u.id == p_id);
        if (u_idx != -1) {
            isOpenForm = true;
            let u = unidadesrows[u_idx];
            nombreunidad = u.nombre;
            idunidad = u.id;
        }
    }
    async function guardar() {
        if (nombreunidad.length == 0) {
            Swal.fire(
                "Error nombre",
                "No se pueden guardar unidades sin nombre",
                "info",
            );
            return;
        }
        if (idunidad == "") {
            let u = {
                nombre: nombreunidad,
                active: true,
            };
            try {
                await pb.collection("unidades").create(u);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar la unidad`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error guardar",
                    `No se logró registar la unidad`,
                    "error",
                );
            }
        } else {
            let u_idx = unidades.findIndex((u) => u.id == idunidad);
            if (u_idx != -1) {
                let data = {
                    nombre: nombreunidad,
                };
                let u = unidades[u_idx];
                try {
                    await pb.collection("unidades").update(u.id, data);
                    Swal.fire(
                        "Éxito editar",
                        `Se logró editar la unidad`,
                        "success",
                    );
                } catch (err) {
                    Swal.fire(
                        "Error editar",
                        `No se logró editar la unidad`,
                        "error",
                    );
                }
            }
        }
        openNew();
        await getData();
        filterUpdate();
        isOpenForm = false;
    }
    function openDelModal(p_id) {
        Swal.fire({
            title: "Eliminar unidad",
            text: "¿Seguro que deseas eliminar la unidad?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar la unidad con éxito",
                    "success",
                );
            }
        });
    }
    async function eliminar(p_id) {
        let u_idx = unidades.findIndex((u) => u.id == p_id);
        if (u_idx != -1) {
            let data = {
                active: false,
            };
            let u = unidades[u_idx];
            try {
                await pb.collection("unidades").update(u.id, data);
                Swal.fire(
                    "Éxito eliminar",
                    `Se logró eliminar la unidad`,
                    "success",
                );
            } catch (err) {
                Swal.fire(
                    "Error eliminar",
                    `No se logró eliminar la unidad`,
                    "error",
                );
            }
            openNew();
            await getData();
            filterUpdate();
        }
    }
    async function getData() {
        const recordsc = await pb.collection("unidades").getFullList({
            filter: `active = true`,
            sort: "nombre",
        });

        unidades = recordsc.map((c) => ({ ...c }));
        cargado = true;
    }
    onMount(async () => {
        await getData();
        filterUpdate();
    });
</script>

<Navbar>
    <Buscador bind:buscar {filterUpdate} data={unidadesrows} />

    <NuevaUnidad
        {idunidad}
        bind:nombreunidad
        limpiar={openNew}
        nuevo={guardar}
        editar={guardar}
    />
    {#if cargado}
        <!--Tabla-->
        <div
            class={`
                w-full xl:w-3/4 md:grid
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
                <ListaUnidades
                    {unidadesrows}
                    openEditModal={openEdit}
                    {openDelModal}
                />
            </div>
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
