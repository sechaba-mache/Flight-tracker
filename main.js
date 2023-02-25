import { insertFlights } from "./dom-manip.js";
import { allFlights$, getNonNulls } from "./flights.js";
import { concatMap, timer } from "rxjs";
import "./style.scss";

timer(0, 30000).pipe(
	concatMap(
		allFlights$.subscribe({
			next: (res) => {
				if (res == 0) insertFlights(0);
				insertFlights(res.states.filter(getNonNulls).slice(0, 20));
			},
		})
	)
);
