const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const gameRepository = require('../server/game/databaseRepositories/GameRepository');
const gameWeekRepository = require('../server/game/databaseRepositories/GameWeekRepository');
const { findGameWeekForEspnWeek } = require('../server/game/gameWeekNavigation');
const { dbConnectionString } = require('../../config');
const { nflTeams } = require('../server/utilities/teams/nfl');
const { getNflGameDataSource } = require('../server/utilities/getGameDataSource');
const {
    buildEspnKickoffByGameId,
    enrichScrapedResultsWithEspnKickoffs,
    fetchEspnNflScoreboardEvents,
} = require('../server/utilities/espnNflScoreboardApi');
const {
    getDbGameMatchKey,
    getScrapedGameMatchKey,
    hasSameGameMatch,
} = require('../server/game/espnGameMatch');
const { getPlayHistory } = require('../server/utilities/utilities');
const {
    upsertSpreadHistory,
    upsertOverUnderHistory,
} = require('../server/game/spreadLineHistory');
const { reconcileScoreboardGameCounts } = require('../server/game/scoreboardGameCountCheck');

puppeteer.use(StealthPlugin());

/* =============================================================================
   DATABASE SETUP
   ============================================================================= */

if (!dbConnectionString) {
    console.log('[ENV_VARIABLE] - missing db connection string');
    process.exit(1);
}

mongoose.connection.on("connected", function(ref) {
    console.log("[MONGODB] - Connected!");
});

mongoose.connection.on("error", function(err) {
    console.error('[MONGODB] - failed to connect on startup: ', err);
});

mongoose.connection.on('disconnected', function () {
    console.log('[MONGODB] - Disconnected.');
});

try {
    console.log('[MONGODB] - Connecting...');
    const options = {
        autoIndex: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
    };
    mongoose.connect(dbConnectionString, options).catch((err) => {
        console.error('[MONGODB] - failed to connect on startup: ', err);
    });
} catch (err) {
    console.log("[MONGODB] - initialization failed: ", err.message);
}

/* =============================================================================
   CONSTANTS
   ============================================================================= */

/*
    Update game information every 10 seconds
*/

const leagueId = '59723313734d1d6202a85f10';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
const VIEWPORT = { width: 2500, height: 1500 };
const UPDATE_INTERVAL_MS = 10000;
const FINAL_STATUS_DELAY_MS = 60 * 1000;
const PAGE_LOAD_TIMEOUT_MS = 45000;
const BROWSER_SESSION_LIMIT = 30;

let sharedBrowser = null;
let browserSessionUses = 0;
let isShuttingDown = false;
let updateLoopSleep = null;

/* =============================================================================
   TEAM MATCHING HELPERS
   ============================================================================= */

const normalizeKey = (value = '') => value.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const espnAbbreviationAliasMap = {
    was: 'wsh',
    jac: 'jax',
};

const resolveNflTeam = ({ initial = '', teamName = '' }) => {
    const initialKey = normalizeKey(initial);
    const initialAlias = espnAbbreviationAliasMap[initialKey] || initialKey;
    const teamNameKey = normalizeKey(teamName);

    return nflTeams.find((team) => {
        const shortLocationKey = normalizeKey(team.shortLocation);
        const nameKey = normalizeKey(team.name);
        const locationKey = normalizeKey(team.location);
        const fullNameKey = normalizeKey(`${team.location}${team.name}`);

        return shortLocationKey === initialAlias ||
            nameKey === teamNameKey ||
            locationKey === teamNameKey ||
            fullNameKey === teamNameKey;
    }) || null;
};

/* =============================================================================
   LOGGING HELPERS
   ============================================================================= */

const getGameLabel = (game) => {
    const away = game.competitors?.[0]?.name || 'Away';
    const home = game.competitors?.[1]?.name || 'Home';
    return `${away} vs ${home} (${game._id?.toString()})`;
};

const logGameUpdate = ({ game, updateType, details, updateResult }) => {
    const gameLabel = getGameLabel(game);
    const modifiedCount = updateResult?.modifiedCount ?? 0;
    const matchedCount = updateResult?.matchedCount ?? 0;

    if (matchedCount === 0) {
        console.log(`[GAME_UPDATER] Update failed to match game: ${gameLabel}`);
        return;
    }

    const changeNote = modifiedCount === 0 ? ' (matched, no field changes)' : '';
    console.log(`[GAME_UPDATER] Updated ${updateType} for ${gameLabel}${changeNote}: ${details}`);
};

const logGameCreate = ({ gameDoc }) => {
    const away = gameDoc.competitors?.[0]?.name || 'Away';
    const home = gameDoc.competitors?.[1]?.name || 'Home';
    console.log(`[GAME_UPDATER] Created game ${away} vs ${home} (${gameDoc.startDateTime?.toISOString?.() || gameDoc.startDateTime})`);
};

const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const logGameUpdaterError = (message) => {
    console.error(`${RED}[GAME_UPDATER] ${message}${RESET}`);
};

