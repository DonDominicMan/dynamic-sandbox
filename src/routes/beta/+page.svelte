<script>
    import * as d3 from 'd3';
    import * as topojson from 'topojson-client';
    import { onMount } from 'svelte';
    import { tooltip } from '$lib/components/tooltip.js';
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
    let country = $state();
    let hover = $state();

    onMount(() => {
        projection.fitSize([width, height], data);

        pathGenerator = d3.geoPath().projection(projection);
    });
</script>
  
<div class="map-container" >
    <div class="controls">
        <h2 class="viewPoint">ViewPoint: {continent ? continent : 'World'}</h2>
        <button class="zoom-out" onclick={() => {
            continent = null
            hover = null
        }}>
            Zoom Out
        </button>
    </div>

    <svg {width} {height}>
        {#if pathGenerator && !continent}
            <g>
                {#each data.features as feature}
                    {#if !hover}
                        <path
                            d={pathGenerator(feature)}
                            fill={geoColors[feature.properties.Continent_Code]}
                            onpointerenter={feature.properties.Continent_Name !== hover ? () => hover = feature.properties.Continent_Name : null}
                        />
                    {:else if hover && feature.properties.Continent_Name === hover}
                        <path
                            d={pathGenerator(feature)}
                            fill={geoColors[feature.properties.Continent_Code]}
                            stroke="white"
                            stroke-width="0.5px"
                            onpointerup={() => continent = feature?.properties?.Continent_Name || null}
                            onpointerleave={() => hover = null}
                        />
                    {:else}
                        <path
                            d={pathGenerator(feature)}
                            fill={geoColors[feature.properties.Continent_Code]}
                            onpointerenter={() => feature.properties.Continent_Name !== hover ? hover = feature.properties.Continent_Name : null}
                            onpointerleave={() => hover = null}
                        />
                    {/if}
                {/each}
            </g>
        {:else if pathGenerator}
            <g>
                {#each data.features as feature}
                    {#if feature.properties.Continent_Name === continent}
                        <path
                            d={pathGenerator(feature)}
                            fill={geoColors[feature.properties.Continent_Code]}
                            stroke="white"
                            stroke-width="0.5px"
                            onpointerenter={() => hover = feature.properties.name}
                            title={hover} 
                            use:tooltip
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
        justify-content: space-between;
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
        margin: 10px 0 0 30px;
    }

</style>