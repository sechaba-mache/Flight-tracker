import "./flights.js";
import "./map.js";
import { mockFlights, getFlights } from "./flights.js";
import { loadMap, addMarker } from "./map.js";

const map = loadMap();

const flightCategories = [
	"No information",
	"No ADS-B Emitter Category Information",
	"Light",
	"Small",
	"Large",
	"High Vortex Large Aircraft",
	"High Performance",
	"Rotorcraft",
	"Glider / Sailplane",
	"Lighter-than-air",
	"Parachutist / Skydiver",
	"Ultralight / Hang-glider / Paraglider",
	"Reserved",
	"Unmanned Aerial Vehicle",
	"Space / Trans-atmospheric Vehicle",
	"Surface Vehicle - Emergency Vehicle",
	"Surface Vehicle - Service Vehicle",
	"Point Obstacle",
	"Cluster Obstacle",
	"Line Obstacle",
];

function insertFlights() {
	const body = document.querySelector("body");
	body.setAttribute("focus", true);
	const content = document.querySelector(".content");

	//For When requests are available
	//Add corner cases
	//nullish coalescing english!!!!!
	// getFlights().then((res) => {
	// 	if (res != 0) {
	// 		for (let flight of res) {
	// 			const boxes = document.createElement("div");
	// 			boxes.className = "box";
	// 			boxes.setAttribute("focus", false);

	// 			const icon = flight[8]
	// 				? `<i class="fa-solid fa-plane-departure" style="color: blue"></i>`
	// 				: `<i class="fa-solid fa-plane-arrival" style="color: red"></i>`;
	// 			const from = flight[2];
	// 			const longitude = flight[5];
	// 			const latitude = flight[6];
	// 			const category = flight[17];

	// 			boxes.innerHTML =
	// 				icon +
	// 				`<h3 class="from">${from}</h3>
	// 		<p class="long">Longitude: ${longitude}</p>
	// 		<p class="lat">Latitude: ${latitude}</p>
	// 		<p class="cat">Category: ${flightCategories[category]}</p>`;
	// 			boxes.dataset.longitude = longitude;
	// 			boxes.dataset.latitude = latitude;

	// 			boxes.addEventListener("click", openMap);
	// 			content.append(boxes);
	// 		}
	// 	} else {
	// 		const noFlights = document.createElement("div");
	// 		noFlights.innerHTML = `<h1>No flights to display</h1>`;
	// 		content.append(noFlights);
	// 	}
	// });

	//for when they are unavailable
	let flights = mockFlights();
	for (var i = 0; i < flights.length; i++) {
		const boxes = document.createElement("div");
		boxes.className = "box";
		boxes.setAttribute("focus", false);

		const icon = flights[i][8]
			? `<i class="fa-solid fa-plane-departure" style="color: blue"></i>`
			: `<i class="fa-solid fa-plane-arrival" style="color: red"></i>`;
		const from = flights[i][2];
		const longitude = flights[i][5];
		const latitude = flights[i][6];
		const category = flights[i][16];

		console.log(category);

		boxes.innerHTML =
			icon +
			`<h3 class="from">${from}</h3>
	    <p class="long">Longitude: ${longitude}</p>
	    <p class="lat">Latitude: ${latitude}</p>
	    <p class="cat">Category: ${flightCategories[category]}</p>`;
		boxes.dataset.longitude = longitude;
		boxes.dataset.latitude = latitude;

		boxes.addEventListener("click", openMap);
		content.append(boxes);
	}
}

function openMap() {
	const boxes = document.getElementsByClassName("box");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 0;
	}

	const mymap = document.querySelector("#my-map");
	mymap.style.display = "grid";

	addMarker(map, this.dataset.latitude, this.dataset.longitude);

	map.invalidateSize();
	map.flyTo([this.dataset.latitude, this.dataset.longitude], 13);
}

function closeMap() {
	const myMap = document.querySelector("#my-map");
	myMap.style.display = "none";

	const boxes = document.getElementsByClassName("box");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 1;
	}
}

export { insertFlights, closeMap };
