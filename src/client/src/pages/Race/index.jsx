import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./race.css";
import { RACE_SPEED, formatRaceSpeed } from "./speed";
import { listRaceMusicTracks } from "./raceSoundtrack";
import { MOUNTAIN_STYLE_LABELS, MOUNTAIN_STYLES } from "./mountainStyle";
import { CAR_MODEL_LABELS, CAR_MODELS } from "./carModel";
import {
  COURSE_PROFILE_LABELS,
  ROAD_SCALE_LABELS,
  stepCourseProfile,
  stepRoadScale,
} from "./courseLayout";
import { getRaceSessionSettings } from "./raceSession";
import RaceTrackMap from "./RaceTrackMap.jsx";

const TUTORIAL_COPY_FADE_MS = 900;

const RaceTutorialCopy = () => (
  <>
    <div className="race-tutorial-kicker">Tutorial</div>
    <p className="race-tutorial-title">Press and hold left &amp; right arrows to steer</p>
  </>
);

const RaceHeroButton = ({ label, className = "", onClick }) => (
  <button type="button" className={`race-start race-start-hero ${className}`.trim()} onClick={onClick}>
    <span className="race-start-hero-shine" aria-hidden="true" />
    <span className="race-start-hero-inner">
      <span className="race-start-label">
        {label}
        <span className="race-start-arrows" aria-hidden="true">
          <svg viewBox="0 0 28 20" width="28" height="20" focusable="false">
            <path d="M2 2 L12 10 L2 18 Z" fill="currentColor" opacity="0.42" />
            <path d="M14 2 L24 10 L14 18 Z" fill="currentColor" />
          </svg>
        </span>
      </span>
    </span>
  </button>
);

// UI control to adjust race pace multiplier in 50% steps.
const SpeedPicker = ({ multiplier, onChange }) => (
  <div className="race-length">
    <button
      type="button"
      aria-label="slower pace"
      disabled={multiplier <= RACE_SPEED.min}
      onClick={() => onChange(multiplier - RACE_SPEED.step)}
    >
      −
    </button>
    <div>
      <strong>{formatRaceSpeed(multiplier)}</strong>
      <span>Speed</span>
    </div>
    <button
      type="button"
      aria-label="faster pace"
      disabled={multiplier >= RACE_SPEED.max}
      onClick={() => onChange(multiplier + RACE_SPEED.step)}
    >
      +
    </button>
  </div>
);

const MUSIC_TRACKS = listRaceMusicTracks();

// UI control to cycle through soundtrack tracks including Off.
const MusicPicker = ({ trackId, onChange }) => {
  const index = Math.max(0, MUSIC_TRACKS.findIndex((t) => t.id === trackId));
  const track = MUSIC_TRACKS.find((item) => item.id === trackId) ?? MUSIC_TRACKS[0];
  // Advances or rewinds the track list with wrap-around.
  const step = (delta) => {
    const next = MUSIC_TRACKS[(index + delta + MUSIC_TRACKS.length) % MUSIC_TRACKS.length];
    onChange(next.id);
  };
  return (
    <div className="race-length">
      <button type="button" aria-label="previous music track" onClick={() => step(-1)}>
        −
      </button>
      <div>
        <strong>{track.label}</strong>
        <span>Music</span>
      </div>
      <button type="button" aria-label="next music track" onClick={() => step(1)}>
        +
      </button>
    </div>
  );
};

// UI control to cycle 1× / 2× / 3× physical road length.
const RoadScalePicker = ({ scale, onChange }) => (
  <div className="race-length">
    <button type="button" aria-label="shorter road" onClick={() => onChange(stepRoadScale(scale, -1))}>
      −
    </button>
    <div>
      <strong>{ROAD_SCALE_LABELS[scale] ?? "Standard"}</strong>
      <span>Road</span>
    </div>
    <button type="button" aria-label="longer road" onClick={() => onChange(stepRoadScale(scale, 1))}>
      +
    </button>
  </div>
);

