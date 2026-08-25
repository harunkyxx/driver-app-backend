const getDistanceKm = async (origin, destination) => {
  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
      },
      body: JSON.stringify({
        origin: {
          address: origin,
        },
        destination: {
          address: destination,
        },
        travelMode: "DRIVE",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Routes API error: ${error}`);
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found");
  }

  const distanceMeters = data.routes[0].distanceMeters;

  return distanceMeters / 1000;
};

module.exports = {
  getDistanceKm,
};