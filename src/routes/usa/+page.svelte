<!-- InteractiveMap.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { mesh } from 'topojson-client';
    import Aside from '$lib/components/aside.svelte';
    const { data } = $props();

    // Get map data
    const { us, states, counties } = data;
    const geoPath = d3.geoPath();

    // Map dimensions
    const width = 975;
    const height = 610;

    // State management
    let hoveredState = $state(null);
    let hoveredCounty = $state(null);
    let selectedState = $state(null);
    let selectedCounty = $state(null);
    let focusState = $state(null);
    let selectedFeatureName = $state("United States of America");
    let featureCounties = $derived(counties.filter((county) => county.properties.state === selectedState?.properties?.code));
    $effect(() => {
        selectedFeatureName = selectedCounty?.properties?.name ||
                              selectedState?.properies?.name || 
                              focusState?.properties?.name || 
                              "United States of America"
    }
    )
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
        event.stopPropagation();
        if(type === 'state'){
            selectedState = feature;
        }
        if(type === 'county'){
            selectedCounty = feature;
        }
        zoomTo(feature);
    }

    function zoomTo(feature) {
        const [[x0, y0], [x1, y1]] = geoPath.bounds(feature);
        const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        const translate = [-(x0 + x1) / 2, -(y0 + y1) / 2];
        
        transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(...translate);
    }

    function handleKeyPress(e, feature, type) {
        e.stopPropagation();
        if(e.key === 'Enter'){
            handleFeatureClick(e, feature, type);
        }
    }

    function handleKeyDown(e, feature, type) {
        e.stopPropagation();
        if(e.key === ' '){
            selectedState = feature;
        }
    }

    function handleKeyUp(e, feature, type) {
        e.stopPropagation();
        if(e.key === ' '){
            selectedState = null;
        } else if(e.key === 'Escape'){
            document.activeElement.blur();
            zoomOut();
        }
    }

    function zoomOut() {
        focusState = null;
        selectedState = null;
        selectedCounty = null;
        zoomTo(us);
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
    style:border="1px solid #ccc"
    style:display="flex"
    style:position="inline"
    style:justify-content={isOpen ? "right" : "center"}
>
    <Aside selectedFeatureName={selectedFeatureName} isOpen={isOpen} toggleSidebar={toggleSidebar}/>   
    <svg
        viewBox="0 0 {width} {height}"
        width={width}
        height={height}
        style="max-width: 100%; height: auto;"
    >
        <g transform={transformString}>
            <!-- States -->
            {#each states as state (state.id)}
                <path
                    role="button"
                    d={geoPath(state)}
                    class="geoState"
                    fill={focusState?.properties?.name === state?.properties?.name ? 'red' : hoveredState === state?.properties?.name ? '#666' : '#444'}
                    stroke="white"
                    stroke-width={strokeWidth}
                    onkeypress={(e) => handleKeyPress(e, state, 'state')}
                    onclick={(e) => handleFeatureClick(e, state, 'state')}
                    onkeydown={(e) => handleKeyDown(e, state, 'state')}
                    onkeyup={(e) => handleKeyUp(e, state, 'state')}
                    onmouseover={(e) => hoveredState = state?.properties?.name}
                    onmouseout={(e) => hoveredState = null}
                    onfocus={(e) => focusState = state}
                    onblur={(e) => focusState = null}
                    tabindex={!selectedState ? state.id : -1}
                >
                    <title>{state?.properties?.name}</title>
                </path>
            {/each}

            {#if selectedState}
                <!-- Counties -->
                {#each featureCounties as county (county.id)}
                    <path
                        role="button"
                        d={geoPath(county)}
                        class="geoCounty"
                        fill={selectedCounty?.properties?.name === county?.properties?.name ? 'blue' : hoveredCounty?.name === county?.properties?.name ? '#666' : '#444'}
                        stroke="white"
                        stroke-width={strokeWidth}
                        onkeypress={(e) => handleKeyPress(e, county, 'county')}
                        onclick={(e) => handleFeatureClick(e, county, 'county')}
                        onkeydown={(e) => handleKeyDown(e, county, 'county')}
                        onkeyup={(e) => handleKeyUp(e, county, 'county')}
                        onmouseover={() => hoveredCounty = county?.properties}
                        onmouseout={() => hoveredCounty = null}
                        onfocus={() => selectedCounty = county}
                        onblur={() => selectedCounty = null}
                        tabindex={county.id}
                    >
                        <title>{county?.properties?.name}</title>
                    </path>
                {/each}
            {/if}
        </g>
    </svg>
</div>

<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }

    #zoomOutContainer{
        position: relative;
    }

    #zoomOutBtn{
        float: inline-end;
    }

    .geoState{
        outline: none !important;
    }
    .geoCounty{
        outline: none !important;
    }
</style>