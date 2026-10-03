<script>
    import { slide } from "svelte/transition";
    import estilos from "$lib/estilos";
    import Oscuro from "./Oscuro.svelte";
    import Home from "./svg/Home.svelte";
    import Menu from "./svg/Menu.svelte";
    import Xmark from "./svg/Xmark.svelte";
    import Grupos from "./svg/Grupos.svelte";
    import Clientes from "./svg/Clientes.svelte";
    import Lotes from "./svg/Lotes.svelte";
    import Historial from "./svg/Historial.svelte";
    import LeerQR from "./svg/LeerQR.svelte";
    import Movimientos from "./svg/Movimientos.svelte";
    import Productos from "./svg/Productos.svelte";
    import Unidades from "./svg/Unidades.svelte";
    import Usuarios from "./svg/Usuarios.svelte";
    import PocketBase from "pocketbase";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import Control from "./svg/Control.svelte";
    //tamaño
    let innerWidth = $state(0);
    let innerHeight = $state(0);
    let esCelu = $derived(innerWidth <= 1100);
    let ruta = import.meta.env.VITE_RUTA;
    const pb = new PocketBase(ruta);
    let { children } = $props();
    let pageurl = $page.url.pathname;
    const menuItems = [
        { id: "inicio", icon: Home, label: "Inicio", href: "/inicio" },
        //{
        //    id: "agrupamientos",
        //    icon: Grupos,
        //    label: "Grupos",
        //    href: "/agrupamientos",
        //},
        {
            id: "clientes",
            icon: Clientes,
            label: "Clientes",
            href: "/clientes",
        },
        { id: "lotes", icon: Lotes, label: "Stock", href: "/lotes" },
        {
            id: "historial",
            icon: Historial,
            label: "Historial",
            href: "/historial",
        },
        //{ id: "loteqr", icon: LeerQR, label: "Leer QR", href: "/loteqr" },
        {
            id: "movimientos",
            icon: Movimientos,
            label: "Movimientos",
            href: "/movimientos",
        },
        {
            id: "controles",
            icon: Control,
            label: "Controles",
            href: "/controles",
        },
        {
            id: "productos",
            icon: Productos,
            label: "Productos",
            href: "/productos",
        },
        {
            id: "unidades",
            icon: Unidades,
            label: "Unidades",
            href: "/unidades",
        },
        {
            id: "usuarios",
            icon: Usuarios,
            label: "Usuarios",
            href: "/usuarios",
        },
    ];
    let sidebar = $state(false);
    let nombreuser = $state("");
    let letra = $derived(nombreuser.length > 0 ? nombreuser[0] : "");
    let contentwidth = estilos.contentwidth;
    let color = estilos.light_color;
    let darkcolor = estilos.dark_color;
    let menuAbierto = $state(false);
    function salir() {
        pb.authStore.clear();
        goto("/");
    }
    function toggleSidebar() {
        sidebar = !sidebar;
    }
    function closeSidebar() {
        sidebar = false;
    }
    function handleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            closeSidebar();
        }
    }
    function toggleMenu() {
        menuAbierto = !menuAbierto;
    }
    onMount(async () => {
        let nologeado = undefined == localStorage["pocketbase_auth"];
        if (nologeado) {
            const authData = await pb
                .collection("users")
                .authWithPassword("nahuel@egeo.com", "inventario12345");
            goto("/inicio");
        } else {
            let user = JSON.parse(localStorage["pocketbase_auth"]).record;
            nombreuser = user.name + ", " + user.apellido;
        }
    });
    let mainclassnavbar = `
        min-h-screen transition-colors duration-300 
        dark:bg-slate-900 bg-red-50
    `;
    let navclass = `
        shadow-lg border-b fixed w-full top-0 z-50 transition-colors duration-300 
        dark:bg-slate-800 dark:border-slate-700
        bg-white border-red-200
    `;
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<!--Escritorio-->
<div
    class={`
        hidden 2xl:block min-h-screen
        
    `}
