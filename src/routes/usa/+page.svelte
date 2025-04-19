<!-- InteractiveMap.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import Aside from '$lib/components/aside.svelte';
    const { data } = $props();

    // State management
    let hoveredState = $state(null);
    let selectedState = $state(null);
    let isOpen = $state(false);
    let transform = $state(d3.zoomIdentity);
    let zoom = null;

    const toggleSidebar = () => isOpen = !isOpen;

    // Zoom behavior
    $effect(() => d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
        transform = event.transform;
    }));
    let transformString = $derived(`
        translate(${transform.x} ${transform.y})
        scale(${transform.k})
    `);
    let strokeWidth = $derived(1 / transform.k);
    
    // Map dimensions
    const width = 975;
    const height = 610;
    
    // Get map data
    const { states, borders } = data;
    const geoPath = d3.geoPath()

    
    function handleStateClick(event, state) {
        event.stopPropagation();
        if(selectedState?.properties?.name === state?.properties?.name){
            transform = d3.zoomIdentity;
            selectedState = null;
        } else {

            selectedState = state;
            
            // Zoom logic
            const [[x0, y0], [x1, y1]] = geoPath.bounds(state);
            const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
            const translate = [-(x0 + x1) / 2, -(y0 + y1) / 2];
            
            transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(scale)
                .translate(...translate);
        }
    }
    
    function handleStateMouseOver(state) {
        hoveredState = state?.properties?.name;
    }
    
    function handleStateMouseOut() {
        hoveredState = null;
    }
    
    onMount(() => {
        const svg = d3.select('#map-container svg');
        if(zoom) svg.call(zoom);
    });
</script>

<div 
    style:display="flex"
    style:transform="50%"
    style:justify-content={isOpen ? 'right' : 'center'}>
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
                    fill={selectedState?.properties?.name === state?.properties?.name ? 'red' : hoveredState === state?.properties?.name ? '#666' : '#444'}
                    on:click={(e) => handleStateClick(e, state)}
                    on:mouseover={() => handleStateMouseOver(state)}
                    on:mouseout={handleStateMouseOut}
                >
                    <title>{state?.properties?.name}</title>
                </path>
            {/each}
            
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
    <Aside feature={selectedState} isOpen={isOpen} toggleSidebar={toggleSidebar}/>
</div>

<style>
    path {
        cursor: pointer;
        transition: fill 0.2s ease;
    }
</style>