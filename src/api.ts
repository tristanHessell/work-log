/* globals google */
import { Place, TravelItem } from "./types";
import { saveItem, getItems } from './db';

// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_requests
/* */
export async function getDistance(start: Place, end: Place): Promise<number> {
  return new Promise((resolve) => {
    const origin = new google.maps.LatLng(start.latitude, start.longitude);
    const destination = new google.maps.LatLng(end.latitude, end.longitude);

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (
        response: google.maps.DistanceMatrixResponse,
        status: google.maps.DistanceMatrixStatus
      ) => {
        if (status === "OK") {
          resolve(response.rows[0].elements[0].distance.value);
        }
      }
    );
  });
}

/* */
async function getCoordinates(): Promise<Coordinates> {
  return new Promise((resolve) => {
    // navigator.geolocation.getCurrentPosition(
    //   async ({ coords }) => {
    //     resolve(coords);
    //   },
    //   () => {
    //     /* TODO */
    //   },
    //   { enableHighAccuracy: true }
    // );
    getAccurateCurrentPosition((position: Position) => resolve(position.coords), () => {/**/}, () => {/**/});
  });
}

// https://developers.google.com/maps/documentation/javascript/geocoding
/* */
export async function getPlace(): Promise<Place> {
  const coords = await getCoordinates();

  return new Promise((resolve) => {
    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: new google.maps.LatLng(coords.latitude, coords.longitude),
      },
      (
        results: google.maps.GeocoderResult[],
        status: google.maps.GeocoderStatus
      ) => {
        if (status === "OK") {
          const name = results[0].address_components
            .filter((addressComponent: any) =>
              addressComponent.types.includes("locality")
            )
            .map((addressComponent: any) => addressComponent.long_name)[0];

          resolve({
            name,
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
          });
        }
      }
    );
  });
}

export async function fetchTravelItems(): Promise<TravelItem[]> {
  return getItems<TravelItem>('travelItems');
}

/* */
export async function saveTravelItem(item: TravelItem): Promise<void> {
  try {
    await saveItem('travelItems', item);
  } catch (e) {
    //
  }
}

export async function deleteTravelItem(id: string): Promise<void> {
  try {
    // TODO
  } catch (e) {
    //
  }
}

type AccuratePositionOptions= Partial<PositionOptions & {
  maxWait: number;
  timeout: number;
}>;

// https://github.com/gregsramblings/getAccurateCurrentPosition/blob/master/geo.js
export function getAccurateCurrentPosition(
  geolocationSuccess: PositionCallback,
  geolocationError: PositionErrorCallback,
  geoprogress: PositionCallback,
  options: AccuratePositionOptions = {}
): void {
  let lastCheckedPosition: Position;
  let locationEventCount = 0;

  if (!options.maxWait) options.maxWait = 10000; // Default 10 seconds
  if (!options.timeout) options.timeout = options.maxWait; // Default to maxWait

  options.maximumAge = 0; // Force current locations only
  options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)

  const watchID = navigator.geolocation.watchPosition(
    checkLocation,
    onError,
    options
  );
  const timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop

  function foundPosition  (position: Position): void {
    geolocationSuccess(position);
  };

  function checkLocation (position: Position): void {
    lastCheckedPosition = position;
    locationEventCount = locationEventCount + 1;
    // We ignore the first event unless it's the only one received because some devices seem to send a cached
    // location even when maxaimumAge is set to zero
    if (
      position.coords.accuracy <= 20 &&
      locationEventCount > 1
    ) {
      clearTimeout(timerID);
      navigator.geolocation.clearWatch(watchID);
      foundPosition(position);
    } else {
      geoprogress(position);
    }
  };

  function stopTrying (): void {
    navigator.geolocation.clearWatch(watchID);
    foundPosition(lastCheckedPosition);
  };

  function onError  (error: PositionError): void {
    clearTimeout(timerID);
    navigator.geolocation.clearWatch(watchID);
    geolocationError(error);
  };
}