>
    <!--Navbarr-->
    <nav class={navclass}>
        <div class={contentwidth}>
            <div class="flex justify-between items-center h-16 w-full">
                <div class="flex items-center">
                    <a href="/inicio" class="hover:scale-105">
                        <h1
                            class={`
                                text-xl font-bold transition-colors duration-10
                                text-gray-700 dark:text-gray-300
                            `}
                        >
                            InvApp
                        </h1>
                    </a>
                </div>
                <!--Elementos del navbar derecho -->
                <div class="flex items-center justify-end space-x-4 flex-1">
                    <!--Toggle Dark Mode-->
                    <Oscuro></Oscuro>
                    <!--Nombre del usuario-->

                    <!--<div class={`h-8 w-8 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center shadow-md`}>
                        <span class="text-dark dark:text-white  text-sm font-medium">{letra}</span>
                    </div>-->
                    <div class="relative">
                        <!-- Botón del usuario -->
                        <button
                            onclick={toggleMenu}
                            class={`
                                hover:scale-105 
                                transition duration-100
                                cursor-pointer
                                h-8 w-8 bg-gradient-to-r 
                                from-${color}-200 to-${color}-300 
                                rounded-full flex items-center 
                                justify-center shadow-md focus:outline-none
                            `}
                        >
                            <span
                                class="text-slate-800 dark:text-white text-sm font-medium"
                                >{letra}</span
                            >
                        </button>

                        <!-- Dropdown -->
                        {#if menuAbierto}
                            <div
                                class={`

                                    absolute right-0 mt-2 w-40
                                    dark:bg-gray-800 dark:border-gray-700
                                    bg-white border-gray-200
                                    rounded-md shadow-lg z-50
                                `}
                            >
                                <!-- Podés agregar más opciones si querés -->
                                <div
                                    class={`
                                        
                                        block w-full text-left 
                                        px-4 py-2 text-sm 
                                        dark:text-gray-100 text-gray-700
                                        dark:hover:bg-gray-700 hover:bg-gray-100
                                        
                                    `}
                                >
                                    {nombreuser}
                                </div>
                                <button
                                    class={`
                                        cursor-pointer
                                        block w-full text-left 
                                        px-4 py-2 text-sm 
                                        dark:text-gray-100 text-gray-700
                                        dark:hover:bg-gray-700 hover:bg-gray-100
                                        
                                    `}
                                    onclick={salir}
                                >
                                    Salir
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <!--Sidebar -->
    <div
        class={`
            fixed top-18 left-0 h-full w-64 shadow-xl z-50 
            transform transition-all duration-300 ease-in-out 
            dark:bg-slate-800 dark:border-r dark:border-slate-700
            bg-white border-r border-red-100
            translate-x-0 
        `}
    >
        <!--CONTENIDO DEL SIDEBER-->
        <div class="p-4">
            <!--Elemento del menu-->
            <nav class="space-y-2">
                {#each menuItems as item, index}
                    <a
                        key={index}
                        href={`${item.href}`}
                        class={`
                            flex items-center space-x-3 px-3 
                            py-2 rounded-md transition-colors 
                            duration-200 group 
                            ${
                                pageurl.includes(item.id)
                                    ? `dark:bg-red-900 dark:text-white bg-red-900 text-white`
                                    : `dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white text-gray-700 hover:bg-red-100 hover:text-red-800`
                            }
                        `}
                        onclick={closeSidebar}
                    >
                        <item.icon
                            class={`
                                h-5 w-5 
                                transition-colors duration-200 
                                dark:text-slate-400 dark:group-hover:text-white
                                text-red-500 group-hover:text-red-800
                            `}
                        />
                        <span class="font-medium">{item.label}</span>
                    </a>
                {/each}
            </nav>
            <!--Separador-->
            <div
                class={`
                    my-6 border-t transition-colors 
                    duration-300 
                    dark:border-${darkcolor}-700
                    border-${color}-200
                `}
            ></div>
            <!--Boton cerrar sesion-->

            <button
                class={`
                    w-full flex items-center 
                    space-x-3 px-3 py-2 
                    rounded-md transition-colors 
                    duration-200 
                    cursor-pointer
                    dark:text-red-400 dark:hover:bg-red-900/20
                    text-red-600 hover:bg-red-50
                    
                `}
                onclick={salir}
            >
                <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
                <span class="font-medium">Cerrar Sesión</span>
            </button>
        </div>
    </div>
    <!--Contenido principal -->
    <main class="pt-16">
        <div class={contentwidth}>
            {@render children()}
        </div>
    </main>
</div>

<!--Celular-->
<div
    class={`
        2xl:hidden 
        
    `}
>
    <div class={` ${mainclassnavbar}`}>
        <!--Navbarr-->
        <nav class={navclass}>
            <div class={contentwidth}>
                <div class="flex justify-between items-center h-16 w-full">
                    <!--Logo y botón hamburguesa Izquierda-->
                    <div class="flex items-center space-x-4 flex-1">
                        <button
                            onclick={toggleSidebar}
                            class={`
                            cursor-pointer
                            p-2 rounded-md  flex items-center gap-2
                            focus:outline-none focus:ring-2 
                            focus:ring-${color}-500 transition-colors 
                            duration-100 
                       bg-cf-bg `}
                            aria-label="Abrir menú"
                        >
                            <Menu />
                            <span class="hidden md:inline font-medium"
                                >Menú</span
                            >
                        </button>
                        <div class="flex items-center">
                            <a href="/inicio" class="hover:scale-105">
                                <h1
                                    class={`
                                text-xl font-bold transition-colors duration-10
                                text-gray-700 dark:text-gray-300
                            `}
                                >
                                    InvApp
                                </h1>
                            </a>
                        </div>
                    </div>
                    <!--Elementos del navbar derecho -->
                    <div class="flex items-center justify-end space-x-4 flex-1">
                        <!--Toggle Dark Mode-->
                        <Oscuro></Oscuro>
                        <!--Nombre del usuario-->

                        <!--<div class={`h-8 w-8 bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center shadow-md`}>
                        <span class="text-dark dark:text-white  text-sm font-medium">{letra}</span>
                    </div>-->
                        <div class="relative">
                            <!-- Botón del usuario -->
                            <button
                                onclick={toggleMenu}
                                class={`
                                hover:scale-105 
                                transition duration-100
                                cursor-pointer
                                h-8 w-8 bg-gradient-to-r 
                                from-${color}-200 to-${color}-300 
                                rounded-full flex items-center 
                                justify-center shadow-md focus:outline-none
                            `}
                            >
                                <span
                                    class="text-slate-800 dark:text-white text-sm font-medium"
                                    >{letra}</span
                                >
                            </button>

                            <!-- Dropdown -->
                            {#if menuAbierto}
                                <div
                                    class={`

                                    absolute right-0 mt-2 w-40
                                    dark:bg-gray-800 dark:border-gray-700
                                    bg-white border-gray-200
                                    rounded-md shadow-lg z-50
                                `}
                                >
                                    <!-- Podés agregar más opciones si querés -->
                                    <div
                                        class={`
                                        
                                        block w-full text-left 
                                        px-4 py-2 text-sm 
                                        dark:text-gray-100 text-gray-700
                                        dark:hover:bg-gray-700 hover:bg-gray-100
                                        
                                    `}
                                    >
                                        {nombreuser}
                                    </div>
                                    <button
                                        class={`
                                        cursor-pointer
                                        block w-full text-left 
                                        px-4 py-2 text-sm 
                                        dark:text-gray-100 text-gray-700
                                        dark:hover:bg-gray-700 hover:bg-gray-100
                                        
                                    `}
                                        onclick={salir}
                                    >
                                        Salir
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <!--Overlay -->
        {#if sidebar}
            <!-- Overlay con div (Recomendado) -->
            <div
                class="fixed inset-0 bg-black/50 z-40 cursor-pointer"
                onclick={closeSidebar}
                onkeydown={handleKeydown}
                role="button"
                tabindex="0"
                aria-label="Cerrar menú lateral"
            ></div>
        {/if}
        <!--Sidebar -->
        <div
            class={`
            fixed top-0 left-0 h-full w-64 shadow-xl z-50 
            transform transition-all duration-300 ease-in-out 
            dark:bg-slate-800 dark:border-r dark:border-slate-700
            bg-white border-r border-red-100
            ${sidebar ? "translate-x-0" : "-translate-x-full"} 
        `}
        >
            <!--Header Sidebar -->
            <div
                class={`
                flex items-center justify-between 
                p-4 border-b transition-colors duration-300
                dark:border-slate-700 border-red-200
            `}
            >
                <h2
                    class={`
                    text-lg font-semibold 
                    transition-colors 
                    duration-100 dark:text-white
                    text-gray-800
                `}
                >
                    Menú
                </h2>
                <button
                    onclick={closeSidebar}
                    class={`
                    p-2 rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-red-500 
                    transition-colors duration-200
                    dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700
                    text-red-600 hover:text-red-800 hover:bg-red-100
                    hover:cursor-pointer
                `}
                    aria-label="Cerrar menú"
                >
                    <Xmark />
                </button>
            </div>
            <!--CONTENIDO DEL SIDEBER-->
            <div class="p-4">
                <!--Elemento del menu-->
                <nav class="space-y-2">
                    {#each menuItems as item, index}
                        <a
                            key={index}
                            href={`${item.href}`}
                            class={`
                            flex items-center space-x-3 px-3 
                            py-2 rounded-md transition-colors 
                            duration-200 group 
                            ${
                                pageurl.includes(item.id)
                                    ? `dark:bg-red-900 dark:text-white bg-red-900 text-white`
                                    : `dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white text-gray-700 hover:bg-red-100 hover:text-red-800`
                            }
                        `}
                            onclick={closeSidebar}
                        >
                            <item.icon
                                class={`
                                h-5 w-5 
                                transition-colors duration-200 
                                dark:text-slate-400 dark:group-hover:text-white
                                text-red-500 group-hover:text-red-800
                            `}
                            />
                            <span class="font-medium">{item.label}</span>
                        </a>
                    {/each}
                </nav>
                <!--Separador-->
                <div
                    class={`
                    my-6 border-t transition-colors 
                    duration-300 
                    dark:border-${darkcolor}-700
                    border-${color}-200
                `}
                ></div>
                <!--Boton cerrar sesion-->

                <button
                    class={`
                    w-full flex items-center 
                    space-x-3 px-3 py-2 
                    rounded-md transition-colors 
                    duration-200 
                    cursor-pointer
                    dark:text-red-400 dark:hover:bg-red-900/20
                    text-red-600 hover:bg-red-50
                    
                `}
                    onclick={salir}
                >
                    <svg
                        class="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    <span class="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
        <!--Contenido principal -->
        <main class="pt-16">
            <div class={contentwidth}>
                {@render children()}
            </div>
        </main>
    </div>
</div>
