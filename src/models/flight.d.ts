export interface IFlightResponse {
    time: number;
    states: string[] | null;
}

export interface IFlight {
    icao24: string | null;
    callsign: string | null;
    origin_country: string | null;
    time_position: number | null;
    last_contact: number | null;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean | null;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean | null;
    position_source: number | null;
    category: number | null;
}

export interface IOfError {
    ok: boolean;
    message: string;
    states: null;
}
