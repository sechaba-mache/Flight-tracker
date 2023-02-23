localStorage.setItem("flights", JSON.stringify([]));

export function storeFlightInfo(box) {
	const boxChildren = box.querySelectorAll("*");

	let storage = JSON.parse(localStorage.getItem("flights"));

	let contains = false;

	contains = Array.from(storage).map((element) => {
		if (element.elements.callsign == boxChildren[1].outerHTML) {
			return true;
		}
	});

	if (contains == false) {
		storage.push({
			elements: {
				callsign: boxChildren[1].outerHTML,
				from: boxChildren[2].outerHTML,
			},
			data: {
				longitudeValue: box.dataset.longitude,
				latitudeValue: box.dataset.latitude,
			},
		});

		localStorage.setItem("flights", JSON.stringify(storage));
	}
}
