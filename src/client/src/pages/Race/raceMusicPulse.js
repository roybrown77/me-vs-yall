// Push rear pulse geometry along local +Z only (no tire / payload squish).
export const musicPulseScale = (bump, depthGain = 1) => {
  const clamped = Math.max(0, Math.min(1, bump));
  return {
    x: 1,
    y: 1,
    z: 1 + clamped * 0.475 * depthGain,
  };
};

// Fast attack / slower decay so hits track the beat; optional Z travel on the mesh group.
export const applyMusicPulse = (pulseObject, bump, state, dt = 1 / 60) => {
  if (!pulseObject) return state;
  const target = Math.max(0, Math.min(1, bump));
  const frame = Math.max(1 / 120, Math.min(0.05, dt));
  const attack = 1 - Math.exp(-frame * 38);
  const decay = 1 - Math.exp(-frame * 9);
  const next = target > state
    ? state + (target - state) * attack
    : state + (target - state) * decay;
  const depthGain = pulseObject.userData.pulseScaleMul ?? 1;
  const travelMul = pulseObject.userData.pulseTravelMul ?? 1;
  const { x, y, z } = musicPulseScale(next, depthGain);
  pulseObject.scale.set(x, y, z);
  const travel = pulseObject.userData.pulseTravel;
  if (typeof travel === "number") {
    const baseZ = pulseObject.userData.pulseBaseZ ?? 0;
    const anchorZ = pulseObject.userData.pulseAnchorZ;
    const offset = next * travel * travelMul;
    pulseObject.position.z = typeof anchorZ === "number" ? anchorZ + offset : baseZ + offset;
  }
  return next;
};
