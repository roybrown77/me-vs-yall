import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment-timezone';
import queryString from 'query-string';

import Header from '../../components/Header';
import Typer from './Typer';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';
import { callApi } from '../../utilities/http';
import { getLeagueName } from '../../utilities/getLeagueName';
import { hasGameStarted, leagues } from '../../utilities';
import mvyBalls from '../../styles/images/mvy-balls-cut.png';
import maddenTouchdown from '../../media/madden-touchdown.m4a';
import tecmoTouchdown from '../../media/tecmo-touchdown.m4a'
import boasty from '../../media/boasty.m4a';

const taglineEndings = [
  { word: 'doubles', emoji: '🥙' },
  { word: 'pastelillos', emoji: '🥟' },
  { word: 'roti', emoji: '🌯' },
  { word: 'wings', emoji: '🍗' },
  { word: 'pizza', emoji: '🍕' },
  { word: 'tacos', emoji: '🌮' },
  { word: 'vegas' },
];

const tagLines = [
  `"the ultimate sports pick'em game.  like the karate kid "we're the best around! no one can never ever keep us down! 🥋"`,
  `"your mission, should you choose to accept it, is to pick the perfect week. correctly pick the winner of every game this week and you will succeed. it's one of the toughest things to do in the universe. this message will self destruct. 🪐"`,
];

const storySteps = [
  'The Me vs Yall bandwagon truck roars to life under the lights in an epic quest for glory.',
  'As the flag snaps in the wind, legends rise.',
  'Rolling through the field leaves rivals in the turf.',
  'Lock in your picks to kickoff destiny!',
];

const windingLevelSteps = [
  'Level 1: Enter the winding lanes and keep the pace steady.',
  'Level 2: Curves tighten up. Read the field and stay sharp.',
  'Level 3: Rival noise rises. Hold your line and trust the playbook.',
  'Level 4: Final stretch ahead. Push through to the end zone.',
];

const windingSegments = [
  { top: '10%', left: '8%', width: '62%', rotate: '12deg' },
  { top: '24%', left: '30%', width: '58%', rotate: '-11deg' },
  { top: '38%', left: '6%', width: '66%', rotate: '10deg' },
  { top: '52%', left: '28%', width: '61%', rotate: '-9deg' },
  { top: '66%', left: '10%', width: '64%', rotate: '11deg' },
  { top: '80%', left: '32%', width: '54%', rotate: '-8deg' },
];

const confettiPieces = Array.from({ length: 18 }, (_, index) => index);
const TOUCHDOWN_TRIGGER_PROGRESS = 0.9;
const BANDWAGON_SCROLL_SENSITIVITY = 1.8;

