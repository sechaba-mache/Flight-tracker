import { insertFlights } from "./dom-manip";
import { allFlights$, getNonNulls } from "./flights";
import { Subscription } from "rxjs";
import { IFlight, IFlightResponse, ofError } from "./src/models/flight";

export const subscription: Subscription = allFlights$.subscribe((res: IFlightResponse | ofError) => {

    if (isResponse(res as IFlightResponse)) {
        const allStates: IFlight[] = [];
        if (res.states != null) {

            res.states.map((state: string) => {
                const flight: IFlight = {
                    icao24: state[0] !== "null" ? state[0] : null,
                    callsign: state[1] !== "null" ? state[1] : null,
                    origin_country: state[2] !== "null" ? state[2] : null,
                    time_position: state[3] !== "null" ? parseInt(state[3]) : null,
                    last_contact: state[4] !== "null" ? parseInt(state[4]) : null,
                    longitude: state[5] !== "null" ? parseInt(state[5]) : null,
                    latitude: state[6] !== "null" ? parseInt(state[6]) : null,
                    baro_altitude: state[7] !== "null" ? parseInt(state[7]) : null,
                    on_ground: state[8] !== "null" ? Boolean(state[8]) : null,
                    velocity: state[9] !== "null" ? parseInt(state[9]) : null,
                    true_track: state[10] !== "null" ? parseInt(state[10]) : null,
                    vertical_rate: state[11] !== "null" ? parseInt(state[11]) : null,
                    sensors: state[12] !== "null" ? JSON.parse(state[12]) : null,
                    geo_altitude: state[13] !== "null" ? parseInt(state[13]) : null,
                    squawk: state[14] !== "null" ? state[14] : null,
                    spi: state[15] !== "null" ? Boolean(state[15]) : null,
                    position_source: state[16] !== "null" ? parseInt(state[16]) : null,
                    category: state[17] !== "null" ? parseInt(state[17]) : null,
                }

                if (getNonNulls(flight) != null) {
                    allStates.push(flight)
                }
            })

        }
        insertFlights(allStates.slice(0, 20));
    }
    else {
        insertFlights([]);
        return;
    }
});

export function isResponse(res: IFlightResponse): res is IFlightResponse {
    if (res?.states != null) {
        return true;
    }
    return false;
}