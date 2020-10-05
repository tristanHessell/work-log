/* globals google */
import { Place } from "./types";

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

interface Coordinates {
  latitude: number;
  longitude: number;
}

async function getCoordinates(): Promise<Coordinates> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        resolve(coords);
      },
      () => {
        /* TODO */
      },
      { enableHighAccuracy: true }
    );
  });
}

// https://developers.google.com/maps/documentation/javascript/geocoding
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
          });
        }
      }
    );
  });
}
