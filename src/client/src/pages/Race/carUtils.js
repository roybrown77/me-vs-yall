// Frees GPU resources for a procedural race car group.
export const disposeCarGroup = (car) => {
  if (!car) return;
  car.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose?.();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        material?.map?.dispose?.();
        material?.dispose?.();
      });
    }
  });
};
