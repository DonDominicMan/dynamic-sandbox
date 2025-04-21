<!-- InteractiveMap.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { mesh } from 'topojson-client';
    import Aside from '$lib/components/aside.svelte';
    const { data } = $props();

    // Get map data
    const { us, states, counties, borders } = data;
    const geoPath = d3.geoPath();

    // Map dimensions
    const width = 975;
    const height = 610;

    // State management
    let hoveredState = $state(null);
    let hoveredCounty = $state(null);
    let selectedState = $state(null);
    let selectedCounty = $state(null);
    let featureCounties = $derived(counties.filter((county) => county.properties.state === selectedState?.properties?.code));

    let isOpen = $state(true);
    let transform = $state(d3.zoomIdentity);
    let zoom = null;

    const toggleSidebar = () => isOpen = !isOpen;

    // Zoom behavior
    $effect(() => d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            transform = event.transform;
        })
    );

    let transformString = $derived(`
        translate(${transform.x} ${transform.y})
        scale(${transform.k})
    `);
    let strokeWidth = $derived(1 / transform.k);
    
    function handleFeatureClick(event, feature, type) {
        console.log(feature);
        event.stopPropagation();
        if(type === 'state'){
            selectedCounty = null;
            selectedState = feature;
        }
        if(type === 'county'){
            selectedCounty = feature;
        }
        
        // Zoom logic
        const [[x0, y0], [x1, y1]] = geoPath.bounds(feature);
        const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        const translate = [-(x0 + x1) / 2, -(y0 + y1) / 2];
        
        transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(...translate);
    }
    
    onMount(() => {
        const svg = d3.select('#map-container svg');
        if(zoom) svg.call(zoom);
    });

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
</script>

<div 
    id="map-container"
    style:display="flex"
    style:justify-content={isOpen ? "right" : "center"}>
    <Aside feature={selectedCounty ?? selectedState} isOpen={isOpen} toggleSidebar={toggleSidebar}/>
    <svg
        viewBox="0 0 {width} {height}"
        width={width}
        height={height}
        style="max-width: 100%; height: auto;"
    >
        <g transform={transformString}>
            <!-- States -->
            {#each states as state}
                <path
                    d={geoPath(state)}
                    fill={hoveredState === state?.properties?.name ? '#666' : '#444'}
                    on:click={(e) => handleFeatureClick(e, state, 'state')}
                    on:mouseover={() => hoveredState = state?.properties?.name}
                    on:mouseout={() => hoveredState = null}
                >
                    <title>{state?.properties?.name}</title>
                </path>
            {/each}

            {#if selectedState}
                <!-- County borders -->
                {#each featureCounties as county}
                    <path
                        d={geoPath(county)}
                        fill={selectedCounty?.properties?.name === county?.properties?.name ? 'blue' : hoveredCounty?.name === county?.properties?.name ? '#666' : '#444'}
                        stroke="white"
                        stroke-width={strokeWidth}
                        on:click={(e) => handleFeatureClick(e, county, 'county')}
                        on:mouseover={() => hoveredCounty = county?.properties}
                        on:mouseout={() => hoveredCounty = null}
                    >
                        <title>{county?.properties?.name}</title>
                    </path>
                {/each}
            {/if}
            
            <!-- State borders -->
            <path
                d={geoPath(borders)}
                fill="none"
                stroke="white"
                stroke-width={strokeWidth}
                stroke-linejoin="round"
            />
        </g>
    </svg>
</div>

<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
</style>