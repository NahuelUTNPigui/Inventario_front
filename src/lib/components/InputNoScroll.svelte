<script>
    let {id="",placeholder = "",value=$bindable(0),clase=""}=$props()
    function noScroll(node) {
        function prevent(event) {
            event.preventDefault();
        }

        node.addEventListener("wheel", prevent);

        return {
            destroy() {
                node.removeEventListener("wheel", prevent);
            },
        };
    }
</script>

<input placeholder={placeholder} type="number" id={id} bind:value={value} use:noScroll class={clase} />
