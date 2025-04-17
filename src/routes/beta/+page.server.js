import * as topojson from 'topojson-client';
import data from '$lib/data/custom_merged_countries_110m.json';

// Sample world map TopoJSON data URL

export async function load() {
	try {
        const geoData = topojson.feature(data, data.objects.countries);
        return geoData;
    } catch (error) {
        console.error('Error loading TopoJSON data:', error);
    }
}