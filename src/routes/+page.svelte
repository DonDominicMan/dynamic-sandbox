<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson-client';
    import { onMount } from 'svelte';
  
    // Sample world map TopoJSON data URL
    const WORLD_MAP_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  
    // Component dimensions
    let width = 800;
    let height = 500;
  
    let projection = d3.geoMercator();
    let pathGenerator;
    let geoData = null;
  
    // Load the TopoJSON data
    async function loadData() {
      try {
        const response = await fetch(WORLD_MAP_URL);
        const world = await response.json();
        geoData = topojson.feature(world, world.objects.countries);
        updateProjection();
      } catch (error) {
        console.error('Error loading TopoJSON data:', error);
      }
    }
  
    function updateProjection() {
      projection
        .fitSize([width, height], geoData)
        .translate([width / 2, height / 2]);
      
      pathGenerator = d3.geoPath().projection(projection);
    }
  
    onMount(() => {
      loadData();
    });

    // Available projections
    const projections = {
        'Mercator': d3.geoMercator(),
        'Equal Earth': d3.geoEqualEarth(),
        'Natural Earth': d3.geoNaturalEarth1(),
        'Conic Equal Area': d3.geoConicEqualArea(),
        'Azimuthal Equal Area': d3.geoAzimuthalEqualArea()
    };

    let selectedProjection = 'Mercator';

    function changeProjection() {
        projection = projections[selectedProjection];
        if (geoData) updateProjection();
    }

  </script>
  
<div class="map-container">
    <div class="controls">
        <select bind:value={selectedProjection} on:change={changeProjection}>
        {#each Object.keys(projections) as projName}
            <option value={projName}>{projName}</option>
        {/each}
        </select>
    </div>

    <svg {width} {height}>
        {#if geoData}
        <g class="countries">
            {#each geoData.features as feature}
            <path
                d={pathGenerator(feature)}
                fill="#69b3a2"
                stroke="white"
                stroke-width="0.5"
            />
            {/each}
        </g>
        {/if}
    </svg>
</div>


<style>
    .map-container {
        width: 850px;
        margin: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .controls {
        padding: 1rem;
        background: #f5f5f5;
    }
    
    select {
        padding: 0.5rem;
        font-size: 1rem;
    }
</style>