import * as THREE from "three";
import suvAtlasUrl from "./suv-atlas.png";
import suvTreadUrl from "./suv-tread.png";
import { loadAtlasSheet } from "./carAtlasLoader.js";

const SUV_ATLAS = {
  bodySide: { x: 0, y: 0, w: 1568, h: 320 },
  bodyRear: { x: 1568, y: 0, w: 480, h: 180 },
  bodyFront: { x: 1568, y: 188, w: 480, h: 180 },
  cabinSide: { x: 0, y: 336, w: 1280, h: 388 },
  cabinRear: { x: 1280, y: 336, w: 400, h: 138 },
  windshield: { x: 1280, y: 484, w: 400, h: 150 },
  roof: { x: 1700, y: 380, w: 300, h: 344 },
  spare: { x: 1700, y: 740, w: 280, h: 280 },
  hood: { x: 0, y: 736, w: 470, h: 286 },
};

// Atlas-textured Bronco-style SUV (default race car).
export const buildSuvCar = () => {
  const car = new THREE.Group();
  car.userData.carModel = "suv";
  const { region } = loadAtlasSheet(suvAtlasUrl);
  const tread = new THREE.TextureLoader().load(suvTreadUrl);
  tread.colorSpace = THREE.SRGBColorSpace;
  tread.wrapS = THREE.RepeatWrapping;
  tread.anisotropy = 8;
  tread.repeat.set(7, 1);

  const paint = (map) =>
    new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.06,
    });
  const glass = (map) =>
    new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: 0.16,
      metalness: 0.08,
    });
  const dark = new THREE.MeshStandardMaterial({ color: 0x14181d, metalness: 0.2, roughness: 0.72 });
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff4d2 });
  const tail = new THREE.MeshBasicMaterial({ color: 0xf4f7fb });
  const rubber = new THREE.MeshStandardMaterial({ map: tread, color: 0xffffff, roughness: 0.92 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: 0.94 });
  const alloy = new THREE.MeshStandardMaterial({ color: 0xc5ccd4, metalness: 0.82, roughness: 0.28 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x2f5f92, metalness: 0.15, roughness: 0.4 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.7, 3.42), [
    paint(region(SUV_ATLAS.bodySide)),
    paint(region(SUV_ATLAS.bodySide, true)),
    paint(region(SUV_ATLAS.hood)),
    dark,
    paint(region(SUV_ATLAS.bodyRear, true)),
    paint(region(SUV_ATLAS.bodyFront, true)),
  ]);
  body.position.set(0, 0.86, 0.04);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.22, 3.52), dark);
  skirt.position.set(0, 0.48, 0.04);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.58, 1.92), [
    glass(region(SUV_ATLAS.cabinSide)),
    glass(region(SUV_ATLAS.cabinSide, true)),
    paint(region(SUV_ATLAS.roof)),
    dark,
    glass(region(SUV_ATLAS.cabinRear, true)),
    glass(region(SUV_ATLAS.windshield, true)),
  ]);
  cabin.position.set(0, 1.38, 0.18);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.1, 1.05), [
    dark,
    dark,
    paint(region(SUV_ATLAS.hood)),
    dark,
    dark,
    dark,
  ]);
  hood.position.set(0, 1.18, -1.05);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.46, 0.06), glass(region(SUV_ATLAS.windshield)));
  windshield.position.set(0, 1.38, -0.74);
  windshield.rotation.x = -0.28;
  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.4, 0.06), [
    dark,
    dark,
    dark,
    dark,
    glass(region(SUV_ATLAS.cabinRear, true)),
    dark,
  ]);
  rearGlass.position.set(0, 1.32, 1.12);
  const accentBar = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.07, 0.06), accent);
  accentBar.position.set(0, 1.54, 1.14);
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.2, 0.16), dark);
  bumper.position.set(0, 0.52, 1.74);
  car.add(body, skirt, cabin, hood, windshield, rearGlass, accentBar, bumper);
  [-0.64, 0.64].forEach((x) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.045, 1.55), dark);
    rail.position.set(x, 1.72, 0.16);
    car.add(rail);
  });
  [-1, 1].forEach((side) => {
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), dark);
    mirror.position.set(side * 0.99, 1.28, -0.55);
    car.add(mirror);
  });

  [-0.62, 0.62].forEach((x) => {
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.08), lamp);
    head.position.set(x, 0.78, -1.7);
    car.add(head);
  });
  [-0.78, 0.78].forEach((x) => {
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.08), dark);
    bezel.position.set(x, 0.92, 1.76);
    const rear = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.56, 0.1), tail);
    rear.position.set(x, 0.92, 1.8);
    car.add(bezel, rear);
  });

  const spare = new THREE.Group();
  spare.position.set(0, 0.84, 1.96);
  const spareTire = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 16, 32), tire);
  spare.add(spareTire);
  const spareCone = new THREE.Group();
  const spareRim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), alloy);
  spareRim.rotation.x = Math.PI / 2;
  spareRim.position.z = 0.04;
  const spareCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 10), alloy);
  spareCap.rotation.x = Math.PI / 2;
  spareCap.position.z = 0.06;
  spareCone.add(spareRim, spareCap);
  for (let spoke = 0; spoke < 6; spoke += 1) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.04), alloy);
    blade.position.z = 0.07;
    blade.rotation.z = (spoke / 6) * Math.PI;
    spareCone.add(blade);
  }
  const spareFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 40),
    new THREE.MeshStandardMaterial({
      map: region(SUV_ATLAS.spare),
      roughness: 0.8,
      metalness: 0.1,
    }),
  );
  spareFace.position.z = 0.13;
  spareCone.add(spareFace);
  spare.add(spareCone);
  spareCone.userData.pulseBaseZ = 0;
  spareCone.userData.pulseTravel = 0.08;
  car.add(spare);
  car.userData.musicPulse = spareCone;

  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 28);
  const axles = [];
  [[-1.02, -1.12], [1.02, -1.12], [-1.02, 1.16], [1.02, 1.16]].forEach(([x, z], index) => {
    const axle = new THREE.Group();
    axle.name = `Axle_${index}`;
    axle.position.set(x, 0.38, z);
    const wheel = new THREE.Mesh(wheelGeo, rubber);
    wheel.rotation.z = Math.PI / 2;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 12), alloy);
    cap.rotation.z = Math.PI / 2;
    axle.add(wheel, cap);
    car.add(axle);
    axles.push(axle);
  });

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.55, 20),
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
  return car;
};
