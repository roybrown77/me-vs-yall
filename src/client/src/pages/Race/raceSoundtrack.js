/**
 * Race BGM — royalty-free instrumentals (Pixabay Content License).
 * Southern trap: Mixkit Free License, "Waka Floka Type" (Arulo).
 * 80s synth: Kevin MacLeod "Exit the Premises" (incompetech.com), CC BY 4.0.
 * Other tracks: Pixabay Content License.
 */
import raceTrapBeatUrl from "../../media/race-trap-beat.mp3";
import raceUpbeatBeatUrl from "../../media/race-hiphop-upbeat.mp3";
import raceSouthernTrapUrl from "../../media/race-southern-trap.mp3";
import raceReggaeUrl from "../../media/boasty-full.m4a";
import raceDrizzyDustUrl from "../../media/drizzy-dust.m4a";
import neonLaserHorizonUrl from "../../media/neon-laser-horizon.mp3";
import newerWaveUrl from "../../media/newer-wave.mp3";

export const MUSIC_OFF = "off";

export const RACE_MUSIC_TRACKS = {
  // trap: {
  //   id: "trap",
  //   label: "Soulful Adventure",
  //   url: raceTrapBeatUrl,
  // },
  // upbeat: {
  //   id: "upbeat",
  //   label: "East Coast Journey",
  //   url: raceUpbeatBeatUrl,
  // },
  // southernTrap: {
  //   id: "southernTrap",
  //   label: "Southern Trap Run",
  //   url: raceSouthernTrapUrl,
  // },
  reggae: {
    id: "reggae",
    label: "Boasty Expedition",
    url: raceReggaeUrl,
  },
  drizzyDust: {
    id: "drizzyDust",
    label: "Drizzy Dust Drive",
    url: raceDrizzyDustUrl,
  },
  eightiesNeonLaserHorizon: {
    id: "eightiesNeonLaserHorizon",
    label: "80s Neon Run",
    url: neonLaserHorizonUrl,
  },
  eightiesNewerWave: {
    id: "eightiesNewerWave",
    label: "80s Newer Wave",
    url: newerWaveUrl,
  },
};

// Returns Off plus all BGM tracks for the music picker.
export const listRaceMusicTracks = () => [
  { id: MUSIC_OFF, label: "Off" },
  ...Object.values(RACE_MUSIC_TRACKS),
];

// True if the id is Off or a known soundtrack track.
export const isRaceMusicTrack = (id) => id === MUSIC_OFF || Boolean(RACE_MUSIC_TRACKS[id]);

// Creates a looping HTMLAudio BGM controller for the race.
export function createRaceSoundtrack(initialTrackId = "eightiesNewerWave") {
  let trackId = isRaceMusicTrack(initialTrackId) ? initialTrackId : "eightiesNewerWave";
  let songId = trackId === MUSIC_OFF ? "eightiesNewerWave" : trackId;
  const audio = new Audio(RACE_MUSIC_TRACKS[songId].url);
  audio.loop = true;
  audio.preload = "auto";

  let started = false;
  let enabled = trackId !== MUSIC_OFF;
  let analyser = null;
  let freqData = null;
  let timeData = null;
  let mediaSource = null;
  let prevBass = 0;

  // Routes BGM through the shared AudioContext for bass metering.
  const bindAnalyser = (ctx) => {
    if (!ctx || mediaSource) return;
    try {
      mediaSource = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.42;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      timeData = new Uint8Array(analyser.fftSize);
      mediaSource.connect(analyser);
      analyser.connect(ctx.destination);
    } catch {
      analyser = null;
      freqData = null;
    }
  };

  // Swaps the audio element source and optionally resumes playback.
  const applyTrack = (id, resume) => {
    songId = id;
    trackId = id;
    audio.src = RACE_MUSIC_TRACKS[songId].url;
    audio.load();
    if (resume && enabled) {
      audio.play().catch(() => {});
    }
  };

  return {
    // Starts or resumes BGM when music is enabled.
    start() {
      if (!enabled) return;
      if (started) {
        if (audio.paused) audio.play().catch(() => {});
        return;
      }
      started = true;
      audio.play().catch(() => {
        started = false;
      });
    },
    // Stops playback and resets the audio element.
    stop() {
      started = false;
      audio.pause();
      audio.currentTime = 0;
    },
    // Sets output volume respecting the Off state.
    setMasterVolume(level) {
      audio.volume = enabled ? Math.min(1, Math.max(0, level)) : 0;
    },
    bindAnalyser,
    // Normalized bass bump for rear “speaker cone” visuals (0 when Off / muted).
    getPulseLevel() {
      if (!enabled || audio.paused || audio.volume <= 0.001) {
        prevBass = 0;
        return 0;
      }
      const volGain = audio.volume / 0.28;
      if (analyser && freqData && timeData) {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        let bass = 0;
        const bins = Math.min(10, freqData.length);
        for (let i = 0; i < bins; i += 1) bass += freqData[i];
        bass /= bins * 255;
        const punch = Math.max(0, bass - prevBass * 0.72);
        prevBass = bass;
        let peak = 0;
        for (let i = 0; i < timeData.length; i += 1) {
          const v = Math.abs(timeData[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        const hit = Math.min(1, bass * 2.2 + punch * 5.5 + peak * 0.85);
        return Math.min(1, hit * volGain);
      }
      const t = performance.now() * 0.001;
      const kick = Math.max(0, Math.sin(t * 10.8)) ** 4;
      const snare = Math.max(0, Math.sin(t * 21.6)) ** 10;
      return Math.min(1, volGain * (kick * 0.92 + snare * 0.35));
    },
    // Returns the current track id including Off.
    getTrackId() {
      return trackId;
    },
    // Changes track, handling Off without leaving a stale src playing.
    setTrack(id) {
      const next = isRaceMusicTrack(id) ? id : trackId;
      if (next === trackId) return trackId;
      if (next === MUSIC_OFF) {
        enabled = false;
        trackId = MUSIC_OFF;
        audio.pause();
        audio.volume = 0;
        return trackId;
      }
      const wasOff = !enabled;
      enabled = true;
      const resume = wasOff || (started && !audio.paused);
      applyTrack(next, resume);
      if (wasOff) started = true;
      return trackId;
    },
  };
}

// Returns BGM master volume for the current game phase.
export const soundtrackVolumeForPhase = (phase, racing) => {
  if (phase === "title") return 0.38;
  if (phase === "countdown") return 0.34;
  if (phase === "tutorial") return 0.3;
  if (phase === "racing") return racing ? 0.3 : 0;
  if (phase === "finished") return 0.32;
  return 0;
};
