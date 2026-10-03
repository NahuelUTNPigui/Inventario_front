<script>
    import { getNombreLista } from "$lib/genericos/strings";

    import estilos from "$lib/estilos";
    let {
        nombre = $bindable(""),
        codigo = $bindable(""),
        cliente ="",
        clientes= []
    } = $props()
</script>

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
                Nombre</span
            >
        </label>
        <label class="input-group">
            <input
                id="nombre"
                type="text"
                class={`input input-bordered w-full ${estilos.bgdark}`}
                bind:value={nombre}
            />
        </label>
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
        <label for="codigo" class="label mb-0 pb-0">
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
                id="codigo"
                type="text"
                class={`input input-bordered w-full ${estilos.bgdark}`}
                bind:value={codigo}
            />
        </label>
    </div>
    <div class="mb-1 lg:mb-0 col-span-2 lg:col-span-1">
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
        <label
            for="cliente"
            class={`text-lg tracking-wide ${estilos.labelcolor} py-0 my-0 px-3`}
        >
            {getNombreLista(cliente, clientes)}
        </label>
    </div>
</div>
