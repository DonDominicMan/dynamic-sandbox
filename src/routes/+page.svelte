<!-- Globe.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { createVisualization } from '$lib/components/rotating-orthographic/2618664daf73ab84@90.js';
  
    let canvas;
    let viz;
  
    onMount(() => {
      viz = createVisualization(canvas);
      viz.start();
    });
  
    onDestroy(() => {
      if (viz) viz.stop();
    });
</script>
  

<div class="globe-container">
    <canvas 
        bind:this={canvas} 
        width={960} 
        height={960} 
        style="width: 55%; height: auto;" 
    ></canvas>
</div>

<style>
    .globe-container {
        display: flex;
        justify-content: center;
    }
</style>