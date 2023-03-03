import { Map } from 'leaflet';
import { Subscription } from 'rxjs';
import { allFlights$, getNonNulls } from './flights';
import { loadMap, addMarker } from './map';
import { IFlight, IFlightResponse, IOfError } from './src/models/flight';
import storeFlightInfo from './storage';
import { IStorage } from './src/models/stored';
import { isResponse, subscription } from './main';

const map: Map = loadMap();

const historyButton: HTMLElement | null = document.querySelector('.historyButton');

const closeHistoryButton: HTMLElement | null = document.querySelector('.closeHistoryButton');

const historyHeading: HTMLElement | null = document.querySelector('.historyHeading');

let newSub: Subscription = Subscription.EMPTY;

const flightCategories: string[] = [
    'No information',
    'No ADS-B Emitter Category Information',
    'Light',
    'Small',
    'Large',
    'High Vortex Large Aircraft',
    'High Performance',
    'Rotorcraft',
    'Glider / Sailplane',
    'Lighter-than-air',
    'Parachutist / Skydiver',
    'Ultralight / Hang-glider / Paraglider',
    'Reserved',
    'Unmanned Aerial Vehicle',
    'Space / Trans-atmospheric Vehicle',
    'Surface Vehicle - Emergency Vehicle',
    'Surface Vehicle - Service Vehicle',
    'Point Obstacle',
    'Cluster Obstacle',
    'Line Obstacle',
];

export function insertFlights(flights: IFlight[]): void {
    const divContainingFlights: HTMLElement = document.querySelector('.content')!;
    const flightBoxes: NodeListOf<HTMLElement> = document.querySelectorAll('.box');
    const existingBoxElementsContent: NodeListOf<HTMLElement> = document.querySelectorAll('.box *');

    const errorMessage: HTMLElement | null = document.querySelector('.error');
    if (errorMessage !== null) {
        errorMessage.remove();
    }

    if (flights.length !== 0) {
        if (flightBoxes.length > 0) {
            Array.from(existingBoxElementsContent).map((box: HTMLElement) => box.remove());

            Array.from(flights).map((currentFlight, index) => {
                return updateFlightInfo(currentFlight, flightBoxes[index] as HTMLElement);
            },
            );
        } else {
            Array.from(flights).map((currentFlight) => {
                return addFlightInfo(currentFlight, divContainingFlights);
            },
            );
        }
    } else {
        if (flightBoxes.length !== 0) {
            Array.from(flightBoxes).map((box: HTMLElement) => { return box.remove(); });
        }

        const noFlights = document.createElement('div');
        noFlights.className = 'error';
        noFlights.innerHTML = `<h1>No flights to display</h1>`;
        divContainingFlights.append(noFlights);
    }
}

function updateFlightInfo(flight: IFlight, box: HTMLElement): void {
    const icon: string = flight.on_ground === false
        ? `<i class='fa-solid fa-plane-departure' style='color: blue'></i>`
        : `<i class='fa-solid fa-plane-arrival' style='color: red'></i>`;

    const callsign: string | null = flight.callsign;
    const from: string | null = flight.origin_country;
    const longitude: number = flight.longitude!;
    const latitude: number = flight.latitude!;
    const category: number = flight.category !== null ? flight.category : 0;

    box.innerHTML = icon
        + `<h3 class='callsign'>Callsign: ${callsign}</h3>
        <h3 class='from'>From: ${from}</h3>
        <p class='long'>Longitude: ${longitude}</p>
        <p class='lat'>Latitude: ${latitude}</p>
        <p class='cat'>Category: ${flightCategories[category]}</p>`;
    box.dataset.longitude = longitude!.toString();
    box.dataset.latitude = latitude!.toString();

    box.addEventListener('click', () => openMap(latitude, longitude, box));

}

function addFlightInfo(flight: IFlight, content: HTMLElement): void {
    const box: HTMLElement = document.createElement('div');
    box.className = 'box';

    const icon: string = flight.on_ground === false
        ? `<i class='fa-solid fa-plane-departure' style='color: blue'></i>`
        : `<i class='fa-solid fa-plane-arrival' style='color: red'></i>`;
    const callsign: string | null = flight.callsign;
    const from: string | null = flight.origin_country;
    const longitude: number = flight.longitude!;
    const latitude: number = flight.latitude!;
    const category: number = flight.category !== null ? flight.category : 0;

    box.innerHTML = icon
        + `<h3 class='callsign'>Callsign: ${callsign}</h3>
        <h3 class='from'>From: ${from}</h3>
        <p class='long'>Longitude: ${longitude}</p>
        <p class='lat'>Latitude: ${latitude}</p>
        <p class='cat'>Category: ${flightCategories[category]}</p>`;
    box.dataset.longitude = longitude.toString();
    box.dataset.latitude = latitude.toString();

    box.addEventListener('click', () => openMap(latitude, longitude, box));

    content.append(box);

}

