const {
  getCarMakes,
  getModelsByMake,
  getVehicleTypesByMake,
} = require("../services/vehicleService");
const getMakes = async (req, res) => {
  try {
    const makes = await getCarMakes();

    res.status(200).json({
      count: makes.length,
      makes,
    });
  } catch (error) {
    console.error("Vehicle makes error:", error.message);

    res.status(500).json({
      message: "Could not get vehicle makes",
    });
  }
};
const getModels = async (req, res) => {
  try {
    const { make } = req.params;

    const models = await getModelsByMake(make);

    res.status(200).json({
      make,
      count: models.length,
      models,
    });
  } catch (error) {
    console.error("Vehicle models error:", error.message);

    res.status(500).json({
      message: "Could not get vehicle models",
    });
  }
};
const getVehicleTypes = async (req, res) => {
  try {
    const { make } = req.params;

    const types = await getVehicleTypesByMake(make);

    res.status(200).json({
      make,
      count: types.length,
      types,
    });
  } catch (error) {
    console.error("Vehicle types error:", error.message);

    res.status(500).json({
      message: "Could not get vehicle types",
    });
  }
};
module.exports = {
  getMakes,
  getModels,
    getVehicleTypes,
};