import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import us from '$lib/components/rotating-orthographic/files/counties-albers-10m-full.json';

export function load() {
    return {
        us,
        states: feature(us, us.objects.states).features,
        counties: feature(us, us.objects.counties).features
    };
}

