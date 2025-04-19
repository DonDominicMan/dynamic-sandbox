<!-- InteractiveGlobe.svelte -->
<script>
    import { onMount } from 'svelte';
    import { zoomerMap } from '$lib/components/rotating-orthographic/zoom.js';
    
    let container;
    let svgElement;
    
    onMount(() => {
        svgElement = zoomerMap();
        container.appendChild(svgElement);
    });
</script>

<div class="usa-container" bind:this={container}>
    <!-- The SVG will be appended here -->
</div>

<style>
    .usa-container {
        display: flex;
        justify-content: center;
    }
    
    .usa-container svg {
        cursor: pointer;
    }
</style>