const shutdownGameUpdater = async (reason) => {
    isShuttingDown = true;

    if (updateLoopSleep) {
        clearTimeout(updateLoopSleep);
    }

    logGameUpdaterError(reason);
    logGameUpdaterError('Check that all games are accounted for (ESPN scoreboard vs database).');

    await closeSharedBrowser();
    process.exit(1);
};

/* =============================================================================
   BROWSER / ESPN PAGE SESSION
   ============================================================================= */

const getScrapedResults = async (page) => {
    const results = await scrapeGameInformationFromPage(page);

    if (results.length === 0) {
        console.log('[GAME_UPDATER] No scoreboard games found on ESPN page.');
    } else {
        console.log(`[GAME_UPDATER] Loaded ${results.length} scoreboard games from ESPN.`);
    }

    return { results };
};

const closeSharedBrowser = async () => {
    if (!sharedBrowser) {
        return;
    }

    try {
        await sharedBrowser.close();
    } catch (error) {
        console.log('[GAME_UPDATER] browser close error:', error.message);
    }

    sharedBrowser = null;
    browserSessionUses = 0;
};

const getSharedBrowser = async () => {
    if (sharedBrowser?.connected && browserSessionUses < BROWSER_SESSION_LIMIT) {
        return sharedBrowser;
    }

    await closeSharedBrowser();

    sharedBrowser = await puppeteer.launch({
        pipe: true,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    sharedBrowser.on('disconnected', () => {
        sharedBrowser = null;
        browserSessionUses = 0;
    });

    browserSessionUses = 0;
    return sharedBrowser;
};

const sleep = (ms) => new Promise((resolve) => {
    if (ms <= 0) {
        setImmediate(resolve);
        return;
    }
    updateLoopSleep = setTimeout(() => {
        updateLoopSleep = null;
        resolve();
    }, ms);
});

const withEspnPage = async (url, callback) => {
    const browser = await getSharedBrowser();
    const page = await browser.newPage();

    try {
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                request.abort();
                return;
            }

            request.continue();
        });

        await page.setViewport(VIEWPORT);
        await page.setUserAgent(USER_AGENT);
        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });
        await page.waitForSelector('.Scoreboard', { timeout: 15000 }).catch(() => {});
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let scrolled = 0;
                const step = 900;
                const timer = setInterval(() => {
                    window.scrollBy(0, step);
                    scrolled += step;
                    if (scrolled >= document.body.scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 80);
            });
        });
        await page.waitForFunction(() => {
            const scoreboards = Array.from(document.querySelectorAll('.Scoreboard'));
            if (!scoreboards.length) {
                return false;
            }

            return scoreboards.every((gameElement) => {
                const teams = gameElement.querySelectorAll('.ScoreboardScoreCell__Competitors > li');
                if (teams.length < 2) {
                    return false;
                }

                const timeText =
                    gameElement.querySelector('.ScoreboardScoreCell__Overview .ScoreCell__Time')?.textContent?.trim() ||
                    gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time')?.textContent?.trim() ||
                    gameElement.querySelector('.ScoreCell__Time')?.textContent?.trim() ||
                    '';

                return Boolean(timeText);
            });
        }, { timeout: 30000 }).catch(() => {});

        return await callback(page);
    } finally {
        page.removeAllListeners('request');
        await page.close().catch(() => {});
        browserSessionUses += 1;

        if (browserSessionUses >= BROWSER_SESSION_LIMIT) {
            await closeSharedBrowser();
        }
    }
};

/* =============================================================================
   SCRAPING - read game data from ESPN scoreboard DOM
   ============================================================================= */

