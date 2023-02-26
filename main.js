import { insertFlights } from "./dom-manip.js";
import { allFlights$, getNonNulls } from "./flights.js";

import "./style.scss";

export const subscription = allFlights$.subscribe({
	next: (res) => {
		if (res == 0) insertFlights(0);
		insertFlights(res.states.filter(getNonNulls).slice(0, 20));
	},
});