const Home = () => {
  useGoogleAnalytics();
  const [taglineEnding] = useState(
    () => taglineEndings[Math.floor(Math.random() * taglineEndings.length)]
  );
  const location = useLocation();
  const isHomePath = location.pathname === '/';
  const endRef = useRef(null);
  const windingRef = useRef(null);
  const roadRef = useRef(null);
  const [truckProgress, setTruckProgress] = useState(0);
  const [windingProgress, setWindingProgress] = useState(0);
  const [enteredDropZone, setEnteredDropZone] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [windingTypedText, setWindingTypedText] = useState('');
  const wasTouchdownRef = useRef(false);
  const touchdownSoundsRef = useRef([]);
  const hasUnlockedTouchdownAudioRef = useRef(false);
  const hasScrolledHomeTrailRef = useRef(false);
  const skipInitialRoadMeasureRef = useRef(true);
  const [showGameTrail, setShowGameTrail] = useState(false);

  const stopTouchdownSounds = () => {
    touchdownSoundsRef.current.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  const activeStoryIndex = useMemo(() => {
    return Math.min(storySteps.length - 1, Math.floor(truckProgress * storySteps.length));
  }, [truckProgress]);

  const activeWindingLevelIndex = useMemo(() => {
    return Math.min(
      windingLevelSteps.length - 1,
      Math.floor(windingProgress * windingLevelSteps.length)
    );
  }, [windingProgress]);

  // Start at the top of the page when it loads.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show the bandwagon easter egg only near game day (or when games are live).
  useEffect(() => {
    let isMounted = true;

    const loadScheduleVisibility = async () => {
      try {
        const leagueName = getLeagueName();
        const league = leagues.find((item) => item.name === leagueName) || leagues[0];
        const year = league?.years?.[league.years.length - 1];

        if (!league?.id || !year) {
          if (isMounted) setShowGameTrail(true);
          return;
        }

        const games = await callApi({
          method: 'GET',
          endpoint: `/api/gamemanagement/games?${queryString.stringify({ leagueId: league.id, year })}`,
        });

        const now = moment().tz('America/New_York');
        const scheduleGames = Array.isArray(games) ? games : [];
        const areAnyGamesInProgress = scheduleGames.some(
          (game) => game?.startDateTime && hasGameStarted(game.startDateTime) && !game?.isGameOver
        );

        if (areAnyGamesInProgress) {
          if (isMounted) setShowGameTrail(true);
          return;
        }

        const upcomingGames = scheduleGames
          .filter((game) => game?.startDateTime && moment(game.startDateTime).isAfter(now))
          .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        if (upcomingGames.length === 0) {
          if (isMounted) setShowGameTrail(false);
          return;
        }

        const nextStart = moment(upcomingGames[0].startDateTime).tz('America/New_York');
        const showFrom = nextStart.clone().subtract(1, 'day');

        if (isMounted) {
          setShowGameTrail(now.isSameOrAfter(showFrom));
        }
      } catch (error) {
        if (isMounted) {
          // Fallback to visible if schedule lookup fails.
          setShowGameTrail(true);
        }
      }
    };

    loadScheduleVisibility();

    return () => {
      isMounted = false;
    };
  }, []);

  // Track scroll progress through the hidden winding-run section.
  useEffect(() => {
    const onScroll = () => {
      if (!windingRef.current) return;

      const rect = windingRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travelRange = rect.height + viewportHeight;
      const covered = viewportHeight - rect.top;
      const nextWindingProgress = Math.max(0, Math.min(1, covered / travelRange));
      setWindingProgress(nextWindingProgress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Move the bandwagon truck with the left and right arrow keys.
  useEffect(() => {
    if (!isHomePath || !showGameTrail) return undefined;

    const onKeyDown = (event) => {
      const target = event.target;
      const isEditableTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');

      if (isEditableTarget) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      setTruckProgress((previous) => {
        const delta = event.key === 'ArrowRight' ? 0.035 : -0.035;
        const next = previous + delta;
        return Math.max(0, Math.min(1, next));
      });
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isHomePath, showGameTrail]);

  // Move the bandwagon truck along the road as you scroll down the page.
  useEffect(() => {
    if (!isHomePath || !showGameTrail) return undefined;

    skipInitialRoadMeasureRef.current = true;

    const onScroll = () => {
      if (!roadRef.current) return;

      const rect = roadRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travelRange = viewportHeight + rect.height;
      const covered = viewportHeight - rect.top;
      const normalizedProgress = covered / travelRange;
      const nextProgress = Math.max(
        0,
        Math.min(1, normalizedProgress * BANDWAGON_SCROLL_SENSITIVITY)
      );

      if (skipInitialRoadMeasureRef.current) {
        skipInitialRoadMeasureRef.current = false;
        setTruckProgress(Math.min(nextProgress, TOUCHDOWN_TRIGGER_PROGRESS - 0.01));
        return;
      }

      if (window.scrollY > 8) {
        hasScrolledHomeTrailRef.current = true;
      }

      setTruckProgress(nextProgress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePath, showGameTrail]);

  // Type out the current bandwagon story line one character at a time.
  useEffect(() => {
    const line = storySteps[activeStoryIndex];
    let current = 0;

    setTypedText('');

    const timer = window.setInterval(() => {
      current += 1;
      setTypedText(line.slice(0, current));

      if (current >= line.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [activeStoryIndex]);

  // Type out the current winding level line one character at a time.
  useEffect(() => {
    const line = windingLevelSteps[activeWindingLevelIndex];
    let current = 0;

    setWindingTypedText('');

    const timer = window.setInterval(() => {
      current += 1;
      setWindingTypedText(line.slice(0, current));

      if (current >= line.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [activeWindingLevelIndex]);

  // Flip on the finale state when the hidden end section scrolls into view.
  useEffect(() => {
    if (!endRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEnteredDropZone(true);
        }
      },
      {
        threshold: 0.9,
      }
    );

    observer.observe(endRef.current);

    return () => observer.disconnect();
  }, []);

  // Load the touchdown sound clips once when the home page opens.
  useEffect(() => {
    touchdownSoundsRef.current = [new Audio(maddenTouchdown), new Audio(tecmoTouchdown), new Audio(boasty)];

    return () => {
      stopTouchdownSounds();
    };
  }, []);

  // Unlock audio on home-page scroll so touchdown sounds can play later.
  useEffect(() => {
    if (!isHomePath || !showGameTrail) return undefined;

    const unlockTouchdownAudio = () => {
      if (
        !hasScrolledHomeTrailRef.current ||
        hasUnlockedTouchdownAudioRef.current ||
        touchdownSoundsRef.current.length === 0
      ) {
        return;
      }

      const sounds = touchdownSoundsRef.current;
      hasUnlockedTouchdownAudioRef.current = true;

      sounds.forEach((sound) => {
        sound.muted = true;
        sound.currentTime = 0;
        sound.play()
          .then(() => {
            sound.pause();
            sound.currentTime = 0;
            sound.muted = false;
          })
          .catch(() => {
            sound.muted = false;
          });
      });
    };

    window.addEventListener('scroll', unlockTouchdownAudio, { passive: true });
    window.addEventListener('wheel', unlockTouchdownAudio, { passive: true });
    window.addEventListener('touchmove', unlockTouchdownAudio, { passive: true });

    return () => {
      window.removeEventListener('scroll', unlockTouchdownAudio);
      window.removeEventListener('wheel', unlockTouchdownAudio);
      window.removeEventListener('touchmove', unlockTouchdownAudio);
    };
  }, [isHomePath, showGameTrail]);

  const gram = (event) => {
    event.preventDefault();
    window.location = 'https://www.instagram.com/_mevsyall';
  };

  const handleMilestoneClick = (index) => {
    if (storySteps.length <= 1) {
      setTruckProgress(0);
      return;
    }

    const nextProgress = index / (storySteps.length - 1);
    setTruckProgress(Math.max(0, Math.min(1, nextProgress)));
  };

  const year = moment().format('YYYY');
  const now = useMemo(() => moment().tz('America/New_York').format('MM/DD/YYYY hh:mm a'), []);
  const truckX = 10 + truckProgress * 70;
  const hasTruckMoved = truckProgress > 0.01;
  const isTouchdown = truckProgress >= TOUCHDOWN_TRIGGER_PROGRESS;
  const isWindingTouchdown = windingProgress >= 0.97;
  const windingTruckTop = 10 + windingProgress * 80;
  const windingTruckLeft = 50 + Math.sin(windingProgress * Math.PI * 6) * 26;
  const windingTruckRotation = Math.cos(windingProgress * Math.PI * 6) * 9;

  // Play a random touchdown sound when the bandwagon reaches the end zone.
  useEffect(() => {
    if (!isHomePath || !showGameTrail) {
      wasTouchdownRef.current = false;
      stopTouchdownSounds();
      return;
    }

    if (
      isTouchdown &&
      !wasTouchdownRef.current &&
      hasScrolledHomeTrailRef.current &&
      touchdownSoundsRef.current.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * touchdownSoundsRef.current.length);
      const selectedSound = touchdownSoundsRef.current[randomIndex];

      selectedSound.currentTime = 0;
      selectedSound.play().catch(() => {
        // Ignore autoplay rejections in browsers that require prior interaction.
      });
    }

    wasTouchdownRef.current = isTouchdown;
  }, [isHomePath, isTouchdown, showGameTrail]);

  return (
    <Header disableTopBanner={true}>
      <div className="fade-in home-splash__page" style={{ padding: '6.2rem 1rem 2.4rem' }}>
        <div className="home-splash__content-shift">
          <div className="home-splash__drop-logo-wrap" aria-hidden="true">
            <img className="home-splash__drop-logo" src={mvyBalls} alt="" />
          </div>
          <section className="home-splash__hero">
            <p className="home-splash__subhead">
              sports x fun x friends x {taglineEnding.word} {taglineEnding.emoji}
            </p>
            <div className="home-splash__hero-typer-wrap">
              <div className="home-splash__hero-typer">
                <Typer dataText={tagLines} />
              </div>
            </div>
            <div className="home-splash__hero-actions">
              <Link className="home-splash__cta" to="/scoreboards/nfl" onClick={stopTouchdownSounds}>
                Jump To Scores
              </Link>
              <Link className="home-splash__ghost" to="/leaders/nfl" onClick={stopTouchdownSounds}>
                See Leaderboard
              </Link>
            </div>
          </section>

        {false && <section className="home-splash__winding-run" aria-label="Long winding run" ref={windingRef}>
          <div className="home-splash__winding-title">Long Winding Field Run</div>
          <div className="home-splash__winding-typing" role="status" aria-live="polite">
            {windingTypedText}
            <span className="home-splash__cursor" />
          </div>
          <div
            className={`home-splash__touchdown-celebration home-splash__touchdown-celebration--winding${
              isWindingTouchdown ? ' is-live' : ''
            }`}
            aria-hidden="true"
          >
            {confettiPieces.map((piece) => (
              <span
                key={`winding-confetti-${piece}`}
                className="home-splash__confetti"
                style={{
                  left: `${8 + piece * 5}%`,
                  animationDelay: `${(piece % 6) * 90}ms`,
                  animationDuration: `${850 + (piece % 5) * 160}ms`,
                }}
              />
            ))}
          </div>
          <div className="home-splash__winding-track" aria-hidden="true">
            {windingSegments.map((segment) => (
              <div
                key={`${segment.top}-${segment.left}`}
                className="home-splash__winding-segment"
                style={{
                  top: segment.top,
                  left: segment.left,
                  width: segment.width,
                  transform: `rotate(${segment.rotate})`,
                }}
              />
            ))}
            <div
              className="home-splash__winding-truck"
              style={{
                top: `${windingTruckTop}%`,
                left: `${windingTruckLeft}%`,
                transform: `translate(-50%, -50%) rotate(${windingTruckRotation}deg)`,
              }}
            >
              <span className="home-splash__winding-truck-emoji" role="img" aria-label="Truck on winding run">
                🚚
              </span>
              <div className="home-splash__winding-flag-pole" />
              <div className="home-splash__winding-flag">
                <img src={mvyBalls} alt="Me vs Yall balls logo flag" />
              </div>
            </div>
          </div>
        </section>}

        {false && <section className="home-splash__finale" ref={endRef}>
          <h2>{enteredDropZone ? 'Touchdown. Scores Are Ready.' : 'Drive To Midfield To Unlock Scores'}</h2>
          <p>
            {enteredDropZone
              ? 'The truck made it. Tap below when you want to open Scores.'
              : 'Keep scrolling until the truck reaches midfield, then open Scores when ready.'}
          </p>
          <Link className="home-splash__cta" to="/scoreboards/nfl" onClick={stopTouchdownSounds}>
            Open Scores Now
          </Link>
        </section>}
        </div>

        <footer className="home-splash__footer">
          <div className="home-splash__footer-links">
            {false && <Link className="home-splash__footer-link" to="/tips">
              Tips
            </Link>}
            <Link className="home-splash__footer-link" to="/shop">
              Shop
            </Link>
            <Link className="home-splash__footer-link" to="/origin">
              Origin
            </Link>
            <Link className="home-splash__footer-link" to="" onClick={gram}>
              Gram
            </Link>
          </div>
          <div className="home-splash__footer-copy">
            <div>© 2017-{year} Me vs Yall</div>
            <div>{now}</div>
            <div>ATL via BOS via HOU via SUN</div>
          </div>

        {showGameTrail && <section className="home-splash__storyline" aria-label="Story milestones animation">
          <div className="home-splash__milestone-track" />
          <div
            className="home-splash__milestone-progress"
            style={{ width: `${(activeStoryIndex / (storySteps.length - 1)) * 100}%` }}
          />
          {storySteps.map((step, index) => (
            <div
              key={step}
              className={`home-splash__milestone${index === activeStoryIndex ? ' is-active' : ''}`}
              style={{ left: `${(index / (storySteps.length - 1)) * 100}%` }}
              aria-label={step}
              onClick={() => handleMilestoneClick(index)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                handleMilestoneClick(index);
              }}
              role="button"
              tabIndex={0}
            >
              <span className="home-splash__milestone-dot" />
            </div>
          ))}
        </section>}

        {showGameTrail && <section className="home-splash__road" aria-label="Field road" ref={roadRef}>
          <div className="home-splash__lane" />
          <div className="home-splash__lane home-splash__lane--mid" />
          {false && <aside
            className={`home-splash__controls-hint${hasTruckMoved ? ' is-hidden' : ''}`}
            aria-label="Truck controls help"
          >
            <p className="home-splash__controls-meta">Use ⬅️ ➡️ arrow keys or click a milestone dot</p>
          </aside>}
          <div
            className={`home-splash__touchdown-celebration${isTouchdown ? ' is-live' : ''}`}
            aria-hidden="true"
          >
            {confettiPieces.map((piece) => (
              <span
                key={`confetti-${piece}`}
                className="home-splash__confetti"
                style={{
                  left: `${8 + piece * 5}%`,
                  animationDelay: `${(piece % 6) * 90}ms`,
                  animationDuration: `${850 + (piece % 5) * 160}ms`,
                }}
              />
            ))}
          </div>
          {hasTruckMoved && (
            <div className="home-splash__typing" role="status" aria-live="polite">
              {typedText}
              <span className="home-splash__cursor" />
            </div>
          )}
          <div
            className="home-splash__truck-wrap"
            style={{ transform: `translateX(${truckX}vw)` }}
            aria-hidden="true"
          >
            <div className="home-splash__truck home-splash__truck--right">
              <div className="home-splash__truck-riders" aria-hidden="true">
                <span className="home-splash__truck-rider">😎</span>
                <span className="home-splash__truck-rider">😄</span>
                <span className="home-splash__truck-rider">😅</span>
                <span className="home-splash__truck-rider">😂</span>
              </div>
              <span className="home-splash__truck-emoji" role="img" aria-label="Truck">
                🚚
              </span>
              <div className="home-splash__flag-pole home-splash__flag-pole--rear-right" />
              <div className="home-splash__flag home-splash__flag--rear-right">
                <img src={mvyBalls} alt="Me vs Yall balls logo flag" />
              </div>
            </div>
          </div>
        </section>}
        </footer>
      </div>
    </Header>
  );
};

export default Home;
