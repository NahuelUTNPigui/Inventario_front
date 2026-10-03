<script>
    let {filtros=[]}=$props()
</script>
{#if filtros.length>0}
<div class="flex flex-wrap gap-2 my-2">
    {#each filtros as f}
        {#if f.length>0}
            <span class="badge">{f}</span>
        {/if}
    {/each}
</div>
{/if}