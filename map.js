function loadMap() {
	const map = L.map("my-map").setView([51.505, -0.09], 13);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	map.on("click", close);
	return map;
}

function fly(map, lat, long) {
	addMarker(map, lat, long);

	map.invalidateSize();
	map.flyTo([lat, long], 13);
}

function addMarker(map, lat, long) {
	const plane = L.icon({
		iconUrl: "plane-solid.svg",
		iconSize: [30, 50],
	});

	L.marker([lat, long], { icon: plane }).addTo(map);
}

//move to dom manip
function close() {
	const myMap = document.querySelector("#my-map");
	myMap.style.display = "none";

	const boxes = document.getElementsByClassName("box");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 1;
	}
}

export { loadMap, fly };
