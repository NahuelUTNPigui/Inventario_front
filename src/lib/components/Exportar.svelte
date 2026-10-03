<script>
    import estilos from "$lib/estilos";
    import Filter from "./svg/Filter.svelte";
    let { data, titulo="", prepararData=(item)=>({...item}), sheetname = "" } = $props();
    import * as XLSX from "xlsx";

    function exportar() {
        let csvdata = data.map(prepararData);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([]);
        ws["A1"] = { t: "s", v: "Inventario ", s: {} };
        ws["C1"] = { t: "s", v: new Date().toLocaleDateString(), s: {} };
        ws["D1"] = { t: "s", v: sheetname, s: {} };
        //const range = XLSX.utils.decode_range('A1:K1');
        //ws['!merges'] = [{ s: { r: range.s.r, c: range.s.c }, e: { r: range.e.r, c: range.e.c } }];
        XLSX.utils.sheet_add_json(ws, csvdata, { origin: "A3" });
        XLSX.utils.book_append_sheet(wb, ws, sheetname);
        XLSX.writeFile(wb, `${titulo.replace(/\//g, "-")}.xlsx`, {
            cellStyles: true,
        });
    }
</script>

<button
    class={`
            hover:cursor-pointer
            border rounded-full px-3 py-1 text-md flex items-center gap-1
            bg-white  border-gray-300  hover:bg-gray-300 dark:bg-transparent 
            dark:hover:bg-gray-600 dark:border-gray-600 dark:text-white
        `}
    onclick={exportar}
>
    <Filter size="size-4" />
    Exportar
</button>
