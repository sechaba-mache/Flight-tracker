import { insertFlights } from "./dom-manip.js";
import "./style.scss";

insertFlights();
setInterval(insertFlights, 30000);
