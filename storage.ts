localStorage.getItem("flights") ?? localStorage.setItem("flights", JSON.stringify([]));

export function storeFlightInfo(box: HTMLElement): void {
    const boxChildren: NodeListOf<HTMLElement> = box.querySelectorAll("*");

    let storage = JSON.parse(localStorage.getItem("flights") ?? "[]");

    let contains: boolean = false;

    for (let i = 0; i < storage.length; i++) {
        if (storage[i].elements.callsign == boxChildren[1].outerHTML) {
            contains = true;
            break;
        }
    }

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
