export const CAR_MODELS = ["suv", "truck"];

export const CAR_MODEL_LABELS = {
  suv: "Snowball",
  truck: "Tuff Truck",
};

export const DEFAULT_CAR_MODEL = "suv";

export const isCarModel = (id) => CAR_MODELS.includes(id);

export const normalizeCarModel = (id) => (isCarModel(id) ? id : DEFAULT_CAR_MODEL);
