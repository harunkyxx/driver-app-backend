const getCarMakes = async () => {
  const response = await fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
  );

  if (!response.ok) {
    throw new Error("Vehicle API error");
  }

  const data = await response.json();

  return data.Results.map((vehicle) => ({
    id: vehicle.MakeId,
    name: vehicle.MakeName,
  }));
};
const getModelsByMake = async (make) => {
  const response = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`
  );

  if (!response.ok) {
    throw new Error("Vehicle API error");
  }

  const data = await response.json();

  return data.Results.map((vehicle) => ({
    id: vehicle.Model_ID,
    make: vehicle.Make_Name,
    model: vehicle.Model_Name,
  }));
};
const getVehicleTypesByMake = async (make) => {
  const response = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/${encodeURIComponent(make)}?format=json`
  );

  if (!response.ok) {
    throw new Error("Vehicle API error");
  }

  const data = await response.json();

  return data.Results.map((vehicle) => ({
    typeId: vehicle.VehicleTypeId,
    type: vehicle.VehicleTypeName,
  }));
};
module.exports = {
  getCarMakes,
  getModelsByMake,
  getVehicleTypesByMake,
};