// UI control to cycle turns / hills course profiles.
const CourseProfilePicker = ({ profileId, onChange }) => (
  <div className="race-length">
    <button type="button" aria-label="previous course profile" onClick={() => onChange(stepCourseProfile(profileId, -1))}>
      −
    </button>
    <div>
      <strong>{COURSE_PROFILE_LABELS[profileId] ?? "Standard"}</strong>
      <span>Course</span>
    </div>
    <button type="button" aria-label="next course profile" onClick={() => onChange(stepCourseProfile(profileId, 1))}>
      +
    </button>
  </div>
);

// UI control to cycle Snowball vs Tuff Truck.
const CarModelPicker = ({ modelId, onChange }) => {
  const index = Math.max(0, CAR_MODELS.indexOf(modelId));
  const step = (delta) => {
    const next = CAR_MODELS[(index + delta + CAR_MODELS.length) % CAR_MODELS.length];
    onChange(next);
  };
  return (
    <div className="race-length">
      <button type="button" aria-label="previous car" onClick={() => step(-1)}>
        −
      </button>
      <div>
        <strong>{CAR_MODEL_LABELS[modelId] ?? "Snowball"}</strong>
        <span>Car</span>
      </div>
      <button type="button" aria-label="next car" onClick={() => step(1)}>
        +
      </button>
    </div>
  );
};

// UI control to toggle Black Mountains vs Icy mountain rendering.
const MountainPicker = ({ styleId, onChange }) => {
  const index = Math.max(0, MOUNTAIN_STYLES.indexOf(styleId));
  // Cycles mountain style presets with wrap-around.
  const step = (delta) => {
    const next = MOUNTAIN_STYLES[(index + delta + MOUNTAIN_STYLES.length) % MOUNTAIN_STYLES.length];
    onChange(next);
  };
  return (
    <div className="race-length">
      <button type="button" aria-label="previous mountain style" onClick={() => step(-1)}>
        −
      </button>
      <div>
        <strong>{MOUNTAIN_STYLE_LABELS[styleId] ?? "Black Mountains"}</strong>
        <span>Mountains</span>
      </div>
      <button type="button" aria-label="next mountain style" onClick={() => step(1)}>
        +
      </button>
    </div>
  );
};

const MOBILE_STEER_BOUNCE_QUERY = "(max-width: 640px)";

const bounceSteerButton = (button) => {
  if (!button || !window.matchMedia(MOBILE_STEER_BOUNCE_QUERY).matches) {
    return;
  }
  button.classList.remove("race-tutorial-steer--bounce");
  void button.offsetWidth;
  button.classList.add("race-tutorial-steer--bounce");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    button.classList.remove("race-tutorial-steer--bounce");
  }
};

// Pointer handlers that drive on-screen left/right steer buttons.
const bindSteer = (raceRef, side) => ({
  onPointerDown: (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    bounceSteerButton(event.currentTarget);
    raceRef.current?.setTutorialSteer(side, true);
    raceRef.current?.unlockAudio?.();
  },
  onAnimationEnd: (event) => {
    if (String(event.animationName || "").includes("race-tutorial-steer-bounce")) {
      event.currentTarget.classList.remove("race-tutorial-steer--bounce");
    }
  },
  onPointerUp: (event) => {
    event.preventDefault();
    raceRef.current?.setTutorialSteer(side, false);
  },
  onPointerCancel: (event) => {
    event.preventDefault();
    raceRef.current?.setTutorialSteer(side, false);
  },
  onContextMenu: (event) => {
    event.preventDefault();
  },
});

// Diamond left/right buttons wired to the engine steer API.
const RaceSteerButtons = ({ raceRef, leftButtonRef, rightButtonRef }) => (
  <div className="race-tutorial-steer-row">
    <button
      ref={leftButtonRef}
      type="button"
      className="race-tutorial-steer race-tutorial-steer-left"
      aria-label="Steer left"
      {...bindSteer(raceRef, "left")}
    >
      <span aria-hidden="true">◀</span>
    </button>
    <button
      ref={rightButtonRef}
      type="button"
      className="race-tutorial-steer race-tutorial-steer-right"
      aria-label="Steer right"
      {...bindSteer(raceRef, "right")}
    >
      <span aria-hidden="true">▶</span>
    </button>
  </div>
);