function openMap(latitude: number, longitude: number, box?: HTMLElement): void {
    const boxes: HTMLCollection = document.getElementsByClassName('box');
    const historyBoxes: NodeListOf<HTMLElement> = document.querySelectorAll('.historyBoxes');

    Array.from(historyBoxes).map((histBox: HTMLElement): void => {
        histBox.style.zIndex = '0';
    });

    Array.from(boxes).map((currentBox: Element) => {
        if (currentBox instanceof HTMLElement) {
            currentBox.style.zIndex = '0';
            currentBox.style.scale = '0.7';
        }
    });

    const mymap: HTMLElement = document.querySelector('#my-map')!;
    mymap.style.display = 'grid';

    addMarker(map, latitude, longitude);

    map.invalidateSize();
    map.flyTo([latitude, longitude], 13);

    const mapCloseInstructions: HTMLElement = document.querySelector('.mapCloseInstructions')!;
    mapCloseInstructions.style.display = 'flex';

    if (typeof box !== 'undefined') storeFlightInfo(box);
}

export function closeMap(): void {
    const myMap: HTMLElement = document.querySelector('#my-map')!;
    myMap.style.display = 'none';

    const mapCloseInstructions: HTMLElement = document.querySelector('.mapCloseInstructions')!;
    mapCloseInstructions.style.display = 'none';

    const boxes: HTMLCollection = document.getElementsByClassName('box');
    Array.from(boxes).map((box: Element) => {
        if (box instanceof HTMLElement) {
            box.style.zIndex = '1';
            box.style.scale = '1';
        }
    });

    const historyBoxes: NodeListOf<HTMLElement> = document.querySelectorAll('.historyBoxes');
    Array.from(historyBoxes).map((box: HTMLElement) => {
        box.style.zIndex = '1';
    });
}

function openHistory(): void {
    if (newSub !== undefined) {
        newSub.unsubscribe();
    } else {
        subscription.unsubscribe();
    }

    if (historyButton && closeHistoryButton && historyHeading !== null) {
        historyButton.style.display = 'none';

        closeHistoryButton.style.display = 'flex';
        historyHeading.style.display = 'flex';
    }

    const boxes: NodeListOf<HTMLElement> = document.querySelectorAll('.box');
    Array.from(boxes).map((box: HTMLElement) => box.remove());

    const historyBoxes: HTMLCollection = document.getElementsByClassName('historyBoxes');
    Array.from(historyBoxes).map((box: Element) => {
        if (box !== undefined) {
            if (box instanceof HTMLElement) box.style.display = 'grid';
        }
    });

    const stored: IStorage[] = JSON.parse(localStorage.getItem('flights') ?? '[]');

    Array.from(stored).map((element: IStorage) => createHistory(element));
}

function createHistory(element: IStorage): void {
    const divContainingFlights: HTMLElement = document.querySelector('.content')!;
    const historyBox: HTMLElement = document.createElement('div');
    historyBox.className = 'historyBoxes';
    historyBox.style.display = 'grid';
    historyBox.dataset.longitude = element.data.longitudeValue.toString();
    historyBox.dataset.latitude = element.data.latitudeValue.toString();

    historyBox.innerHTML = element.elements.from + element.elements.callsign;
    divContainingFlights.append(historyBox);
    historyBox.addEventListener('click', () => openMap(element.data.longitudeValue, element.data.latitudeValue));
}

function closeHistory(): void {
    const historyBoxes: HTMLCollection = document.getElementsByClassName('historyBoxes');
    Array.from(historyBoxes).map((box: Element) => {
        if (box !== undefined) {
            if (box instanceof HTMLElement) box.remove();
        }
    });

    if (historyButton && closeHistoryButton && historyHeading !== null) {
        historyHeading.style.display = 'none';
        closeHistoryButton.style.display = 'none';
        historyButton.style.display = 'grid';
    }

    newSub = allFlights$.subscribe((res: IFlightResponse | IOfError) => {

        if (isResponse(res as IFlightResponse)) {

            const allStates: IFlight[] = [];
            if (res.states !== null) {

                res.states.map((state: string) => {
                    const flight: IFlight = {
                        icao24: state[0] !== 'null' ? state[0] : null,
                        callsign: state[1] !== 'null' ? state[1] : null,
                        origin_country: state[2] !== 'null' ? state[2] : null,
                        time_position: state[3] !== 'null' ? parseFloat(state[3]) : null,
                        last_contact: state[4] !== 'null' ? parseFloat(state[4]) : null,
                        longitude: state[5] !== 'null' ? parseFloat(state[5]) : null,
                        latitude: state[6] !== 'null' ? parseFloat(state[6]) : null,
                        baro_altitude: state[7] !== 'null' ? parseFloat(state[7]) : null,
                        on_ground: state[8] !== 'null' ? Boolean(state[8]) : null,
                        velocity: state[9] !== 'null' ? parseFloat(state[9]) : null,
                        true_track: state[10] !== 'null' ? parseFloat(state[10]) : null,
                        vertical_rate: state[11] !== 'null' ? parseFloat(state[11]) : null,
                        sensors: state[12] !== 'null' ? JSON.parse(state[12]) : null,
                        geo_altitude: state[13] !== 'null' ? parseFloat(state[13]) : null,
                        squawk: state[14] !== 'null' ? state[14] : null,
                        spi: state[15] !== 'null' ? Boolean(state[15]) : null,
                        position_source: state[16] !== 'null' ? parseFloat(state[16]) : null,
                        category: state[17] !== 'null' ? parseFloat(state[17]) : null,
                    };

                    if (getNonNulls(flight) !== null) {
                        allStates.push(flight);
                    }
                });

            }
            insertFlights(allStates.slice(0, 20));
        } else {
            insertFlights([]);
        }
    });
}

historyButton?.addEventListener('click', openHistory);
closeHistoryButton?.addEventListener('click', closeHistory);
