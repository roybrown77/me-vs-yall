import { useCallback, useEffect, useRef, useState } from 'react';

const PlayIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StopIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 6h12v12H6z" />
  </svg>
);

const getAudioContextConstructor = () => {
  if (typeof window === 'undefined') return null;
  return window.AudioContext || window.webkitAudioContext || null;
};

const createNoiseBuffer = (audioContext) => {
  const bufferSize = audioContext.sampleRate; // 1 second
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

const PumpUpMusic = ({
  style,
  autoStartOnFirstGesture = false,
  enabled = true,
  onEnabledChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const hasAutoStartedRef = useRef(false);

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const noiseBufferRef = useRef(null);
  const schedulerIntervalRef = useRef(null);

  const bpmRef = useRef(128);
  const currentStepRef = useRef(0);
  const nextNoteTimeRef = useRef(0);

  const stop = useCallback(async () => {
    setIsPlaying(false);

    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }

    const audioContext = audioContextRef.current;
    audioContextRef.current = null;
    masterGainRef.current = null;
    noiseBufferRef.current = null;

    if (audioContext) {
      try {
        await audioContext.close();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const scheduleKick = useCallback((audioContext, destination, time) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';

    const gain = audioContext.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.03);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + 0.3);
  }, []);

  const scheduleHat = useCallback((audioContext, destination, time, level = 0.22) => {
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBufferRef.current;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(8000, time);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(destination);

    noise.start(time);
    noise.stop(time + 0.05);
  }, []);

  const scheduleSnare = useCallback((audioContext, destination, time) => {
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBufferRef.current;

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800, time);
    bandpass.Q.setValueAtTime(0.9, time);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(destination);

    noise.start(time);
    noise.stop(time + 0.2);
  }, []);

  const scheduleBass = useCallback((audioContext, destination, time, frequencyHz) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sawtooth';

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, time);
    filter.Q.setValueAtTime(0.7, time);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.18, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

    osc.frequency.setValueAtTime(frequencyHz, time);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + 0.12);
  }, []);

  const scheduleStep = useCallback(
    (audioContext, time, step) => {
      const destination = masterGainRef.current;
      if (!destination) return;

      // 4/4 bar, 16 steps (16th notes)
      const isDownbeat = step === 0;

      // Kick: 4-on-the-floor + a little drive
      if (step % 4 === 0 || step === 10) {
        scheduleKick(audioContext, destination, time);
      }

      // Snare on 2 and 4 (steps 4 and 12)
      if (step === 4 || step === 12) {
        scheduleSnare(audioContext, destination, time);
      }

      // Hats: 8ths + extra 16ths for energy
      if (step % 2 === 0) {
        scheduleHat(audioContext, destination, time, isDownbeat ? 0.25 : 0.2);
      } else if (step === 3 || step === 7 || step === 11 || step === 15) {
        scheduleHat(audioContext, destination, time, 0.16);
      }

      // Bassline: simple minor-ish riff (A2/E2/G2)
      const bassSteps = {
        0: 110, // A2
        3: 82.41, // E2
        7: 98, // G2-ish
        8: 110,
        11: 82.41,
        15: 98,
      };

      const frequencyHz = bassSteps[step];
      if (frequencyHz) {
        scheduleBass(audioContext, destination, time, frequencyHz);
      }
    },
    [scheduleBass, scheduleHat, scheduleKick, scheduleSnare]
  );

  const start = useCallback(async () => {
    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) return;

    // If already playing, ignore.
    if (audioContextRef.current) return;

    const audioContext = new AudioContextConstructor();

    // Some browsers start suspended; clicking the button counts as a user gesture.
    try {
      await audioContext.resume();
    } catch (e) {
      // ignore
    }

    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.55, audioContext.currentTime);

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, audioContext.currentTime);
    compressor.knee.setValueAtTime(12, audioContext.currentTime);
    compressor.ratio.setValueAtTime(6, audioContext.currentTime);
    compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
    compressor.release.setValueAtTime(0.12, audioContext.currentTime);

    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    masterGainRef.current = masterGain;
    noiseBufferRef.current = createNoiseBuffer(audioContext);

    currentStepRef.current = 0;
    nextNoteTimeRef.current = audioContext.currentTime + 0.05;

    const lookaheadMs = 25;
    const scheduleAheadTimeSeconds = 0.1;

    const scheduler = () => {
      const secondsPerBeat = 60 / bpmRef.current;
      const secondsPer16th = secondsPerBeat / 4;

      while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTimeSeconds) {
        scheduleStep(audioContext, nextNoteTimeRef.current, currentStepRef.current);

        nextNoteTimeRef.current += secondsPer16th;
        currentStepRef.current = (currentStepRef.current + 1) % 16;
      }
    };

    schedulerIntervalRef.current = setInterval(scheduler, lookaheadMs);
    setIsPlaying(true);
  }, [scheduleStep]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  useEffect(() => {
    if (enabled) return;
    if (!isPlaying) return;
    stop();
  }, [enabled, isPlaying, stop]);

  useEffect(() => {
    if (!autoStartOnFirstGesture) return undefined;
    if (isPlaying) return undefined;
    if (hasAutoStartedRef.current) return undefined;
    if (typeof window === 'undefined') return undefined;

    let isCancelled = false;

    const handleFirstGesture = async () => {
      if (isCancelled) return;
      if (hasAutoStartedRef.current) return;

      hasAutoStartedRef.current = true;
      await start();
    };

    // Browsers generally require a user gesture before audio can start.
    // Arcade mode can feel “instant” by starting on the first gesture.
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    // Trackpad/mouse-wheel scroll is often the first interaction on desktop.
    // If the browser treats it as a valid user gesture, this makes music start
    // without requiring an explicit click.
    window.addEventListener('wheel', handleFirstGesture, { once: true, passive: true });

    return () => {
      isCancelled = true;
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
    };
  }, [autoStartOnFirstGesture, isPlaying, start]);

  const handleClick = () => {
    if (isPlaying) {
      stop();
      onEnabledChange?.(false);
    } else {
      onEnabledChange?.(true);
      start();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isPlaying ? 'Stop pump up music' : 'Play pump up music'}
      title={isPlaying ? 'Stop music' : 'Play music'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 999,
        border: '1px solid rgba(0,0,0,0.12)',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        padding: 0,
        color: '#111',
        ...style,
      }}
    >
      {isPlaying ? <StopIcon /> : <PlayIcon />}
    </button>
  );
};

export default PumpUpMusic;
