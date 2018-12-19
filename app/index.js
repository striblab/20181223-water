/**
 * Main JS file for project.
 */

// Define globals that are added through the js.globals in
// the config.json file, here, mostly so linting won't get triggered
// and its a good queue of what is available:
// /* global _ */

// Dependencies
import utils from './shared/utils.js';

// Mark page with note about development or staging
utils.environmentNoting();


// Auto enable Pym for embedding.  This will enable a Pym Child if
// the url contains ?pym=true
utils.autoEnablePym();


// Adding dependencies
// ---------------------------------
// Import local ES6 or CommonJS modules like this:
// import utilsFn from './shared/utils.js';
//
// Or import libraries installed with npm like this:
// import module from 'module';

// Adding Svelte templates in the client
// ---------------------------------
// We can bring in the same Svelte templates that we use
// to render the HTML into the client for interactivity.  The key
// part is that we need to have similar data.
//
// First, import the template.  This is the main one, and will
// include any other templates used in the project.
// import Content from '../templates/_index-content.svelte.html';
//
// Get the data parts that are needed.  There are two ways to do this.
// If you are using the buildData function to get data, then ?
//
// 1. For smaller datasets, just import them like other files.
// import content from '../assets/data/content.json';
//
// 2. For larger data points, utilize window.fetch.
// let content = await (await window.fetch('../assets/data/content.json')).json();
//
// Once you have your data, use it like a Svelte component:
//
// const app = new Content({
//   target: document.querySelector('.article-lcd-body-content'),
//   data: {
//     content
//   }
// });

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZG93ZmxhcmUiLCJhIjoiS3pwY1JTMCJ9.pTSXx_LFgR3XBpCNNxWPKA';
var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/shadowflare/cjp2sx7kc2f532sqaxosktgsu',
    center: [-89.460554, 44.235760],
    zoom: 8,
    scrollZoom: false
});

// map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.doubleClickZoom.disable();

map.on('load', function() {

 map.addSource('sands', {
   type: 'geojson',
   data: './shapefiles/sands.json'
 });

  map.addLayer({
       'id': 'sands-layer',
       'interactive': true,
       'source': 'sands',
       'layout': {},
       'type': 'fill',
            'paint': {
           'fill-antialias' : true,
           'fill-opacity': 0.7,
           'fill-color': "#F2AF80",
           'fill-outline-color': 'rgba(255, 255, 255, 1)'
     }
   }, 'road-primary');

 map.addSource('wells', {
   type: 'geojson',
   data: './shapefiles/wells.json'
 });

var i = 1939, howManyTimes = 2019;
function loadDots() {

    $("#year").html(i);

    map.addLayer({
        "id": "wells-layer-" + i,
        "type": "circle",
        "source": "wells",
        "paint": {
           "circle-radius": 2,
           "circle-color": '#C22A22',
           "circle-opacity": 0.5
        },
        "filter": ["==", "start_y", i]
}, 'place-neighbourhood');

    i++;
    if( i < howManyTimes ){
        setTimeout( loadDots, 100 );
    } else {
        $("#reload").show();
    }
}
loadDots();

$("#reload").on("click", function() {
    for (var j=1939; j < 2019; j++) {
        map.removeLayer("wells-layer-" + j);
    }
    i = 1939;
    loadDots();
    $(this).hide();
});

});

$(document).ready(function() {
  if ($("#wrapper").width() < 600) {
      map.flyTo({
        center: [-89.438430, 44.340363], 
        zoom: 7.4
      });
  } else {
      map.flyTo({
        center: [-89.460554, 44.2357609], 
        zoom: 8
      });
  }
  $(window).resize(function() {
      if ($("#wrapper").width() < 600) {
          map.flyTo({
            center: [-89.002630, 44.513423], 
            zoom: 7.4
          });
      } else {
          map.flyTo({
            center: [-89.438430, 44.340363], 
            zoom: 8
          });
      }
  });
});