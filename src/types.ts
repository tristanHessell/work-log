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
  public code: number;
  constructor(err: any) {
    super(err);
    this.code = err.code;
    this.message = err.message;
  }
}
