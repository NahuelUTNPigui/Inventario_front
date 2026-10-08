<!-- src/lib/components/CommandPalette.svelte -->
<script>
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    
    let { isOpen = $bindable(false) } = $props();
    let searchQuery = $state("");
    let selectedIndex = $state(0);
    let inputRef= $state(null);
    
    // Comandos disponibles
    const commands = [
        { id: "inicio", label: "Ir a Inicio",  action: () => goto("/") },
        { id: "clientes", label: "Ver clientes",  action: () => goto("/clientes") },
        { id: "stock", label: "Ver stock",  action: () => goto("/lotes") },
        { id: "historial", label: "Ver historial",  action: () => goto("/historial") },
        { id: "leerqr", label: "Ver QR",  action: () => goto("/loteqr") },
        { id: "movimientos", label: "Ver movimientos",  action: () => goto("/movimientos") },
        { id: "controles", label: "Ver controles",  action: () => goto("/controles") },
        { id: "productos", label: "Ver productos",  action: () => goto("/productos") },
        { id: "unidades", label: "Ver unidades",  action: () => goto("/unidades") },
        { id: "usuarios", label: "Ver usuarios",  action: () => goto("/usuarios") }
    ];
    
    // Filtrar comandos según búsqueda
    let filteredCommands = $derived(
        commands.filter(cmd => 
            cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    
    // Resetear selección cuando cambian los resultados
    $effect(() => {
        selectedIndex = 0;
    });
    
    function handleKeydown(event) {
        if (!isOpen) return;
        
        switch(event.key) {
            case "ArrowDown":
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1);
                break;
            case "ArrowUp":
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                break;
            case "Enter":
                event.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex]);
                }
                break;
            case "Escape":
                event.preventDefault();
                closePalette();
                break;
        }
    }
    
    function executeCommand(command) {
        command.action();
        closePalette();
    }
    
    function closePalette() {
        isOpen = false;
        searchQuery = "";
        selectedIndex = 0;
    }
    
    // Focus automático al abrir
    $effect(() => {
        if (isOpen && inputRef) {
            inputRef.focus();
        }
    });
</script>

{#if isOpen}
    <div 
        tabindex="0"
        class="fixed inset-0 z-50 flex items-start justify-center pt-20"
        onkeydown={handleKeydown}
        role="dialog"
        aria-modal="true"
    >
        <!-- Overlay -->
        <button 
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onclick={closePalette}
        >+</button>
        
        <!-- Command Palette -->
        <div class="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Search Input -->
            <div class="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                    bind:this={inputRef}
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Buscar comando..."
                    class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
                />
                <kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">ESC</kbd>
            </div>
            
            <!-- Commands List -->
            <div class="max-h-96 overflow-y-auto">
                {#if filteredCommands.length === 0}
                    <div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No se encontraron comandos
                    </div>
                {:else}
                    {#each filteredCommands as command, index}
                        <button
                            class={`
                            hover:cursor-pointer
                            w-full flex items-center px-4 py-3 
                            hover:bg-blue-200 dark:hover:bg-gray-700 
                            transition-colors 
                            ${
                                index === selectedIndex ? 'bg-blue-200 dark:bg-gray-700' : ''
                            }`}
                            onclick={() => executeCommand(command)}
                            onmouseenter={() => selectedIndex = index}
                        >
                            
                            <span class="flex-1 text-left text-gray-900 dark:text-white font-medium">
                                {command.label}
                            </span>
                            {#if index === selectedIndex}
                                <span class="text-xs text-gray-400">↵</span>
                            {/if}
                        </button>
                    {/each}
                {/if}
            </div>
            
            <!-- Footer -->
            <div class="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span><kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd> navegar</span>
                    <span><kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd> seleccionar</span>
                </div>
                <span>{filteredCommands.length} comando{filteredCommands.length !== 1 ? 's' : ''}</span>
            </div>
        </div>
    </div>
{/if}