<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson-client';
    import { onMount } from 'svelte';
  
    let { data } = $props();

    // Available projections
    const projections = {
        'Mercator': d3.geoMercator(),
        'Equal Earth': d3.geoEqualEarth(),
        'Natural Earth': d3.geoNaturalEarth1(),
        'Conic Equal Area': d3.geoConicEqualArea(),
        'Azimuthal Equal Area': d3.geoAzimuthalEqualArea()
    };

    // svg Component dimensions
    let width = 800;
    let height = 500;
    
    let selectedProjection = $state('Mercator');
    let projection = $state(d3.geoMercator());
    let pathGenerator = $state();

    function updateProjection() {
      projection
        .fitSize([width, height], data)
        .translate([width / 2, height / 2]);
      
      pathGenerator = d3.geoPath().projection(projection);
    }

    function changeProjection() {
        projection = projections[selectedProjection];
        if (data) updateProjection();
    }

    onMount(() => changeProjection());
</script>
  
<div class="map-container">
    <div class="controls">
        <select bind:value={selectedProjection} onchange={changeProjection}>
        {#each Object.keys(projections) as projName}
            <option value={projName}>{projName}</option>
        {/each}
        </select>
    </div>

    <svg {width} {height}>
        {#if pathGenerator}
        <g class="countries">
            {#each data.features as feature}
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