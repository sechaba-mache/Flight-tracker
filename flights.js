import { catchError, switchMap, concatMap, timer } from "rxjs";
import { fromFetch } from "rxjs/fetch";

export function getNonNulls(flight) {
	if (flight[5] && flight[6] != null) {
		return flight;
	}
}

export const allFlights$ = timer(0, 30000).pipe(
	concatMap(() =>
		fromFetch("https://opensky-network.org/api/states/all?extended=1").pipe(
			switchMap((res) => {
				if (res.ok) {
					return res.json();
				} else {
					console.error(res.status);
					return 0;
				}
			}),
			catchError((err) => {
				console.error(err);
				return 0;
			})
		)
	)
);
