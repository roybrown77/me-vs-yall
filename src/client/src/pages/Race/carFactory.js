import { buildSuvCar } from "./carSuv.js";
import { buildTruckCar } from "./carTruck.js";
import { normalizeCarModel } from "./carModel.js";

// Builds the active race car mesh for the selected model id.
export const buildRaceCar = (modelId) => {
  const id = normalizeCarModel(modelId);
  if (id === "truck") return buildTruckCar();
  return buildSuvCar();
};
