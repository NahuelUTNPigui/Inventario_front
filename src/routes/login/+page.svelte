<script>
    import { fade, fly } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { goto } from "$app/navigation";
    import Oscuro from "$lib/components/Oscuro.svelte";
    import Swal from "sweetalert2";
    import PocketBase from "pocketbase";
    import { createStorageProxy } from "$lib/genericos/localstorage";
    let storageNivel = createStorageProxy("nivelUsuario", { nivel: -1 });
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let usuarioname = $state("");
    let contra = $state("");
    let showpass = $state(false);
    function ingresar() {
        goto("/inicio");
    }
    async function keyEvent(e) {
        if (e.code == "Enter") {
            await login();
        }
    }
    async function login() {
        try {

            const authData = await pb
                .collection("users")
                .authWithPassword(usuarioname, contra);

            
            if (pb.authStore.isValid) {
                if (pb.authStore.model.active) {
                    storageNivel.save({ nivel: authData.record.nivel });
                    goto("/inicio");
                }
            }
        } catch (err) {
            console.error(err)
            
            Swal.fire("Error login", "Mal puestas las credenciales", "error");
            storageNivel.save({ nivel: -1 });
        }
    }
</script>

<svelte:window onkeydown={keyEvent} />
<div
    class="min-h-screen bg-gradient-to-br from-red-100 to-red-200 dark:from-gray-900 dark:to-gray-800 p-4"
>
    <div class="flex justify-end m-10">
        <Oscuro></Oscuro>
    </div>
    <div class="flex items-center justify-center">
        <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full"
            in:fly={{ y: 50, duration: 200, easing: quintOut }}
            out:fade
        >
            <h1
                class="text-3xl font-bold text-red-900 dark:text-red-400 mb-6 text-center"
            >
                Bienvenido a InvApp
            </h1>
            <div class="space-y-6">
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="username"
                        bind:value={usuarioname}
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Contraseña
                    </label>
                    <input
                        type={showpass ? "text" : "password"}
                        id="password"
                        bind:value={contra}
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition"
                    />
                    <div class="form-control mt-1 justify-between ">
                        <label class="label cursor-pointer ">
                            <span class="label-text">Mostrar contraseña</span>
                            <input
                                type="checkbox"
                                bind:checked={showpass}
                                class="checkbox"
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <button
                        class={`
                            w-full bg-red-900 dark:bg-red-400 text-white dark:text-gray-800  rounded-md 
                            py-2 px-4 hover:bg-red-400 hover:dark:bg-red-200 focus:outline-none 
                            focus:ring-2 focus:ring-red-300 focus:ring-offset-2 
                            transition
                            hover:cursor-pointer
                            `}
                        onclick={login}
                    >
                        Ingresar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
