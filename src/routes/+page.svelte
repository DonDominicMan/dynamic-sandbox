<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson-client';
    import { onMount } from 'svelte';

    // Available projections
    const projections = {
        'Mercator': d3.geoMercator(),
        'Equal Earth': d3.geoEqualEarth(),
        'Natural Earth': d3.geoNaturalEarth1(),
        'Conic Equal Area': d3.geoConicEqualArea(),
        'Azimuthal Equal Area': d3.geoAzimuthalEqualArea()
    };

    const geoColors = {
        AF: '#a6cee3',
        AN: '#1f78b4',
        AS: '#b2df8a',
        EU: '#33a02c',
        OC: '#fb9a99',
        NA: '#e31a1c',
        SA: '#fdbf6f', 
        UND: '#666666'
    }

    let { data } = $props();

    // svg Component dimensions
    let width = 1200;
    let height = 700;
        
    let geoData = $state(data);
    let selectedProjection = $state('Natural Earth');
    let projection = $state(d3.geoNaturalEarth1());
    let continent = $state();
    let pathGenerator = $state();

    function updateProjection() {
      projection
        .fitSize([width, height], geoData)
        .translate([width / 2, height / 2]);
      
      pathGenerator = d3.geoPath().projection(projection);
    }

    function changeProjection() {
        projection = projections[selectedProjection];
        if (geoData) updateProjection();
    }

    function zoom(feature) {
        const cc = feature.properties?.Continent_Code;
        geoData = {
            ...geoData, 
            features: geoData.features.filter((c) => c.properties?.Continent_Code === cc)
        }
        changeProjection();
    }

    function zoomOut() {
        geoData = data;
        changeProjection();
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
        <h2 class="viewPoint">ViewPoint: {continent ? continent : 'World'}</h2>
        <button class="zoom-out" onclick={zoomOut}>
            Zoom Out
        </button>
    </div>

    <svg {width} {height} class="ocean">
        {#if pathGenerator}
        <g class="countries">
            {#each geoData.features as feature}
                <path
                    d={pathGenerator(feature)}
                    fill={geoColors[feature.properties.Continent_Code]}
                    stroke="white"
                    stroke-width="0.5"
                    onpointerup={() => zoom(feature)}
                    onpointerenter={() => feature.properties.Continent_Name !== continent ? continent = feature.properties.Continent_Name : null}
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
        display: flex;
    }
    
    select {
        padding: 0.5rem;
        font-size: 1rem;
    }

    .ocean {
        background-color: lightskyblue;
    }

    .zoom-out {
        margin: 0 0 0 30px;
        height: 50px;
        width: 150px;
        border-radius: 8px;
    }

    .zoom-out:hover {
        cursor: pointer;
        background-color: #ccc;
    }

    .viewPoint {
        margin: 0 0 0 30px;
    }

</style>