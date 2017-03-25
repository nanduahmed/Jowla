var initGapi = function () {
    window.initGapi();
};

var initMap = function () {
    window.initMap();
};

// Create the Google Maps <script> element to inject the API key dynamically
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
    '&key=' + GOOGLE_MAP_KEY +'&callback=initMap';
document.body.appendChild(script);
