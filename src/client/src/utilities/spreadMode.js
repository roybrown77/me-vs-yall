const SPREAD_MODE_PARAM = "spreadMode";

const normalizeToBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "1") return true;
  if (value === "0") return false;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
};

export const getSpreadMode = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(SPREAD_MODE_PARAM) ?? "false";
  } catch (e) {
    return "false";
  }
};

export const setSpreadMode = (value) => {
  try {
    const enabled = normalizeToBoolean(value);
    const url = new URL(window.location.href);
    url.searchParams.set(SPREAD_MODE_PARAM, enabled ? "true" : "false");
    window.history.replaceState({}, "", url.toString());
  } catch (e) {
    // ignore
  }
};

export const isSpreadModeEnabled = () => normalizeToBoolean(getSpreadMode());
