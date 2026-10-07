const SPREAD_MODE_KEY = "spreadModeToggle";

export const hasSpreadModePreference = () =>
  localStorage.getItem(SPREAD_MODE_KEY) != null;

export const getSpreadMode = () => {
  return localStorage.getItem(SPREAD_MODE_KEY) ?? "0";
};

export const setSpreadMode = (value) => {
  localStorage.setItem(SPREAD_MODE_KEY, value);
};

export const isSpreadModeEnabled = () => getSpreadMode() === "1";
