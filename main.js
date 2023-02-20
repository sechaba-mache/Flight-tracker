import { insertFlights } from "./dom-manip.js";
import "./flights.js";
import "./map.js";
import { loadMap } from "./map.js";
import "./style.scss";

insertFlights();
setInterval(insertFlights, 30000);
