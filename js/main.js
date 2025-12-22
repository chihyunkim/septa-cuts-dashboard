import { getGeojsonCollection } from './utils.js';
import { initMap } from './map.js';
import { geolocate, suggestAddress, getDistrict } from './location.js';

// Events in event bus:
// - userLocationAcquired: { detail: { lat, lng } }
const events = new EventTarget();

const mapElement = document.querySelector('#map');
const septaNetwork = await getGeojsonCollection('overall_network.json');

initMap(mapElement, septaNetwork);
geolocate(events);
suggestAddress(events);
getDistrict(events);





