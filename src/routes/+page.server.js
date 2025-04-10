import * as topojson from 'topojson-client';

// Sample world map TopoJSON data URL
const WORLD_MAP_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export async function load() {
	try {
        const response = await fetch(WORLD_MAP_URL);
        const world = await response.json();
        return topojson.feature(world, world.objects.countries);
    } catch (error) {
        console.error('Error loading TopoJSON data:', error);
    }
}