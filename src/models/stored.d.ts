export interface IStorage {
    elements: {
        callsign: string,
        from: string,
    },
    data: {
        longitudeValue: number,
        latitudeValue: number,
    }
}
