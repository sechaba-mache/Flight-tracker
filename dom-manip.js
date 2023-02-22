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

sessionStorage.setItem("flights", JSON.stringify([]));

function insertFlights() {
	const content = document.querySelector(".content");
	const existingBoxElementsContent = document.querySelectorAll(".box *");
	const boxes = document.querySelectorAll(".box");

	const errorMessage = document.querySelector(".error");
	if (errorMessage != null) {
		errorMessage.remove();
	}

	if (boxes.length > 0) {
		Array.from(existingBoxElementsContent).map((box) => box.remove());

		let boxIndex = 0;

		getFlights()
			.then((res) => {
				console.log(res);
				if (res != 0 && res != undefined) {
					for (let flight of res) {
						updateFlightInfo(flight, boxIndex, boxes);
						boxIndex++;
					}
				} else {
					const boxesToClear = document.querySelectorAll(".content *");
					Array.from(boxesToClear).map((box) => box.remove());

					const noFlights = document.createElement("div");
					noFlights.className = "error";
					noFlights.innerHTML = `<h1>No flights to display</h1>`;
					content.append(noFlights);
				}
			})
			.catch((err) => {
				const boxesToClear = document.querySelectorAll(".content *");
				Array.from(boxesToClear).map((box) => box.remove());

				console.error(err);
				const noFlights = document.createElement("div");
				noFlights.className = "error";
				noFlights.innerHTML = `<h1>An error has occured while fetching flight data.</h1>`;
				content.append(noFlights);
			});
	} else {
		getFlights()
			.then((res) => {
				if (res != 0 && res != undefined) {
					for (let flight of res) {
						addFlightInfo(flight, content);
					}
				} else {
					const noFlights = document.createElement("div");
					noFlights.className = "error";
					noFlights.innerHTML = `<h1>No flights to display</h1>`;
					content.append(noFlights);
				}
			})
			.catch((err) => {
				console.error(err);
				const noFlights = document.createElement("div");
				noFlights.className = "error";
				noFlights.innerHTML = `<h1>An error has occured while fetching flight data.</h1>`;
				content.append(noFlights);
			});
	}
	// for when they are unavailable
	// let flights = mockFlights();
	// for (let flight of flights) {
	// 	if (flight[5] != null || flight[6] != null) {
	// 		const boxes = document.createElement("div");
	// 		boxes.className = "box";
	// 		boxes.setAttribute("focus", false);

	// 		const icon = flight[8]
	// 			? `<i class="fa-solid fa-plane-departure" style="color: blue"></i>`
	// 			: `<i class="fa-solid fa-plane-arrival" style="color: red"></i>`;
	// 		const callsign = flight[1];
	// 		const from = flight[2];
	// 		const longitude = flight[5];
	// 		const latitude = flight[6];
	// 		const category = flight[17];

	// 		boxes.innerHTML =
	// 			icon +
	// 			`<h3 class="callsign">Callsign: ${callsign}</h3>
	// 			<h3 class="from">From: ${from}</h3>
	// 			<p class="long">Longitude: ${longitude}</p>
	// 			<p class="lat">Latitude: ${latitude}</p>
	// 			<p class="cat">Category: ${flightCategories[category]}</p>`;
	// 		boxes.dataset.longitude = longitude;
	// 		boxes.dataset.latitude = latitude;

	// 		boxes.addEventListener("click", openMap);
	// 		content.append(boxes);
	// 	}
	// }
}

function updateFlightInfo(flight, boxIndex, boxes) {
	const icon = flight[8]
		? `<i class="fa-solid fa-plane-departure" style="color: blue"></i>`
		: `<i class="fa-solid fa-plane-arrival" style="color: red"></i>`;
	const callsign = flight[1];
	const from = flight[2];
	const longitude = flight[5];
	const latitude = flight[6];
	const category = flight[17];

	boxes[boxIndex].innerHTML =
		icon +
		`<h3 class="callsign">Callsign: ${callsign}</h3>
	<h3 class="from">From: ${from}</h3>
	<p class="long">Longitude: ${longitude}</p>
	<p class="lat">Latitude: ${latitude}</p>
	<p class="cat">Category: ${flightCategories[category]}</p>`;
	boxes[boxIndex].dataset.longitude = longitude;
	boxes[boxIndex].dataset.latitude = latitude;

	boxes[boxIndex].addEventListener("click", openMap);
}

function addFlightInfo(flight, content) {
	const boxes = document.createElement("div");
	boxes.className = "box";

	const icon = flight[8]
		? `<i class="fa-solid fa-plane-departure" style="color: blue"></i>`
		: `<i class="fa-solid fa-plane-arrival" style="color: red"></i>`;
	const callsign = flight[1];
	const from = flight[2];
	const longitude = flight[5];
	const latitude = flight[6];
	const category = flight[17];

	boxes.innerHTML =
		icon +
		`<h3 class="callsign">Callsign: ${callsign}</h3>
		<h3 class="from">From: ${from}</h3>
		<p class="long">Longitude: ${longitude}</p>
		<p class="lat">Latitude: ${latitude}</p>
		<p class="cat">Category: ${flightCategories[category]}</p>`;
	boxes.dataset.longitude = longitude;
	boxes.dataset.latitude = latitude;

	boxes.addEventListener("click", openMap);
	content.append(boxes);
}

function openMap() {
	const boxes = document.getElementsByClassName("box");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 0;
		boxes[i].style.scale = 0.7;
	}

	const mymap = document.querySelector("#my-map");
	mymap.style.display = "grid";

	addMarker(map, this.dataset.latitude, this.dataset.longitude);

	map.invalidateSize();
	map.flyTo([this.dataset.latitude, this.dataset.longitude], 13);

	const mapCloseInstructions = document.querySelector(".mapCloseInstructions");
	mapCloseInstructions.style.display = "flex";

	const boxChildren = this.querySelectorAll("*");
	console.log(boxChildren);
	let storage = JSON.parse(sessionStorage.getItem("flights"));
	console.log(storage);
	storage.push({
		elements: {
			icon: boxChildren[0].outerHTML,
			callsign: boxChildren[1].outerHTML,
			from: boxChildren[2].outerHTML,
			longitude: boxChildren[3].outerHTML,
			latitude: boxChildren[4].outerHTML,
			category: boxChildren[5].outerHTML,
		},
		data: {
			longitudeValue: this.dataset.longitude,
			latitudeValue: this.dataset.latitude,
		},
	});

	sessionStorage.setItem("flights", JSON.stringify(storage));
}

function closeMap() {
	const myMap = document.querySelector("#my-map");
	myMap.style.display = "none";

	const mapCloseInstructions = document.querySelector(".mapCloseInstructions");
	mapCloseInstructions.style.display = "none";

	const boxes = document.getElementsByClassName("box");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 1;
		boxes[i].style.scale = 1;
	}
}

export { insertFlights, closeMap };
