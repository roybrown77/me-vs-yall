import * as THREE from "three";
import truckAtlasUrl from "./truck-atlas.png";
import suvTreadUrl from "./suv-tread.png";
import { loadAtlasSheet } from "./carAtlasLoader.js";

const TRUCK_ATLAS = {
  bodySide: { x: 0, y: 0, w: 1568, h: 320 },
  bodyRear: { x: 1568, y: 0, w: 480, h: 180 },
  tuffBadge: { x: 1736, y: 48, w: 144, h: 64 },
  bodyFront: { x: 1568, y: 188, w: 480, h: 180 },
  cabinSide: { x: 0, y: 336, w: 1280, h: 388 },
  cabinRear: { x: 1280, y: 336, w: 400, h: 138 },
  windshield: { x: 1280, y: 484, w: 400, h: 150 },
  roof: { x: 1700, y: 380, w: 300, h: 344 },
  hood: { x: 0, y: 736, w: 470, h: 286 },
  bedTop: { x: 1700, y: 740, w: 280, h: 280 },
};

// Atlas-textured lifted pickup for /race.
export const buildTruckCar = () => {
  const car = new THREE.Group();
  car.userData.carModel = "truck";
  const { region } = loadAtlasSheet(truckAtlasUrl);
  const tread = new THREE.TextureLoader().load(suvTreadUrl);
  tread.colorSpace = THREE.SRGBColorSpace;
  tread.wrapS = THREE.RepeatWrapping;
  tread.anisotropy = 8;
  tread.repeat.set(8, 1);

  const paint = (map) =>
    new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.38,
    });
  const glass = (map) =>
    new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: 0.14,
      metalness: 0.12,
    });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, metalness: 0.15, roughness: 0.78 });
  const rubber = new THREE.MeshStandardMaterial({ map: tread, color: 0xffffff, roughness: 0.92 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.94 });
  const rimBlack = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, metalness: 0.35, roughness: 0.55 });
  const beadlock = new THREE.MeshStandardMaterial({ color: 0xffa000, metalness: 0.55, roughness: 0.35 });
  const shockBody = new THREE.MeshStandardMaterial({ color: 0xe8ecef, metalness: 0.65, roughness: 0.32 });
  const shockLabel = new THREE.MeshStandardMaterial({ color: 0xffa000, metalness: 0.2, roughness: 0.5 });
  const tail = new THREE.MeshBasicMaterial({ color: 0xf02030 });
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff4d2 });

  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.58, 1.48), [
    paint(region(TRUCK_ATLAS.bodySide)),
    paint(region(TRUCK_ATLAS.bodySide, true)),
    paint(region(TRUCK_ATLAS.bedTop)),
    dark,
    paint(region(TRUCK_ATLAS.bodyRear, true)),
    dark,
  ]);
  bed.position.set(0, 0.94, 1.12);
  const tailgateMount = new THREE.Group();
  tailgateMount.position.set(0, 0.96, 1.865);
  const tuffPlatePulse = new THREE.Group();
  const tuffMat = paint(region(TRUCK_ATLAS.tuffBadge, true));
  tuffMat.polygonOffset = true;
  tuffMat.polygonOffsetFactor = 1;
  tuffMat.polygonOffsetUnits = 1;
  const tuffFace = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.21), tuffMat);
  tuffFace.position.z = 0.04;
  tuffPlatePulse.add(tuffFace);
  tailgateMount.add(tuffPlatePulse);
  tuffPlatePulse.userData.pulseBaseZ = 0;
  tuffPlatePulse.userData.pulseTravel = 0.05;
  tuffPlatePulse.userData.pulseScaleMul = 1.25;
  tuffPlatePulse.userData.pulseTravelMul = 1.1;
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.22, 3.52), dark);
  skirt.position.set(0, 0.52, 0.06);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.76, 1.02), [
    glass(region(TRUCK_ATLAS.cabinSide)),
    glass(region(TRUCK_ATLAS.cabinSide, true)),
    paint(region(TRUCK_ATLAS.roof)),
    dark,
    glass(region(TRUCK_ATLAS.cabinRear, true)),
    glass(region(TRUCK_ATLAS.windshield, true)),
  ]);
  cab.position.set(0, 1.18, -0.36);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.26, 1.28), [
    dark,
    dark,
    paint(region(TRUCK_ATLAS.hood)),
    dark,
    dark,
    dark,
  ]);
  hood.position.set(0, 1.1, -1.28);
  const scoopLip = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.58), paint(region(TRUCK_ATLAS.hood)));
  scoopLip.position.set(0, 1.24, -1.28);
  const scoopWell = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.42), dark);
  scoopWell.position.set(0, 1.28, -1.28);
  const fasciaFront = paint(region(TRUCK_ATLAS.bodyFront, true));
  fasciaFront.polygonOffset = true;
  fasciaFront.polygonOffsetFactor = 1;
  fasciaFront.polygonOffsetUnits = 1;
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.80, 0.12), [
    paint(region(TRUCK_ATLAS.bodySide)),
    paint(region(TRUCK_ATLAS.bodySide, true)),
    paint(region(TRUCK_ATLAS.hood)),
    dark,
    dark,
    fasciaFront,
  ]);
  fascia.position.set(0, 0.90, -1.98);
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.12, 0.08), dark);
  frontBumper.position.set(0, 0.50, -2.05);
  const headLedBar = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.04, 0.04), lamp);
  headLedBar.position.set(0, 1.25, -2.05);
  car.add(headLedBar);
  [-0.62, 0.62].forEach((x) => {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.04), lamp);
    head.position.set(x, 0.94, -2.05);
    car.add(head);
  });
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.48, 0.08), glass(region(TRUCK_ATLAS.windshield)));
  windshield.position.set(0, 1.28, -0.82);
  windshield.rotation.x = -0.24;
  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.38, 0.06), [
    dark,
    dark,
    dark,
    dark,
    glass(region(TRUCK_ATLAS.cabinRear, true)),
    dark,
  ]);
  rearGlass.position.set(0, 1.22, 0.1);
  car.add(
    bed,
    tailgateMount,
    skirt,
    cab,
    hood,
    scoopLip,
    scoopWell,
    fascia,
    frontBumper,
    windshield,
    rearGlass,
  );
  [-0.86, 0.86].forEach((x) => {
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.08), dark);
    bezel.position.set(x, 0.94, 1.86);
    const rear = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), tail);
    rear.position.set(x, 0.94, 1.9);
    car.add(bezel, rear);
  });

  [-1, 1].forEach((side) => {
    const mirror = new THREE.Group();
    mirror.position.set(side * 1.12, 1.34, -0.86);
    const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.14), dark);
    mirrorArm.position.set(-side * 0.06, -0.02, 0.08);
    const mirrorCapMat = paint(region(TRUCK_ATLAS.bodySide));
    mirrorCapMat.polygonOffset = true;
    mirrorCapMat.polygonOffsetFactor = 1;
    mirrorCapMat.polygonOffsetUnits = 1;
    const mirrorCap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.13, 0.24), mirrorCapMat);
    mirrorCap.renderOrder = 2;
    const mirrorAccentMat = beadlock.clone();
    mirrorAccentMat.polygonOffset = true;
    mirrorAccentMat.polygonOffsetFactor = 2;
    mirrorAccentMat.polygonOffsetUnits = 2;
    const mirrorAccent = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.035, 0.05), mirrorAccentMat);
    mirrorAccent.position.set(0, 0.05, 0.125);
    mirrorAccent.renderOrder = 3;
    mirror.add(mirrorArm, mirrorCap, mirrorAccent);
    car.add(mirror);
  });

  const addFlare = (x, z) => {
    const flare = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.78), dark);
    flare.position.set(x, 0.74, z);
    car.add(flare);
  };
  addFlare(-1.1, -1.02);
  addFlare(1.1, -1.02);
  addFlare(-1.1, 1.06);
  addFlare(1.1, 1.06);

  const addShock = (x, z) => {
    const shock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 10), shockBody);
    shock.position.set(x * 0.72, 0.58, z);
    shock.rotation.z = x > 0 ? -0.22 : 0.22;
    const label = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.04), shockLabel);
    label.position.set(x * 0.72, 0.72, z + 0.08);
    car.add(shock, label);
  };
  addShock(-1, -0.95);
  addShock(1, -0.95);
  addShock(-1, 0.98);
  addShock(1, 0.98);

  const wheelGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.36, 28);
  const axles = [];
  [[-1.1, -1.02], [1.1, -1.02], [-1.1, 1.04], [1.1, 1.04]].forEach(([x, z], index) => {
    const axle = new THREE.Group();
    axle.name = `Axle_${index}`;
    axle.position.set(x, 0.5, z);
    const wheel = new THREE.Mesh(wheelGeo, rubber);
    wheel.rotation.z = Math.PI / 2;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.38, 16), rimBlack);
    rim.rotation.z = Math.PI / 2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.038, 10, 28), beadlock);
    ring.rotation.y = Math.PI / 2;
    for (let spoke = 0; spoke < 8; spoke += 1) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.03), rimBlack);
      blade.rotation.z = (spoke / 8) * Math.PI;
      blade.position.set(0, 0, 0.2);
      rim.add(blade);
    }
    axle.add(wheel, rim, ring);
    car.add(axle);
    axles.push(axle);
  });

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.68, 20),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.05;
  shadow.name = "CarShadow";
  car.add(shadow);

  car.traverse((child) => {
    if (child.isMesh && child.name !== "CarShadow") {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  car.userData.axles = axles;
  car.userData.musicPulse = tuffPlatePulse;
  car.scale.set(0.72, 1, 1);
  return car;
};
