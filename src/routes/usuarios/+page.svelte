<script>
    //import usuarios from "$lib/genericos/usuarios";
    import Navbar from "$lib/components/Navbar.svelte";
    import TablaUsuarios from "$lib/components/usuarios/TablaUsuarios.svelte";
    import Buscador from "$lib/components/usuarios/Buscador.svelte";
    import Swal from "sweetalert2";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import PocketBase from "pocketbase";
    import ListaUsuarios from "$lib/components/usuarios/ListaUsuarios.svelte";
    import Cargando from "$lib/components/Cargando.svelte";

    let cargado = $state(false);

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let buscar = $state("");
    let usuarios = $state([]);
    let usuariosrows = $state([]);
    let nivellogged = $state(0);
    function filterUpdate() {
        usuariosrows = usuarios;
        if (buscar != "") {
            usuariosrows = usuariosrows.filter((t) =>
                t.nombre
                    .toLocaleLowerCase()
                    .includes(buscar.toLocaleLowerCase()),
            );
        }
    }
    let defaultusuario = {
        id: "",
        nombre: "",
        apellido: "",
        correo: "",
        rol: "",
        nivel: 0,
        edit: false,
    };
    let detalleusuario = $state(defaultusuario);
    let storageUsuario = createStorageProxy("detalleusuario", defaultusuario);
    function openNew() {
        storageUsuario.save(defaultusuario);
        goto("/usuarios/0");
    }
    function openViewModal(p_id) {
        let c_idx = usuarios.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = usuarios[c_idx];
            detalleusuario = {
                id: c.id,
                nombre: c.name,
                correo: c.correo,
                apellido: c.apellido,

                nivel: c.nivel,
                edit: false,
            };
            storageUsuario.save(detalleusuario);
            goto("/usuarios/" + c.id);
        }
    }
    function openEditModal(p_id) {
        let c_idx = usuarios.findIndex((u) => u.id == p_id);
        if (c_idx != -1) {
            let c = usuarios[c_idx];
            detalleusuario = {
                id: c.id,
                nombre: c.name,
                correo: c.correo,
                apellido: c.apellido,

                nivel: c.nivel,
                edit: true,
            };
            storageUsuario.save(detalleusuario);
            goto("/usuarios/" + c.id);
        }
    }
    async function eliminar(p_id) {
        let data = {
            active: false,
        };
        try {
            let recordc = await pb.collection("users").update(p_id, data);
            await getData();
            filterUpdate();
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el usuario`,
                "success",
            );
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
        if (nivellogged < 1) {
            Swal.fire(
                "Error permisos",
                "No tienes permisos para eliminar el usuario",
                "error",
            );
            return;
        }
        Swal.fire({
            title: "Eliminar usuario",
            text: "¿Seguro que deseas eliminar el usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await eliminar(p_id);
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el usuario con éxito",
                    "success",
                );
            }
        });
    }
    async function getData() {
        let user = JSON.parse(localStorage["pocketbase_auth"]);
        nivellogged = user.record.nivel;
        const recordsu = await pb.collection("users").getFullList({
            filter: `active = true`,
        });

        usuarios = recordsu.map((c) => ({ ...c }));
        cargado = true;
    }
    onMount(async () => {
        await getData();
        filterUpdate();
    });
</script>

<Navbar>
    <Buscador bind:buscar {filterUpdate} nuevo={openNew} />
    {#if cargado}
        <!--Tabla-->
        <div
            class={`
                hidden w-full xl:w-3/4 md:grid
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
                <TablaUsuarios
                    {usuariosrows}
                    {openDelModal}
                    {openEditModal}
                    {openViewModal}
                />
            </div>
        </div>
        <!--Celular-->
        <div
            class={`
            md:hidden
            w-full grid grid-cols-1
            mx-auto py-3 px-4 max-w-7xl
        `}
        >
            <ListaUsuarios
                {usuariosrows}
                {openDelModal}
                {openEditModal}
                {openViewModal}
            />
        </div>
    {:else}
        <Cargando />
    {/if}
</Navbar>
