import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import us from '$lib/components/rotating-orthographic/files/states-albers-10m.json';

export function load() {
    return {
        states: feature(us, us.objects.states).features,
        borders: mesh(us, us.objects.states, (a, b) => a !== b)
    };
}

