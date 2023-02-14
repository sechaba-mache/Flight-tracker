
var map = L.map('map').setView([51.505, -0.09], 13);

var icon = new L.Icon.Default();

var plane = L.icon({
    iconUrl: 'plane-solid.svg',
    iconSize: [30, 50]
});

L.marker([51.5, -0.09], {icon: plane}).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);