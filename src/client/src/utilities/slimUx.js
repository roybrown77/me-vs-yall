const SLIM_UX_KEY = "slimUxToggle";

export const hasSlimUxPreference = () =>
  localStorage.getItem(SLIM_UX_KEY) != null;

export const getSlimUx = () => {
  return localStorage.getItem(SLIM_UX_KEY) ?? "0";
};

export const setSlimUx = (value) => {
  localStorage.setItem(SLIM_UX_KEY, value);
};

export const isSlimUxEnabled = () => getSlimUx() === "1";
