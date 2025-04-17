<script>
    import * as d3 from 'd3';
    import { feature } from 'topojson-client';
    
    export let width = 800;
    export let height = 500;
    export let topojsonData;
    
    let selectedRegion = null;
    
    $: features = topojsonData ? feature(topojsonData, topojsonData.objects.countries).features : [];
    
    $: projection = d3.geoNaturalEarth1()
      .fitSize([width, height], {type: 'Sphere'});
    
    $: pathGenerator = d3.geoPath().projection(projection);
    
    function handleClick(feature) {
      selectedRegion = feature;
      // Dispatch event or call callback for parent to handle
    }
  </script>
  
  <svg {width} {height}>
    {#each features as feature}
      <path
        d={pathGenerator(feature)}
        fill="#ccc"
        stroke="#fff"
        on:click={() => handleClick(feature)}
      />
    {/each}
  </svg>