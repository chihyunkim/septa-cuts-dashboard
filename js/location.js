import _ from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm';

const geolocateButton = document.querySelector('#geolocate-button');
const addressInput = document.querySelector('#address-input');
const addressSuggestions = document.querySelector('#suggestions');

/**
 * Initializes geolocation features.
 * @param {EventTarget} events The event bus used to communicate between app components.
 */
function geolocate(events) {
  geolocateButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        const evt = new CustomEvent('userLocationAcquired', {
          detail: { lat, lng },
        });
        events.dispatchEvent(evt);
      },
      (error) => {
        console.error('Error obtaining location:', error);
        alert('Unable to retrieve your location. Did you allow location access?');
      }
    );
  });
}

/**
 * Initializes address autocomplete features.
 * @param {EventTarget} events The event bus used to communicate between app components.
 */
function suggestAddress(events) {
  const apiUrlBase = 'https://geocoding.geo.census.gov/geocoder/locations/address?city=Philadelphia&state=PA&benchmark=4&format=json&street=';
  
  const inputHandler = async () => {
    console.log('Input changed:', addressInput.value);

    // TODO: We should not send a request for empty input.

    const response = await fetch('https://corsproxy.io/?url=' + apiUrlBase + encodeURIComponent(addressInput.value));
    const data = await response.json();
    console.log('Autocomplete suggestions:', data);

    addressSuggestions.innerHTML = '';

    const suggestions = data.result.addressMatches;
    // TODO: If suggestions is empty, let the user know no matches were found.
    if (!suggestions || suggestions.length === 0) {
      const noResultsItem = document.createElement('li');
      noResultsItem.textContent = 'No matches found.';
      addressSuggestions.appendChild(noResultsItem);
    }

    for (const match of suggestions) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<button>${match.matchedAddress}</button>`;
      listItem.querySelector('button').addEventListener('click', () => {
        addressInput.value = match.matchedAddress;
        addressSuggestions.innerHTML = '';

        const lat = match.coordinates.y;
        const lng = match.coordinates.x;
        const evt = new CustomEvent('userLocationAcquired', {
          detail: { lat, lng },
        });
        events.dispatchEvent(evt);
      });
      addressSuggestions.appendChild(listItem);
    }
  };

  const debouncedInputHandler = _.debounce(inputHandler, 500);
  
  addressInput.addEventListener('input', debouncedInputHandler);
}

export { geolocate, suggestAddress };