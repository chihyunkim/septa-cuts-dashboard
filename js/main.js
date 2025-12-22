import * as turf from 'https://cdn.jsdelivr.net/npm/@turf/turf@7.1.0/+esm';

import { geolocate, suggestAddress } from './location.js';
import { initMap } from './map.js';

// Events in event bus:
// - userLocationAcquired: { detail: { lat, lng } }
const events = new EventTarget();

const mapElement = document.querySelector('#map');
const septaNetwork = await getGeojsonCollection('overall_network.json');

initMap(mapElement, septaNetwork);
geolocate(events);
suggestAddress(events);

/*
* Read geojson file
* @param {string} filename - The name of the geojson file to load
* @return {object} The FeatureCollection as loaded from the data file
*/
async function getGeojsonCollection(filename) {
    const resp = await fetch(`data/${filename}`);
    const data = await resp.json();
    return data;
}



