<!-- InteractiveGlobe.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { createInteractiveGlobe } from '$lib/components/rotating-orthographic/globe.js';
  
    let canvas;
    let globe;
  
    onMount(() => {
      globe = createInteractiveGlobe(canvas);
    });
  
    onDestroy(() => {
      if (globe) globe.destroy();
    });
  </script>
  
<div class="globe-container">
    <canvas 
        bind:this={canvas} 
        width={960}
        height={960}
        style="width: 55%; height: auto; cursor: grab;"
        class:grabbing={globe?.isDragging}
    ></canvas>
</div>
  
  <style>
    .grabbing {
      cursor: grabbing;
    }
    .globe-container {
        display: flex;
        justify-content: center;
    }
  </style>