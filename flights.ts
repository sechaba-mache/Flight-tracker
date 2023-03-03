import { catchError, switchMap, concatMap, timer, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { IFlight, IFlightResponse, IOfError } from './src/models/flight';

export function getNonNulls(flight: IFlight): IFlight | null {
    if (flight.longitude && flight.latitude !== null) {
        return flight;
    }

    return null;
}

export const allFlights$: Observable<IFlightResponse | IOfError> = timer(0, 30000).pipe(
    concatMap(() =>
        fromFetch('https://opensky-network.org/api/states/all?extended=1').pipe(
            switchMap((res) => {
                if (res.ok) {
                    return res.json();
                }

                console.error(res.status);
                const error: IOfError = { ok: false, message: `Error ${res.status}`, states: null };
                return of(error);

            }),
            catchError((err) => {
                console.error(err);
                const error: IOfError = { ok: false, message: `Error ${err.status}`, states: null };
                return of(error);
            }),
        ),
    ),
    catchError((err) => {
        console.error(err);
        const error: IOfError = { ok: false, message: `Error ${err.status}`, states: null };
        return of(error);
    }),
);
