export const MOUNTAIN_STYLES = ["classic", "icy"];

export const MOUNTAIN_STYLE_LABELS = {
  classic: "Black Mountains",
  icy: "Icy",
};

// Returns whether the id is a valid mountain style preset.
export const isMountainStyle = (id) => MOUNTAIN_STYLES.includes(id);
