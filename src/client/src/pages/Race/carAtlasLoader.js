import * as THREE from "three";

export const ATLAS_W = 2048;
export const ATLAS_H = 1024;

const applyAtlasRegion = (map, area, flipU = false) => {
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const spanX = area.w / ATLAS_W;
  const spanY = area.h / ATLAS_H;
  map.repeat.set(flipU ? -spanX : spanX, spanY);
  map.offset.set(
    flipU ? (area.x + area.w) / ATLAS_W : area.x / ATLAS_W,
    1 - (area.y + area.h) / ATLAS_H,
  );
};

// Loads a texture atlas and exposes UV region helpers for race car materials.
export const loadAtlasSheet = (url) => {
  const maps = [];
  const sheet = new THREE.TextureLoader().load(url, (loaded) => {
    maps.forEach((map) => {
      if (!map.image) map.image = loaded.image;
      map.needsUpdate = true;
    });
  });
  sheet.colorSpace = THREE.SRGBColorSpace;
  const region = (area, flipU = false) => {
    const map = sheet.clone();
    applyAtlasRegion(map, area, flipU);
    if (sheet.image) {
      map.image = sheet.image;
      map.needsUpdate = true;
    }
    maps.push(map);
    return map;
  };
  return { region };
};
