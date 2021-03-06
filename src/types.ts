export interface Place {
  name: string;
  latitude: number;
  longitude: number;
  accuracy: number; // used for debugging
}

export interface TravelItem {
  id: string;
  startingOdometer: number;
  start: Place;
  end: Place;
  distance?: number;
  createdDate: string; // effective date YYYYMMDD
}

export class GeolocationError extends Error {
  public code: number | null;

  constructor(err: Error | PositionError) {
    super(err.message);
    this.code = "code" in err ? err.code : null;
    this.message = err.message;
  }
}

export type Requested<E = Error> =
  | { type: "Entity" }
  | { type: "Loading" }
  | { type: "Error"; error: E };
