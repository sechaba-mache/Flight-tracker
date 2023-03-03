import { IStorage } from "./src/models/stored";

export default function storeFlightInfo(box: HTMLElement): void {
    const boxChildren: NodeListOf<HTMLElement> = box.querySelectorAll('*');

    const storage: IStorage[] = JSON.parse(localStorage.getItem('flights') ?? '[]');

    let contains: boolean = false;

    for (let i = 0; i < storage.length; i++) {
        if (storage[i].elements.callsign === boxChildren[1].outerHTML) {
            contains = true;
            break;
        }
    }

    if (contains === false) {
        storage.push({
            elements: {
                callsign: boxChildren[1].outerHTML,
                from: boxChildren[2].outerHTML,
            },
            data: {
                longitudeValue: parseFloat(box.dataset.longitude!),
                latitudeValue: parseFloat(box.dataset.latitude!),
            },
        });

        localStorage.setItem('flights', JSON.stringify(storage));
    }
}
