import "./flights.js";
import "./map.js";
import { loadMap, addMarker } from "./map.js";
import { storeFlightInfo } from "./storage.js";
import { allFlights$, getNonNulls } from "./flights.js";
import { subscription } from "./main.js";

const map = loadMap();

const historyButton = document.querySelector(".historyButton");
historyButton.addEventListener("click", openHistory);

const closeHistoryButton = document.querySelector(".closeHistoryButton");
closeHistoryButton.addEventListener("click", closeHistory);

let historyHeading = document.querySelector(".historyHeading");

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

let newSub = undefined;

function insertFlights(flights) {
	const divContainingFlights = document.querySelector(".content");
	const flightBoxes = document.querySelectorAll(".box");
	const existingBoxElementsContent = document.querySelectorAll(".box *");

	const errorMessage = document.querySelector(".error");
	if (errorMessage != null) {
		errorMessage.remove();
	}

	if (flights != 0) {
		if (flightBoxes.length > 0) {
			Array.from(existingBoxElementsContent).map((box) => box.remove());

			Array.from(flights).map((currentFlight, index) =>
				updateFlightInfo(currentFlight, flightBoxes[index])
			);
		} else {
			Array.from(flights).map((currentFlight) =>
				addFlightInfo(currentFlight, divContainingFlights)
			);
		}
	} else {
		if (flightBoxes.length != 0)
			Array.from(flightBoxes).map((box) => box.remove());

		const noFlights = document.createElement("div");
		noFlights.className = "error";
		noFlights.innerHTML = `<h1>No flights to display</h1>`;
		divContainingFlights.append(noFlights);
	}
}

function updateFlightInfo(flight, boxes) {
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

	storeFlightInfo(this);
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

	const historyBoxes = document.querySelectorAll(".historyBoxes");
	Array.from(historyBoxes).map((box) => {
		box.style.zIndex = 1;
	});
}

function openHistory() {
	if (newSub != undefined) {
		newSub.unsubscribe();
	} else {
		subscription.unsubscribe();
	}
	historyButton.style.display = "none";
	closeHistoryButton.style.display = "flex";

	const boxes = document.querySelectorAll(".box");
	Array.from(boxes).map((box) => box.remove());

	historyHeading.style.display = "flex";

	const historyBoxes = document.getElementsByClassName("historyBoxes");
	Array.from(historyBoxes).map((box) => {
		if (box != undefined) {
			box.style.display = "grid";
		}
	});

	const stored = JSON.parse(localStorage.getItem("flights"));

	Array.from(stored).map((element) => createHistory(element));
}

function createHistory(element) {
	const content = document.querySelector(".content");
	const historyBox = document.createElement("div");
	historyBox.className = "historyBoxes";
	historyBox.style.display = "grid";
	historyBox.dataset.longitude = element.data.longitudeValue;
	historyBox.dataset.latitude = element.data.latitudeValue;

	historyBox.innerHTML = element.elements.from + element.elements.callsign;

	content.append(historyBox);

	historyBox.addEventListener("click", openHistoryMap);
}

function openHistoryMap() {
	const boxes = document.getElementsByClassName("historyBoxes");
	for (let i = 0; i < boxes.length; i++) {
		boxes[i].style.zIndex = 0;
	}

	const mymap = document.querySelector("#my-map");
	mymap.style.display = "grid";

	addMarker(map, this.dataset.latitude, this.dataset.longitude);

	map.invalidateSize();
	map.flyTo([this.dataset.latitude, this.dataset.longitude], 13);

	const mapCloseInstructions = document.querySelector(".mapCloseInstructions");
	mapCloseInstructions.style.display = "flex";
}

function closeHistory() {
	const historyBoxes = document.getElementsByClassName("historyBoxes");
	Array.from(historyBoxes).map((box) => {
		if (box != undefined) {
			box.remove();
		}
	});
	historyHeading.style.display = "none";
	closeHistoryButton.style.display = "none";
	historyButton.style.display = "grid";

	newSub = allFlights$.subscribe({
		next: (res) => {
			if (res == 0) insertFlights(0);
			insertFlights(res.states.filter(getNonNulls).slice(0, 20));
		},
	});
}

export { insertFlights, closeMap };