async function scrapeGameInformationFromPage(page) {
    try {
        const results = await page.evaluate(() => {
            const results = [];
            const scoreboards = document.querySelectorAll('.Scoreboard');

            scoreboards.forEach((gameElement) => {
                const cardEl = gameElement.closest('.Card');
                const cardHeader =
                    cardEl?.querySelector('.Card__Header__Title')?.textContent?.trim() ||
                    cardEl?.querySelector('header')?.getAttribute('aria-label')?.trim() ||
                    '';
                const competitors = gameElement.querySelectorAll('.ScoreboardScoreCell__Competitors > li');
                const gameScores = [];

                competitors.forEach((teamElement) => {
                    const teamNameEl = teamElement.querySelector('.ScoreCell__TeamName--shortDisplayName');
                    const teamName = teamNameEl?.textContent?.trim() || '';

                    let teamInitial = '';
                    const teamAnchor = teamElement.querySelector('a.AnchorLink')?.getAttribute('href') || '';
                    const teamAnchorMatch = teamAnchor.match(/\/name\/([A-Za-z0-9]+)\//);

                    if (teamAnchorMatch && teamAnchorMatch[1]) {
                        teamInitial = teamAnchorMatch[1].toUpperCase();
                    } else if (teamName) {
                        teamInitial = teamName.replace(/[^A-Za-z]/g, '').toUpperCase();
                    }

                    const scoreEl = teamElement.querySelector('.ScoreCell__Score');
                    const score = scoreEl?.textContent?.trim() || '0';

                    const linescoreContainer = teamElement.querySelector('.ScoreboardScoreCell_Linescores');
                    const linescores = linescoreContainer
                        ? [...linescoreContainer.querySelectorAll('.ScoreboardScoreCell__Value')].map((el) => {
                            const parsed = parseInt(String(el.textContent || '').trim(), 10);
                            return Number.isFinite(parsed) ? parsed : 0;
                        })
                        : [];

                    gameScores.push({
                        initial: teamInitial,
                        teamName,
                        score,
                        linescores,
                    });
                });

                const lastPlayText =
                    gameElement.querySelector('.DriveChart2D__PlayText')?.textContent?.trim() ||
                    gameElement.querySelector('.DriveChart2D__PlayTextContainer')?.textContent?.trim() ||
                    '';
                const lastPlay = lastPlayText.replace(/^Last\s*Play:\s*/i, '').trim();

                const spread = gameElement.querySelector('.OddsStripWrapper li:nth-child(1) .rIczU')?.textContent?.trim() || '';
                const total = gameElement.querySelector('.OddsStripWrapper li:nth-child(2) .rIczU')?.textContent?.trim() || '';

                const scoreCellEl = gameElement.querySelector('.ScoreboardScoreCell');
                const isPreGame = scoreCellEl?.classList.contains('ScoreboardScoreCell--pre') ?? false;
                const isPostGame = scoreCellEl?.classList.contains('ScoreboardScoreCell--post') ?? false;
                const kickoffTimeEl =
                    gameElement.querySelector('.ScoreboardScoreCell__Overview .ScoreCell__Time') ||
                    gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time.ScoreCell__Time--default') ||
                    gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time') ||
                    gameElement.querySelector('.ScoreCell__Time');
                const kickoffTime = kickoffTimeEl?.textContent?.trim() || '';
                const gameStatusText = kickoffTime;
                const isGameOver =
                    isPostGame ||
                    /^(final(\/ot)?|f\/ot)$/i.test(gameStatusText);

                const down = gameElement.querySelector('.DriveChart2D__DownAndDistance')?.textContent?.trim() || null;

                const possessionHref = gameElement.querySelector('.ScoreboardScoreCell__Item--poss .AnchorLink')?.getAttribute('href') || '';
                const possessionMatch = possessionHref.match(/\/name\/([A-Za-z0-9]+)\//);
                const possession = possessionMatch && possessionMatch[1] ? possessionMatch[1].toUpperCase() : null;

                const weatherTempEl = gameElement.querySelector('.Weather__Temp--showDegrees');
                const weatherIconEl = gameElement.querySelector('.icon__accuweather');
                let weather = weatherTempEl ? weatherTempEl.textContent?.trim() : null;

                if (weatherIconEl) {
                    const weatherIconStyle = weatherIconEl.style.backgroundImage;
                    const weatherIconMap = {
                        "01.png": "Sunny",
                        "02.png": "Mostly Sunny",
                        "03.png": "Partly Sunny",
                        "04.png": "Intermittent Clouds",
                        "05.png": "Hazy Sunshine",
                        "06.png": "Mostly Cloudy",
                        "07.png": "Cloudy",
                        "08.png": "Dreary (Overcast)",
                        "11.png": "Fog",
                        "12.png": "Showers",
                        "13.png": "Mostly Cloudy w/ Showers",
                        "14.png": "Partly Sunny w/ Showers",
                        "15.png": "T-Storms",
                        "16.png": "Mostly Cloudy w/ T-Storms",
                        "17.png": "Partly Sunny w/ T-Storms",
                        "18.png": "Rain",
                        "19.png": "Flurries",
                        "20.png": "Mostly Cloudy w/ Flurries",
                        "21.png": "Partly Sunny w/ Flurries",
                        "22.png": "Snow",
                        "23.png": "Mostly Cloudy w/ Snow",
                        "24.png": "Ice",
                        "25.png": "Sleet",
                        "26.png": "Freezing Rain",
                        "29.png": "Rain and Snow",
                        "30.png": "Hot",
                        "31.png": "Cold",
                        "32.png": "Windy",
                        "33.png": "Clear",
                        "34.png": "Mostly Clear",
                        "35.png": "Partly Cloudy",
                        "36.png": "Intermittent Clouds (Night)",
                        "37.png": "Hazy Moonlight",
                        "38.png": "Mostly Cloudy (Night)",
                        "39.png": "Partly Cloudy w/ Showers",
                        "40.png": "Mostly Cloudy w/ Showers (Night)",
                        "41.png": "Partly Cloudy w/ T-Storms",
                        "42.png": "Mostly Cloudy w/ T-Storms (Night)",
                        "43.png": "Mostly Cloudy w/ Flurries (Night)",
                        "44.png": "Mostly Cloudy w/ Snow (Night)",
                    };

                    if (weatherIconStyle) {
                        const iconMatch = weatherIconStyle.match(/(\d+\.png)/);
                        if (iconMatch && iconMatch[1] && weatherIconMap[iconMatch[1]]) {
                            weather = `${weather || ''}${weather ? ',' : ''}${weatherIconMap[iconMatch[1]]}`;
                        }
                    }
                }

                if (gameScores.length > 0) {
                    results.push({
                        card: cardHeader,
                        espnGameId: gameElement.id || null,
                        isPreGame,
                        kickoffTime: kickoffTime || null,
                        game: gameScores,
                        spread,
                        total,
                        currentTime: gameStatusText || null,
                        lastPlay,
                        down,
                        possession,
                        weather,
                        isGameOver,
                    });
                }
            });

            return results;
        });

        return results.map((result) => {
                    const updatedGames = result.game.map((game) => {
                        const teamData = resolveNflTeam({ initial: game.initial, teamName: game.teamName });
                        return teamData ? { ...game, teamDetails: teamData } : null;
                    }).filter(Boolean);

                        if (updatedGames.length !== 2) {
                            const labels = (result.game || []).map((team) => team.teamName || team.initial).join(' vs ');
                            console.log(`[GAME_UPDATER] Dropping scrape with unresolved teams (${updatedGames.length}/2): ${labels}`);
                            return null;
                        }

                        return { ...result, game: updatedGames };
                    }).filter(Boolean);
    } catch (error) {
        console.error('Error scraping ESPN page:', error.message);
        return [];
    }
}

/* =============================================================================
   SHARED GAME FIELD HELPERS - used by create + update paths
   ============================================================================= */

// Marks games final immediately for rankings; keeps scraping last-play for a short window.
const resolveFinalStatus = ({ game, scrapedIsGameOver, now = Date.now() }) => {
    if (!scrapedIsGameOver) {
        return {
            isGameOver: false,
            playCollectionUntil: null,
            finalStatusDueAt: null,
        };
    }

    let collectUntilMs = game.playCollectionUntil
        ? new Date(game.playCollectionUntil).getTime()
        : null;

    if ((!collectUntilMs || !Number.isFinite(collectUntilMs)) && game.finalStatusDueAt) {
        collectUntilMs = new Date(game.finalStatusDueAt).getTime();
    }

    if (!collectUntilMs || !Number.isFinite(collectUntilMs) || collectUntilMs < now) {
        collectUntilMs = now + FINAL_STATUS_DELAY_MS;
    }

    return {
        isGameOver: true,
        playCollectionUntil: new Date(collectUntilMs),
        finalStatusDueAt: null,
    };
};

const calculateSpread = (mergedGame) => {
    const spreadText = (mergedGame.spread || '').trim();
    const spreadMatch = spreadText.match(/(?:Spread:\s*)?([A-Za-z]{2,5})\s*([+-]?\d+(?:\.\d+)?)/i);
    const spreadTeamInitial = spreadMatch && spreadMatch[1] ? spreadMatch[1].toUpperCase() : '';
    const spreadAmount = spreadMatch && spreadMatch[2] ? parseFloat(spreadMatch[2]) : 0;
    const spreadTeam = mergedGame.game.find((team) => team.teamDetails.shortLocation === spreadTeamInitial);

    return {
        teamId: spreadTeam ? spreadTeam.teamDetails._id : null,
        amount: spreadAmount || 0,
        spreadDateTime: new Date(),
    };
};

const buildLineHistoryFields = (game, spread, overUnder) => ({
    spreadHistory: upsertSpreadHistory(game.spreadHistory, spread),
    overUnderHistory: upsertOverUnderHistory(game.overUnderHistory, overUnder),
});

/* =============================================================================
   GAME CREATION - ported from utilities.js (formatGames + createGames)
   ============================================================================= */

const getCompetitorHash = (competitors = []) => {
    const hashCompetitors = competitors.map((competitor) => ({
        _id: competitor._id,
        name: competitor.name,
        startDateTime: competitor.startDateTime,
    }));

    return JSON.stringify(hashCompetitors);
};

const NFL_TIMEZONE = 'America/New_York';

const normalizeStatusText = (statusText) => String(statusText ?? '').trim().replace(/\u00a0/g, ' ');

const isLiveGameStatus = (statusText = '') => {
    const status = normalizeStatusText(statusText);
    if (!status || /^final/i.test(status)) {
        return false;
    }

    if (/halftime/i.test(status)) {
        return true;
    }

    if (/\b(1st|2nd|3rd|4th|OT)\b/i.test(status)) {
        return true;
    }

    if (/^\d{1,2}:\d{2}\s*-/.test(status)) {
        return true;
    }

    return false;
};

const isScheduledKickoffStatus = (statusText = '') => {
    const status = normalizeStatusText(statusText);
    return /^(\d{1,2}:\d{2}\s*(?:A\.?\s*M\.?|P\.?\s*M\.?))$/i.test(status);
};

const parseCardDate = (cardDateText = '') => {
    const cardDate = normalizeStatusText(cardDateText);
    if (!cardDate) {
        return null;
    }

    const formats = ['dddd, MMMM D, YYYY', 'dddd, MMMM DD, YYYY'];

    for (const format of formats) {
        const parsed = moment.tz(cardDate, format, true, NFL_TIMEZONE);
        if (parsed.isValid()) {
            return parsed;
        }
    }

    return null;
};

const parseKickoffFromCardAndTime = ({ cardDateText, timeText }) => {
    const status = normalizeStatusText(timeText);
    const cardMoment = parseCardDate(cardDateText);

    if (!cardMoment || !status) {
        return null;
    }

    const timeMatch = status.match(/^(\d{1,2}:\d{2})\s*(A\.?\s*M\.?|P\.?\s*M\.?)\.?$/i);
    if (!timeMatch) {
        return null;
    }

    const meridiem = timeMatch[2].replace(/\./g, '').replace(/\s/g, '').toUpperCase();
    const kickoff = moment.tz(
        `${cardMoment.format('YYYY-MM-DD')} ${timeMatch[1]} ${meridiem}`,
        'YYYY-MM-DD h:mm A',
        true,
        NFL_TIMEZONE
    );

    return kickoff.isValid() ? kickoff.toDate() : null;
};

const resolveScrapedKickoff = (scrapedGame = {}) => {
    const parsed = parseScheduledKickoff({
        cardDateText: scrapedGame.card,
        statusText: scrapedGame.kickoffTime,
        isPreGame: scrapedGame.isPreGame === true,
    });

    if (parsed) {
        return parsed;
    }

    if (scrapedGame.apiKickoff) {
        return new Date(scrapedGame.apiKickoff);
    }

    return null;
};

const parseScheduledKickoff = ({ cardDateText, statusText, isPreGame = false }) => {
    const status = normalizeStatusText(statusText);
    if (!status) {
        return null;
    }

    if (isPreGame || isScheduledKickoffStatus(status)) {
        return parseKickoffFromCardAndTime({ cardDateText, timeText: status });
    }

    if (/^final/i.test(status) || isLiveGameStatus(status)) {
        return null;
    }

    return parseKickoffFromCardAndTime({ cardDateText, timeText: status });
};

const formatKickoffForLog = (kickoff) => moment(kickoff).tz(NFL_TIMEZONE).format('ddd MMM D YYYY h:mm A z');

const buildSharedGameMatchKeys = (results = []) =>
    new Set(
        results
            .map((result) => getScrapedGameMatchKey(result, resolveScrapedKickoff(result)))
            .filter((key) => key.includes('@'))
    );

const findScrapedGameForDbGame = (results, dbGame) =>
    results.find((result) =>
        hasSameGameMatch({
            dbGame,
            scrapedGame: result,
            scrapedKickoff: resolveScrapedKickoff(result),
        })
    );

const applyStartDateTimeToCompetitors = ({ scrapedGame, competitors = [] }) => {
    const kickoff = resolveScrapedKickoff(scrapedGame);

    if (!kickoff || competitors.length === 0) {
        return {
            competitors,
            startDateTimeFields: {},
            kickoffLog: null,
        };
    }

    const nextCompetitors = competitors.map((competitor) => ({
        ...competitor,
        startDateTime: kickoff,
    }));

    return {
        competitors: nextCompetitors,
        startDateTimeFields: {
            startDateTime: kickoff,
            hashCompetitors: getCompetitorHash(nextCompetitors),
        },
        kickoffLog: formatKickoffForLog(kickoff),
    };
};

const buildGameFromScrapedResult = (scrapedGame, { leagueId, year }) => {
    const teams = scrapedGame.game || [];
    if (teams.length !== 2 || !teams[0]?.teamDetails || !teams[1]?.teamDetails) {
        return null;
    }

    const startDateTime = resolveScrapedKickoff(scrapedGame);

    if (!startDateTime) {
        console.log('[GAME_UPDATER] Skipping create; could not parse scheduled kickoff:', {
            espnGameId: scrapedGame.espnGameId,
            card: scrapedGame.card,
            kickoffTime: scrapedGame.kickoffTime,
            status: scrapedGame.currentTime,
            isPreGame: scrapedGame.isPreGame,
        });
        return null;
    }

    const competitors = [
        {
            _id: new mongoose.Types.ObjectId(teams[0].teamDetails._id),
            name: `${teams[0].teamDetails.location} ${teams[0].teamDetails.name}`,
            startDateTime,
        },
        {
            _id: new mongoose.Types.ObjectId(teams[1].teamDetails._id),
            name: `${teams[1].teamDetails.location} ${teams[1].teamDetails.name}`,
            startDateTime,
        },
    ];

    const spread = calculateSpread(scrapedGame);
    const overUnder = parseInt(scrapedGame.total, 10) || undefined;
    const emptyGame = { spreadHistory: [], overUnderHistory: [] };
    const lineHistories = buildLineHistoryFields(emptyGame, spread, overUnder);

    return {
        leagueId: new mongoose.Types.ObjectId(leagueId),
        year,
        startDateTime,
        competitors,
        hashCompetitors: getCompetitorHash(competitors),
        spread: spread?.teamId ? spread : null,
        overUnder,
        spreadHistory: lineHistories.spreadHistory,
        overUnderHistory: lineHistories.overUnderHistory,
        weather: scrapedGame.weather || '57',
        isGameOver: scrapedGame.isGameOver === true,
        playCollectionUntil: scrapedGame.isGameOver === true
            ? new Date(Date.now() + FINAL_STATUS_DELAY_MS)
            : null,
        finalStatusDueAt: null,
        currentTime: scrapedGame.currentTime || null,
    };
};

const createMissingGamesFromScrape = async ({ results, year, leagueId }) => {
    const leagueObjectId = new mongoose.Types.ObjectId(leagueId);
    const existingGames = await gameRepository.find({ leagueId: leagueObjectId, year });
    const existingHashes = new Set(
        existingGames.map((game) => game.hashCompetitors).filter(Boolean)
    );
    const existingMatchKeys = new Set(
        existingGames.map(getDbGameMatchKey).filter((key) => key.includes('@'))
    );

    let createdCount = 0;

    for (const scrapedGame of results) {
        const gameDoc = buildGameFromScrapedResult(scrapedGame, { leagueId, year });
        if (!gameDoc) {
            continue;
        }

        const scrapedMatchKey = getScrapedGameMatchKey(scrapedGame, gameDoc.startDateTime);
        if (existingHashes.has(gameDoc.hashCompetitors)) {
            continue;
        }

        if (scrapedMatchKey && existingMatchKeys.has(scrapedMatchKey)) {
            continue;
        }

        try {
            await gameRepository.create(gameDoc);
            existingHashes.add(gameDoc.hashCompetitors);
            if (scrapedMatchKey) {
                existingMatchKeys.add(scrapedMatchKey);
            }
            createdCount += 1;
            logGameCreate({ gameDoc });
        } catch (error) {
            console.error('[GAME_UPDATER] create game error:', error.message);
        }
    }

    if (createdCount === 0) {
        console.log('[GAME_UPDATER] No new games to create.');
    } else {
        console.log(`[GAME_UPDATER] Created ${createdCount} new game(s).`);
    }

    return createdCount;
};

/* =============================================================================
   GAME UPDATES - spread, score, live status
   ============================================================================= */

const buildGameSearch = ({ year, includeAllActive = false }) => {
    const leagueObjectId = new mongoose.Types.ObjectId(leagueId);
    const base = {
        leagueId: leagueObjectId,
        year,
        $or: [
            { isGameOver: { $ne: true } },
            { playCollectionUntil: { $gt: new Date() } },
            { finalStatusDueAt: { $gt: new Date() } },
        ],
    };

    if (includeAllActive) {
        return base;
    }

    return {
        ...base,
        startDateTime: { $lte: new Date(Date.now() + 30 * 60 * 1000) },
    };
};

const loadScrapedScoreboardResults = async ({ url, year, seasonType, weekNumber }) => {
    let results = [];
    let events = [];

    await withEspnPage(url, async (page) => {
        ({ results } = await getScrapedResults(page));
    });

    try {
        events = await fetchEspnNflScoreboardEvents({ year, seasonType, weekNumber });
        results = enrichScrapedResultsWithEspnKickoffs(results, buildEspnKickoffByGameId(events));
        console.log(`[GAME_UPDATER] Enriched ${events.length} ESPN API events for kickoff fallback.`);
    } catch (error) {
        console.log('[GAME_UPDATER] ESPN API kickoff enrich failed:', error.message);
    }

    return {
        results,
        events,
        sharedGameKeys: buildSharedGameMatchKeys(results),
    };
};

const buildScoreboardReconciliation = async ({ results, events, year, seasonType, weekNumber }) => {
    const leagueObjectId = new mongoose.Types.ObjectId(leagueId);
    const dbGames = await gameRepository.find({ leagueId: leagueObjectId, year });
    const gameWeeks = await gameWeekRepository.find({ leagueId: leagueObjectId, year });
    const gameWeek = findGameWeekForEspnWeek(gameWeeks, { seasonType, weekNumber });

    if (!gameWeek) {
        console.log(
            `[GAME_UPDATER] No Game_Week row for ESPN week ${weekNumber} (seasonType ${seasonType}); using kickoff window fallback for reconcile.`,
        );
    }

    return reconcileScoreboardGameCounts({
        results,
        dbGames,
        events,
        gameWeek,
        resolveScrapedKickoff,
    });
};

const logScoreboardReconciliation = (reconciliation) => {
    const summary =
        `Scoreboard games: ${reconciliation.scrapedCount} ESPN / ${reconciliation.dbCount} DB (this week)`;

    if (reconciliation.ok) {
        console.log(`[GAME_UPDATER] ${summary} — all accounted for.`);
        return false;
    }

    console.log(`[GAME_UPDATER] ${summary} — MISMATCH.`);
    console.log('[GAME_UPDATER] Check that all games are accounted for (ESPN scoreboard vs database).');

    if (!reconciliation.countsMatch) {
        const countMessage =
            `Scoreboard game count mismatch: ${reconciliation.scrapedCount} found on ESPN, ${reconciliation.dbCount} in DB for this week.`;
        console.log(`[GAME_UPDATER] ${countMessage}`);
        logGameUpdaterError(countMessage);
    } else {
        const lineupMessage =
            `Scoreboard game count matches (${reconciliation.scrapedCount}) but matchups do not line up.`;
        console.log(`[GAME_UPDATER] ${lineupMessage}`);
        logGameUpdaterError(lineupMessage);
    }

    if (reconciliation.missingInDb.length) {
        const missingMessage = `On ESPN but missing in DB: ${reconciliation.missingInDb.join('; ')}`;
        console.log(`[GAME_UPDATER] ${missingMessage}`);
        logGameUpdaterError(missingMessage);
    }

    if (reconciliation.extraInDb.length) {
        const extraMessage = `In DB but not on ESPN scoreboard: ${reconciliation.extraInDb.join('; ')}`;
        console.log(`[GAME_UPDATER] ${extraMessage}`);
        logGameUpdaterError(extraMessage);
    }

    return true;
};

const updateGameSpread = async ({ game, mergedGame }) => {
    const spread = calculateSpread(mergedGame);
    const overUnder = parseInt(mergedGame.total, 10);
    const lineHistories = buildLineHistoryFields(game, spread, overUnder);
    const {
        competitors: competitorsWithKickoff,
        startDateTimeFields,
        kickoffLog,
    } = applyStartDateTimeToCompetitors({
        scrapedGame: mergedGame,
        competitors: game.competitors || [],
    });

    const updateResult = await gameRepository.updateOne(
        { _id: game._id },
        {
            $set: {
                spread: spread,
                overUnder,
                spreadHistory: lineHistories.spreadHistory,
                overUnderHistory: lineHistories.overUnderHistory,
                weather: (mergedGame.weather || game.weather) || '57',
                competitors: competitorsWithKickoff,
                ...startDateTimeFields,
            }
        }
    );

    logGameUpdate({
        game,
        updateType: 'spread',
        details: `spread ${spread.amount}, O/U ${overUnder || 'N/A'}${kickoffLog ? `, kickoff ${kickoffLog}` : ''}`,
        updateResult,
    });

    return updateResult;
};

const updateGameScore = async ({ game, mergedGame }) => {
    const resolveLinescores = (scrapedTeam, existingCompetitor) => {
        const scraped = scrapedTeam?.linescores;
        if (Array.isArray(scraped) && scraped.length > 0) {
            return scraped;
        }

        return existingCompetitor?.linescores;
    };

    const updatedCompetitors = [
        {
            ...game.competitors[0],
            score: parseInt(mergedGame.game[0].score, 10),
            linescores: resolveLinescores(mergedGame.game[0], game.competitors[0]),
        },
        {
            ...game.competitors[1],
            score: parseInt(mergedGame.game[1].score, 10),
            linescores: resolveLinescores(mergedGame.game[1], game.competitors[1]),
        }
    ];

    const {
        competitors: competitorsWithKickoff,
        startDateTimeFields,
        kickoffLog,
    } = applyStartDateTimeToCompetitors({
        scrapedGame: mergedGame,
        competitors: updatedCompetitors,
    });

    const newPlayHistory = getPlayHistory({
        message: 'game-updater',
        leagueId,
        playHistory: game.playHistory || [],
        lastPlay: mergedGame.lastPlay || '',
        currentTime: mergedGame.currentTime || '',
    });

    const { isGameOver, playCollectionUntil, finalStatusDueAt } = resolveFinalStatus({
        game,
        scrapedIsGameOver: mergedGame.isGameOver === true,
    });

    const updateResult = await gameRepository.updateOne(
        { _id: game._id },
        {
            $set: {
                competitors: competitorsWithKickoff,
                down: mergedGame.down || null,
                possession: mergedGame.possession || null,
                currentTime: mergedGame.currentTime,
                isGameOver,
                playCollectionUntil,
                finalStatusDueAt,
                playHistory: newPlayHistory,
                ...startDateTimeFields,
            }
        }
    );

    const finalNote = playCollectionUntil
        ? `, collecting plays until ${playCollectionUntil.toISOString()}`
        : '';

    logGameUpdate({
        game,
        updateType: 'score',
        details: `${competitorsWithKickoff[0].score}-${competitorsWithKickoff[1].score}, clock ${mergedGame.currentTime || 'N/A'}, isGameOver ${isGameOver}, playHistory ${newPlayHistory.length}${finalNote}${kickoffLog ? `, kickoff ${kickoffLog}` : ''}`,
        updateResult,
    });

    return updateResult;
};

const runGameUpdate = async () => {
    try {
        const { year, seasonType, weekNumber, url } = getNflGameDataSource();

        console.log("🏈 Update Game Information:");

        const memoryUsage = process.memoryUsage();
        const usedMemoryMB = memoryUsage.heapUsed / 1024 / 1024;
        const memoryStatus = (() => {
            if (usedMemoryMB < 200) return 'Great! 🌞';
            if (usedMemoryMB < 400) return 'Suspect 😐';
            if (usedMemoryMB < 600) return 'Poor 😟';
            return 'Bad 😞';
        })();

        console.log(`Memory Usage: ${Math.round(usedMemoryMB)} MB at ${new Date().toISOString()}`);
        console.log(`Memory Status: ${memoryStatus}`);

        if (usedMemoryMB >= 600) {
            console.log('[GAME_UPDATER] High memory usage detected; restarting browser session.');
            await closeSharedBrowser();
        }

        const search = buildGameSearch({ year });

        let games = await gameRepository.find(search);

        const { results, events, sharedGameKeys } = await loadScrapedScoreboardResults({
            url,
            year,
            seasonType,
            weekNumber,
        });

        if (sharedGameKeys.size === 0) {
            console.log('[GAME_UPDATER] Scoreboard games: 0 ESPN — skipping update run.');
            console.log('No ESPN scoreboard games available; skipping update run.');
            console.log('------------------------');
            return;
        }

        await createMissingGamesFromScrape({ results, year, leagueId });

        const reconciliation = await buildScoreboardReconciliation({
            results,
            events,
            year,
            seasonType,
            weekNumber,
        });
        const shouldShutdown = logScoreboardReconciliation(reconciliation);

        if (shouldShutdown) {
            await shutdownGameUpdater('Stopping game updater until all games are accounted for.');
        }

        {
            if (!games.length) {
                console.log(`All scores updated or no games close to starting.`);

                const now = new Date();
                const eastCoastDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                const eastCoastHour = eastCoastDate.getHours();
                const minutes = eastCoastDate.getMinutes();

                console.log('Current East Coast Hour:', eastCoastHour);

                if ((eastCoastHour === 2 && minutes < 30) || (eastCoastHour === 12 && minutes < 30)) {
                    games = await gameRepository.find(buildGameSearch({ year, includeAllActive: true }));
                }

                if (!games.length) {
                    console.log(`Not time to update spread.`);
                    console.log('------------------------');
                    return;
                }

                await Promise.all(
                    games.map(async (game) => {
                        const mergedGame = findScrapedGameForDbGame(results, game);

                        if (!mergedGame) {
                            console.log('mergedGame not found for game:', game._id?.toString());
                            return;
                        }

                        await updateGameSpread({ game, mergedGame });
                    })
                );

                console.log('------------------------');
                return;
            }

            games = await gameRepository.find(search);

            await Promise.all(
                games.map(async (game) => {
                    const dbGameKey = getDbGameMatchKey(game);

                    if (!sharedGameKeys.has(dbGameKey)) {
                        console.log('Skipping db game not present on ESPN scoreboard:', game._id?.toString());
                        return;
                    }

                    const mergedGame = findScrapedGameForDbGame(results, game);

                    if (!mergedGame) {
                        console.log('mergedGame not found for game:', game._id?.toString());
                        return;
                    }

                    const spreadUpdateTime = new Date(game.startDateTime.getTime() - 5 * 60 * 1000);
                    const currentTime = new Date();

                    if (currentTime < spreadUpdateTime) {
                        await updateGameSpread({ game, mergedGame });
                    } else {
                        await updateGameScore({ game, mergedGame });
                    }
                })
            );

            console.log('------------------------');
        }
    } catch (error) {
        console.error('Error updating game information:', error);
        await closeSharedBrowser();
    }
};

/* =============================================================================
   MAIN UPDATE LOOP
   ============================================================================= */

const startGameUpdateLoop = async () => {
    while (!isShuttingDown) {
        const cycleStartTime = Date.now();
        await runGameUpdate();

        if (isShuttingDown) {
            break;
        }

        const elapsedMs = Date.now() - cycleStartTime;
        const delayMs = Math.max(0, UPDATE_INTERVAL_MS - elapsedMs);

        await sleep(delayMs);
    }
};

startGameUpdateLoop();

process.on('SIGINT', async () => {
    isShuttingDown = true;
    if (updateLoopSleep) {
        clearTimeout(updateLoopSleep);
    }
    await closeSharedBrowser();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    isShuttingDown = true;
    if (updateLoopSleep) {
        clearTimeout(updateLoopSleep);
    }
    await closeSharedBrowser();
    process.exit(0);
});
