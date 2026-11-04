<script>
//No se usa pero sirve como template
    import FilterPill from "./FilterPill.svelte";

    let {filtros} = $props()
</script>
<div class="flex flex-row">
    {#each filtros as f}
        <FilterPill
            etiqueta={f.etiqueta}
            valor={f.valor}
        />
    {/each}
</div>