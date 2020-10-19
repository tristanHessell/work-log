/* globals google */
import { Place, TravelItem, GeolocationError } from "./types";
import { saveItem, getItems, deleteItem } from "./db";

const USER_ID = "06bab29e-1cd7-4a59-8130-dd3f41db9c49";
// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_requests
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
  return new Promise((resolve, reject) => {
    // resolve({
    //   altitude: null,
    //   altitudeAccuracy: null,
    //   heading: null,
    //   speed: null,
    //   accuracy: 10,
    //   latitude: 10,
    //   longitude: 10,
    // });
    getAccurateCurrentPosition(
      (position: Position) => resolve(position.coords),
      (error: PositionError | Error) => reject(error)
    );
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
            name: name || "TEST",
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
          });
        }
      }
    );
  });
}

export async function fetchTravelItems(
  effectiveDate: string
): Promise<TravelItem[]> {
  return getItems<TravelItem>(
    `travelItems/${USER_ID}/dates/${effectiveDate}/blah`
  );
}

/* */
export async function saveTravelItem(
  item: TravelItem,
  effectiveDate: string
): Promise<void> {
  try {
    console.log("saveTraveItem", item);
    await saveItem(
      `travelItems/${USER_ID}/dates/${effectiveDate}/blah/${item.id}`,
      item
    );
  } catch (e) {
    // TODO
    console.log(e);
  }
}

export async function deleteTravelItem(
  id: string,
  effectiveDate: string
): Promise<void> {
  try {
    await deleteItem(
      `travelItems/${USER_ID}/dates/${effectiveDate}/blah/${id}`
    );
  } catch (e) {
    // TODO
  }
}

type AccuratePositionOptions = PositionOptions & {
  maxWait: number;
  timeout: number;
  accuracy: number;
};

function getAccuratePositionOptions(
  options: Partial<AccuratePositionOptions>
): AccuratePositionOptions {
  const maxWait = options.maxWait || 30000;
  return {
    ...options,
    maxWait,
    timeout: options.timeout || maxWait,
    accuracy: options.accuracy || 20,
    maximumAge: 0,
    enableHighAccuracy: true,
  };
}

type GenericErrorHandler = (error: Error) => void;

// https://github.com/gregsramblings/getAccurateCurrentPosition/blob/master/geo.js
export function getAccurateCurrentPosition(
  geolocationSuccess: PositionCallback,
  geolocationError: (error: Error | PositionError) => void,
  opts: Partial<AccuratePositionOptions> = {}
): void {
  let locationEventCount = 0;
  let lastAccuracy = 0;

  const options = getAccuratePositionOptions(opts);

  const watchID = navigator.geolocation.watchPosition(
    checkLocation,
    onError,
    options
  );
  const timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop

  function foundPosition(position: Position): void {
    geolocationSuccess(position);
  }

  function checkLocation(position: Position): void {
    locationEventCount = locationEventCount + 1;
    // We ignore the first event unless it's the only one received because some devices seem to send a cached
    // location even when maximumAge is set to zero
    lastAccuracy = position.coords.accuracy;
    if (
      position.coords.accuracy <= options.accuracy &&
      locationEventCount > 1
    ) {
      clearTimeout(timerID);
      navigator.geolocation.clearWatch(watchID);
      foundPosition(position);
    }
  }

  // if you cant get a location within the correct range
  function stopTrying(): void {
    navigator.geolocation.clearWatch(watchID);
    geolocationError(
      new GeolocationError(
        new Error(`Could not get accurate position: ${lastAccuracy}`)
      )
    );
  }

  function onError(error: PositionError): void {
    clearTimeout(timerID);
    navigator.geolocation.clearWatch(watchID);
    geolocationError(new GeolocationError(error));
  }
}
