<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    import { onMount } from "svelte";
    import CardDetalle from "$lib/components/usuarios/CardDetalle.svelte";
    import Detalle from "$lib/components/usuarios/Detalle.svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";

    import PocketBase from "pocketbase";
    import ScanQRCode from "@kuiper/svelte-scan-qrcode/src/lib/components/ScanQRCode.svelte";

    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    //Size
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1250);
    //Storage
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
    //Storage
    
    //Data
    let idmiusuario = $state("");
    let id = $state("");
    let nombre = $state("");
    let apellido = $state("");
    let nivel = $state("");
    let correo = $state("");
    let contraseña = $state("");
    let contraNueva = $state("");
    let contraVieja = $state("");

    let rol = $state("");
    let edit = $state(false);
    let add = $state(false);
    let cargado = $state(false);
    // logeado
    let nivellogged = $state(0);
    function getData() {
        let user = JSON.parse(localStorage["pocketbase_auth"]);
        nivellogged = user.record.nivel;
        idmiusuario = user.record.id;
        detalleusuario = storageUsuario.load();

        id = detalleusuario.id;
        nombre = detalleusuario.nombre;
        apellido = detalleusuario.apellido;
        correo = detalleusuario.correo;
        nivel = detalleusuario.nivel;
        rol = detalleusuario.rol;
        edit = detalleusuario.edit;
        let slug = page.params.slug;
        if (slug == "0") {
            add = true;
            edit = true;
        }
        cargado = true;
    }
    function volver() {
        goto("/usuarios");
    }
    async function  guardarContra() {
        let data = {
            oldPassword: contraVieja,
            password: contraNueva,
            passwordConfirm: contraNueva,
        };
        try {
            let recordc = await pb.collection("users").update(id, data);
            Swal.fire(
                "Éxito cambio contraseña",
                `Se logró cambiar la contraseña`,
                "success",
            );
        } catch (err) {
            Swal.fire(
                "Error cambio contraseña",
                `No se logró cambiar la contraseña`,
                "error",
            );
        } finally {
            volver();
        }
    }
    async function confirmContra() {
        if (nivellogged < 1) {
            Swal.fire(
                "Error permisos",
                "No tienes permisos para editar la contraseña",
                "error",
            );
            return;
        }
        Swal.fire({
            title: "Editar contraseña ",
            text: "¿Seguro que deseas editar la contraseña?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.value) {
                await guardarContra();
                
            }
        });
    }
    async function guardarUsuario() {
        if (nivellogged < 1) {
            Swal.fire(
                "Error permisos",
                "No tienes permisos para editar el usuario",
                "error",
            );
            return;
        }
        if (nombre.length == 0) {
            Swal.fire("Error nombre", "Debe escribir un nombre", "error");
            return;
        }
        if (apellido.length == 0) {
            Swal.fire("Error apellido", "Debe escribir un apellido", "error");
            return;
        }

        if (id.length > 0 && !add) {
            await editarUsuario();
        } else {
            if (contraseña.length == 0) {
                Swal.fire(
                    "Error contraseña",
                    "Debe escribir una contraseña",
                    "error",
                );
                return;
            }
            let numeroaleatorio = Math.floor(10 + Math.random() * 90);
            let correo =
                nombre.toLocaleLowerCase() +
                apellido.toLocaleLowerCase() +
                numeroaleatorio +
                "@egeo.com";
            let data = {
                name: nombre,
                apellido,
                nivel,
                email: correo,
                correo,
                active: true,
                password: contraseña,
                passwordConfirm: contraseña,
            };
            try {
                let recordc = await pb.collection("users").create(data);
                Swal.fire(
                    "Éxito guardar",
                    `Se logró registar el usuario. Revise el correo creado porque se crea con numeros`,
                    "success",
                );
            } catch (err) {
                console.error(err);
                Swal.fire(
                    "Error guardar",
                    `No se logró registar el usuario`,
                    "error",
                );
            } finally {
                volver();
            }
        }
    }
    async function editarUsuario() {
        let data = {
            name: nombre,
            apellido,
            nivel,
        };
        try {
            let recordc = await pb.collection("users").update(id, data);
            Swal.fire("Éxito editar", `Se logró editar el usuario`, "success");
        } catch (err) {
            Swal.fire(
                "Error edición",
                `No se logró editar el usuario`,
                "error",
            );
        } finally {
            volver();
        }
    }
    async function eliminar() {
        let data = {
            active: false,
        };

        try {
            let recordc = await pb.collection("users").update(id, data);
            Swal.fire(
                "Éxito eliminar",
                `Se logró eliminar el usuario`,
                "success",
            );
            volver();
        } catch (err) {
            Swal.fire(
                "Error eliminar",
                `No se logró eliminar el usuario`,
                "error",
            );
        }
    }

    function openDelModal() {
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
                await eliminar();
                Swal.fire(
                    "Éxito eliminar",
                    "Se pudo eliminar el usuario con éxito",
                    "success",
                );
            }
        });
    }
    onMount(() => {
        getData();
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Navbar>
    <CardDetalle {add} {nombre}>
        {#if cargado}
            <Detalle
                bind:nombre
                bind:apellido
                bind:rol
                bind:nivel
                bind:contra={contraseña}
                bind:contraNueva
                bind:contraVieja
                {correo}
                {add}
                {id}
                {edit}
                guardar={guardarUsuario}
                eliminar={openDelModal}
                {volver}
                guardarContra={confirmContra}
            />
        {/if}
    </CardDetalle>
</Navbar>
