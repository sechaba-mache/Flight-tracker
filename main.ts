import { Subscription } from 'rxjs';
import { insertFlights } from './dom-manip';
import { allFlights$, getNonNulls } from './flights';
import { IFlight, IFlightResponse, IOfError } from './src/models/flight';

export const subscription: Subscription = allFlights$.subscribe(
    (res: IFlightResponse | IOfError) => {

        if (isResponse(res as IFlightResponse)) {
            const allStates: IFlight[] = [];
            if (res.states !== null) {

                res.states.map((state: string) => {

                    const flight: IFlight = {
                        icao24: (state[0] !== 'null' && state[0] !== "") ? state[0] : "Private",
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

export function isResponse(res: IFlightResponse): res is IFlightResponse {
    if (res?.states !== null) {
        return true;
    }
    return false;
}
