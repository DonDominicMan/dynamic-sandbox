<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson-client';
    import { onMount } from 'svelte';
    const geoColors = {
        AF: '#1f78b4',
        AN: '#666666',
        AS: '#b2df8a',
        EU: '#33a02c',
        OC: '#fb9a99',
        NA: '#e31a1c',
        SA: '#fdbf6f', 
        UND: '#a6cee3'
    }
    const { data } = $props();
    const width = 1200;
    const height = 700;
    const selectedProjection = 'Natural Earth';
    const projection = d3.geoNaturalEarth1();
    let pathGenerator = $state();
    let geoData = $state();
    let continent = $state();

    function zoom() {
        
    }
    
    onMount(() => {
        projection
            .fitSize([width, height], data)
            .translate([width / 2, height / 2]);
            
            pathGenerator = d3.geoPath().projection(projection);
    });
</script>
  
<div class="map-container" >
    <div class="controls">
        <button class="zoom-out">
            Zoom Out
        </button>
        <h2 class="viewPoint">ViewPoint: {continent ? continent : 'World'}</h2>
    </div>

    <svg {width} {height}>
        {#if pathGenerator}
        <g class="countries">
            {#each data.features as feature}
                {#if continent && feature.properties.Continent_Name === continent || (!continent && feature?.properties?.Continent_Name === undefined)}
                    <path
                        d={pathGenerator(feature)}
                        fill={geoColors[feature.properties.Continent_Code]}
                        stroke="white"
                        stroke-width="0.5px"
                        onpointerup={zoom}
                        onpointerleave={() => continent = null}
                    />
                {:else}
                    <path
                        d={pathGenerator(feature)}
                        fill={geoColors[feature.properties.Continent_Code]}
                        onpointerenter={() => feature.properties.Continent_Name !== continent ? continent = feature.properties.Continent_Name : null}
                    />
                {/if}
            {/each}
        </g>
        {/if}
    </svg>
</div>

<style>
    .map-container {
        margin: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .controls {
        padding: 1rem;
        background: #f5f5f5;
        display: flex;
    }

    .ocean {
        background-color: lightskyblue;
    }

    path:hover {
        cursor: pointer;
    }

    .zoom-out {
        margin: 0 0 0 15px;
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