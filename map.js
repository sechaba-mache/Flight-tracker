import { closeMap } from "./dom-manip";

function loadMap() {
	const map = L.map("my-map").setView([51.505, -0.09], 13);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	map.on("click", closeMap);
	return map;
}

function addMarker(map, lat, long) {
	const plane = L.icon({
		iconUrl: "/Assets/plane-solid.svg",
		iconSize: [30, 50],
	});

	L.marker([lat, long], { icon: plane }).addTo(map);
}

export { loadMap, addMarker };
