export interface Place {
  name: string;
  latitude: number;
  longitude: number;
}

export interface TravelItem {
  id: string;
  startingOdometer: number;
  start: Place;
  end: Place;
  distance?: number;
}

