import { catchError, switchMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";

export function getNonNulls(flight) {
	if (flight[5] && flight[6] != null) {
		return flight;
	}
}

export const allFlights$ = fromFetch(
	"https://opensky-network.org/api/states/all?extended=1"
).pipe(
	switchMap((res) => {
		if (res.ok) {
			return res.json();
		} else {
			console.error(res.status);
			return res.status;
		}
	}),
	catchError((err) => {
		console.error(err);
		return 0;
	})
);
