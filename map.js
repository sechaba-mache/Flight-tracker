import { closeMap } from "./dom-manip";

function loadMap() {
	const map = L.map("my-map").setView([51.505, -0.09], 13);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		className: "map-tiles",
	}).addTo(map);

	map.on("click", closeMap);
	return map;
}

function addMarker(map, lat, long) {
	const plane = L.icon({
		iconUrl: window.matchMedia("prefers-color-scheme: dark")
			? "Assets/plane-icon-in-flat-style-airplane-vector-illustration-on-white-isolated-background-flight-airliner-business-concept-2AE8BA7-removebg-preview(2).png"
			: "/Assets/plane-solid.svg",
		iconSize: [40, 50],
		className: "planeMarker",
	});

	L.marker([lat, long], { icon: plane }).addTo(map);
}

export { loadMap, addMarker };