// Tutorial overlay with copy, lane guide, and steer buttons.
const RaceTutorial = ({ raceRef, leftButtonRef, rightButtonRef }) => (
  <div className="race-steer-overlay">
    <div className="race-tutorial-copy">
      <RaceTutorialCopy />
    </div>
    <div className="race-tutorial-lane" aria-hidden="true" />
    <RaceSteerButtons
      raceRef={raceRef}
      leftButtonRef={leftButtonRef}
      rightButtonRef={rightButtonRef}
    />
  </div>
);

// Full-screen race page: React UI shell around the WebGL engine.
const Race = () => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const raceRef = useRef(null);
  const sessionRef = useRef(getRaceSessionSettings());
  const speedRef = useRef(sessionRef.current.speedMultiplier);
  const [phase, setPhase] = useState("loading");
  const [load, setLoad] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [result, setResult] = useState(null);
  const [runLaunched, setRunLaunched] = useState(false);
  const [finishPresentationReady, setFinishPresentationReady] = useState(false);
  const [titleSettingsVisible, setTitleSettingsVisible] = useState(false);
  const timeRef = useRef(null);
  const boostRef = useRef(null);
  const progressRef = useRef(null);
  const trackMapRef = useRef(null);
  const steerLeftButtonRef = useRef(null);
  const steerRightButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [musicTrack, setMusicTrack] = useState(() => sessionRef.current.musicTrackId);
  const [mountainStyle, setMountainStyle] = useState(() => sessionRef.current.mountainStyle);
  const [carModel, setCarModel] = useState(() => sessionRef.current.carModelId);
  const [roadScale, setRoadScale] = useState(() => sessionRef.current.roadScale);
  const [courseProfile, setCourseProfile] = useState(() => sessionRef.current.courseProfile);
  const [steerButtonsHidden, setSteerButtonsHidden] = useState(false);
  const [tutorialCopyPhase, setTutorialCopyPhase] = useState("hidden");
  const [tutorialCopyFadeActive, setTutorialCopyFadeActive] = useState(false);
  const [raceSpeed, setRaceSpeed] = useState(speedRef.current);
  const trackMapVisible = phase === "racing" && tutorialCopyPhase === "hidden";
  // Syncs React state and engine when pace multiplier changes.
  const changeSpeed = (multiplier) => {
    const applied = raceRef.current?.setSpeed(multiplier) ?? multiplier;
    speedRef.current = applied;
    setRaceSpeed(applied);
  };

  // Syncs React state and engine when BGM track changes.
  const changeMusicTrack = (id) => {
    const applied = raceRef.current?.setMusicTrack(id) ?? id;
    setMusicTrack(applied);
  };

  // Syncs React state and engine when mountain style changes.
  const changeMountainStyle = (id) => {
    const applied = raceRef.current?.setMountainStyle(id) ?? id;
    setMountainStyle(applied);
  };

  const changeCarModel = (id) => {
    const applied = raceRef.current?.setCarModel(id) ?? id;
    setCarModel(applied);
  };

  const changeRoadScale = (scale) => {
    const applied = raceRef.current?.setRoadScale(scale) ?? scale;
    setRoadScale(applied);
  };

  const changeCourseProfile = (id) => {
    const applied = raceRef.current?.setCourseProfile(id) ?? id;
    setCourseProfile(applied);
  };

  // Mounts the WebGL race engine on the canvas and wires React callbacks.
  useEffect(() => {
    let dead = false;
    let race;
    setLoad(0);
    import("./engine").then(({ createRace }) => {
      if (dead || !canvasRef.current) return;
      race = createRace(canvasRef.current, {
        onLoad: (percent) => {
          setLoad(Math.max(0, Math.min(100, percent)));
        },
        onPhase: (next) => {
          setPhase(next);
          if (next === "title") {
            setRunLaunched(false);
            setFinishPresentationReady(false);
          }
          if (next === "title" || next === "countdown" || next === "tutorial") {
            setSteerButtonsHidden(false);
          }
          if (next === "tutorial") {
            setTutorialCopyPhase("visible");
            setTutorialCopyFadeActive(false);
          }
          if (next === "title" || next === "countdown" || next === "loading") {
            setTutorialCopyPhase("hidden");
            setTutorialCopyFadeActive(false);
          }
          if (next === "racing") {
            setTutorialCopyPhase("fading");
          }
          if (next === "finished") {
            setFinishPresentationReady(false);
          }
        },
        onFinishPresentation: () => setFinishPresentationReady(true),
        onKeyboardSteer: () => {
          if (window.matchMedia(MOBILE_STEER_BOUNCE_QUERY).matches) {
            return;
          }
          setSteerButtonsHidden(true);
        },
        onSteerButtonBounce: (side) => {
          bounceSteerButton(
            side === "left" ? steerLeftButtonRef.current : steerRightButtonRef.current,
          );
        },
        onCountdown: setCountdown,
        onHud: ({ time, boost, progress, track }) => {
          if (timeRef.current) timeRef.current.textContent = time;
          if (boostRef.current) boostRef.current.style.transform = `scaleX(${boost})`;
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
          trackMapRef.current?.update(track);
        },
        onFinish: setResult,
      });
      const appliedSpeed = race.setSpeed(speedRef.current);
      speedRef.current = appliedSpeed;
      setRaceSpeed(appliedSpeed);
      raceRef.current = race;
      setMusicTrack(race.getMusicTrack());
      setMountainStyle(race.getMountainStyle());
      setCarModel(race.getCarModel());
      setRoadScale(race.getRoadScale());
      setCourseProfile(race.getCourseProfile());
    });
    return () => {
      dead = true;
      race?.dispose();
      raceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (tutorialCopyPhase !== "fading") {
      return undefined;
    }
    const fadeMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : TUTORIAL_COPY_FADE_MS;
    const raf = window.requestAnimationFrame(() => setTutorialCopyFadeActive(true));
    const done = window.setTimeout(() => {
      setTutorialCopyPhase("hidden");
      setTutorialCopyFadeActive(false);
    }, fadeMs);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [tutorialCopyPhase]);

  // Fades in title UI one second after the title phase begins.
  useEffect(() => {
    if (phase !== "title" || runLaunched) {
      setTitleSettingsVisible(false);
      return undefined;
    }
    setTitleSettingsVisible(false);
    const id = window.setTimeout(() => setTitleSettingsVisible(true), 1000);
    return () => window.clearTimeout(id);
  }, [phase, runLaunched]);

  // Pauses the sim while the in-game menu is open.
  useEffect(() => {
    raceRef.current?.setPaused(menuOpen);
  }, [menuOpen]);

  // Applies the sound on/off toggle to engine audio.
  useEffect(() => {
    raceRef.current?.setSound(soundOn);
  }, [soundOn]);

  // Unlocks Web Audio on first user gesture for autoplay policy.
  useEffect(() => {
    const unlock = () => raceRef.current?.unlockAudio?.();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  // Blocks text selection and context menu during touch steering on mobile.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const blockSelect = (event) => event.preventDefault();
    root.addEventListener("selectstart", blockSelect);
    root.addEventListener("contextmenu", blockSelect);
    root.addEventListener("dragstart", blockSelect);
    return () => {
      root.removeEventListener("selectstart", blockSelect);
      root.removeEventListener("contextmenu", blockSelect);
      root.removeEventListener("dragstart", blockSelect);
    };
  }, []);

  // Starts or restarts a run from the title or results screen.
  const begin = () => {
    setMenuOpen(false);
    setResult(null);
    setRunLaunched(true);
    setFinishPresentationReady(false);
    raceRef.current?.start();
  };

  const restartFromMenu = () => {
    setMenuOpen(false);
    setRunLaunched(true);
    setFinishPresentationReady(false);
    setResult(null);
    raceRef.current?.restart();
  };

  return (
    <div className="race-root" ref={rootRef}>
      <canvas ref={canvasRef} className="race-canvas" />

      <header className="race-top">
        <div className="race-brand">RIDGE LINE</div>
        <button
          type="button"
          className="race-menu-button"
          aria-label="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {phase === "racing" && (
        <div className="race-hud-top">
          <div className="race-hud-readouts">
            <div className="race-time" ref={timeRef}>
              0:00.00
            </div>
            <div className="race-progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>
            <div className="race-hint">Follow the line to go faster</div>
          </div>
          <div className="race-hud-map-stack">
            <div className="race-boost" aria-hidden="true">
              <span ref={boostRef} />
            </div>
            {trackMapVisible ? (
              <RaceTrackMap
                ref={trackMapRef}
                roadScale={roadScale}
                courseProfile={courseProfile}
              />
            ) : null}
          </div>
        </div>
      )}

      {phase === "loading" && (
        <div className="race-loading">
          <div className="race-loading-count">{Math.max(0, Math.min(100, load))}</div>
          <div className="race-loading-label">Loading</div>
        </div>
      )}

      {phase === "title" && !runLaunched && (
        <div className={`race-title${titleSettingsVisible ? " is-visible" : ""}`}>
          <h1 className="race-title-wordmark">
            <span className="race-title-the">The</span>
            <span className="race-title-race">Race</span>
          </h1>
          <RaceHeroButton label="Start" onClick={begin} />
        </div>
      )}

      {countdown && phase === "countdown" && (
        <div className="race-count-wrap" key={countdown}>
          <div className={`race-count${countdown === "GO" ? " is-go" : ""}`}>{countdown}</div>
          <div className="race-start-lights" aria-hidden="true">
            {[0, 1, 2].map((index) => {
              const lit = countdown === "GO" ? 3 : countdown === "1" ? 3 : countdown === "2" ? 2 : 1;
              const on = index < lit;
              return (
                <span
                  key={index}
                  className={on ? (countdown === "GO" ? "is-go" : "is-on") : ""}
                />
              );
            })}
          </div>
        </div>
      )}

      {tutorialCopyPhase === "fading" ? (
        <div className="race-steer-overlay race-tutorial-copy-fade" aria-hidden="true">
          <div
            className={`race-tutorial-copy${tutorialCopyFadeActive ? " is-fading-out" : ""}`}
          >
            <RaceTutorialCopy />
          </div>
        </div>
      ) : null}

      {phase === "tutorial" && !steerButtonsHidden && (
        <RaceTutorial
          raceRef={raceRef}
          leftButtonRef={steerLeftButtonRef}
          rightButtonRef={steerRightButtonRef}
        />
      )}

      {phase === "racing" && !steerButtonsHidden && (
        <div className="race-steer-overlay race-steer-overlay-racing">
          <RaceSteerButtons
            raceRef={raceRef}
            leftButtonRef={steerLeftButtonRef}
            rightButtonRef={steerRightButtonRef}
          />
        </div>
      )}

      {phase === "finished" && result && finishPresentationReady && (
        <div className="race-results">
          <div className="race-results-main">
            <div className="race-results-summary">
              <div className="race-results-kicker">{result.isBest ? "New best" : "Finish"}</div>
              <div className="race-results-time">{result.label}</div>
              <div className="race-results-best">Best {result.bestLabel}</div>
            </div>
            <RaceHeroButton label="Again" className="race-results-again" onClick={begin} />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="race-menu">
          <SpeedPicker multiplier={raceSpeed} onChange={changeSpeed} />
          <MusicPicker trackId={musicTrack} onChange={changeMusicTrack} />
          <MountainPicker styleId={mountainStyle} onChange={changeMountainStyle} />
          <CarModelPicker modelId={carModel} onChange={changeCarModel} />
          <RoadScalePicker scale={roadScale} onChange={changeRoadScale} />
          <CourseProfilePicker profileId={courseProfile} onChange={changeCourseProfile} />
          <button type="button" onClick={restartFromMenu}>
            Restart
          </button>
          <button type="button" onClick={() => setSoundOn((on) => !on)}>
            Sound {soundOn ? "on" : "off"}
          </button>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <p>Best times stay on this device; settings reset when you reload.</p>
        </div>
      )}
    </div>
  );
};

export default Race;
