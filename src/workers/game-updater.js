const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const mongoose = require('mongoose');
const gameRepository = require('../server/game/databaseRepositories/GameRepository');
const { dbConnectionString } = require('../../config');
const { nflTeams } = require('../server/utilities/teams/nfl');
const { getGames } = require('../server/utilities/utilities');
const { getNflGameDataSource } = require('../server/utilities/getGameDataSource');

puppeteer.use(StealthPlugin());

/*
    Setup database
*/

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

/*
    Update game information every 10 seconds
*/

const leagueId = '59723313734d1d6202a85f10';

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

const hasSameCompetitors = ({ dbGame, scrapedGame }) => {
    const dbCompetitorIds = (dbGame.competitors || [])
        .map((competitor) => competitor?._id?.toString().toLowerCase())
        .filter(Boolean);

    const scrapedCompetitorIds = (scrapedGame.game || [])
        .map((team) => team?.teamDetails?._id?.toString().toLowerCase())
        .filter(Boolean);

    if (dbCompetitorIds.length !== 2 || scrapedCompetitorIds.length !== 2) {
        return false;
    }

    return dbCompetitorIds.every((id) => scrapedCompetitorIds.includes(id));
};

const getGameKeyFromIds = (ids = []) => ids
    .map((id) => id.toString().toLowerCase())
    .sort()
    .join('|');

const getDbGameKey = (dbGame) => getGameKeyFromIds((dbGame.competitors || []).map((competitor) => competitor?._id).filter(Boolean));

const getScrapedGameKey = (scrapedGame) => getGameKeyFromIds((scrapedGame.game || []).map((team) => team?.teamDetails?._id).filter(Boolean));

const getSharedGames = async ({ sourceUrl, sourceDayNumber }) => {
    const nflSelectorConfig = {
        root: 'Scoreboard__Row__Main',
        startDateSelector: 'section:nth-of-type(' + sourceDayNumber + ') > header > div.Card__Header__Title__Wrapper > h3',
        startTimeSelector: 'section:nth-of-type(' + sourceDayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > div > div.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-gray-03',
        nameSelector: 'section:nth-of-type(' + sourceDayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.flex-auto.Scoreboard__Column--1 > section > div > div > ul > li.ScoreboardScoreCell__Item.flex.items-center.relative.pb2.ScoreboardScoreCell__Item--HOMEAWAY > div.ScoreCell__Team.ScoreCell__Team--scoreboard.flex-column.pr2.ScoreCell__Team--football > div.ScoreCell__Truncate.clr-gray-01.ScoreCell__Truncate--scoreboard.flex.items-center.h7.h5 > a > div',
        spreadSelector: 'section:nth-of-type(' + sourceDayNumber + ') > div > section:nth-of-type(INDEX) > div > div:nth-of-type(1) > div.Scoreboard__Column.ph3.mv4.Scoreboard__Column--2',
    };

    return getGames({
        message: 'gameUpdaterSharedGetGames',
        url: sourceUrl,
        ...nflSelectorConfig,
    });
};

const getSharedGameKeys = (sharedGames = []) => sharedGames
    .map((sharedGame) => {
        const awayTeam = resolveNflTeam({ teamName: sharedGame.awayTeam });
        const homeTeam = resolveNflTeam({ teamName: sharedGame.homeTeam });

        if (!awayTeam || !homeTeam) {
            return null;
        }

        return getGameKeyFromIds([awayTeam._id, homeTeam._id]);
    })
    .filter(Boolean);

setInterval(async () => {
    try {
        const { year, dayNumber, url } = getNflGameDataSource();

        console.log("🏈 Update Game Information:");

        // Monitor memory usage
        const memoryUsage = process.memoryUsage();
        const memoryStatus = (() => {
            const usedMemoryMB = memoryUsage.heapUsed / 1024 / 1024;
            if (usedMemoryMB < 200) return 'Great! 🌞';
            if (usedMemoryMB < 400) return 'Suspect 😐';
            if (usedMemoryMB < 600) return 'Poor 😟';
            return 'Bad 😞';
        })();

        console.log(`Memory Usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB at ${new Date().toISOString()}`);
        console.log(`Memory Status: ${memoryStatus}`);

        // Find games to update
        const search = {
            leagueId: new mongoose.Types.ObjectId(leagueId),
            isGameOver: { $ne: true },
            // startDateTime: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days from now
            startDateTime: { $lte: new Date(Date.now() + 30 * 60 * 1000) }, // 30 minutes from now
            year: year
        };

        let games = await gameRepository.find(search);

        if (!games.length) {
            console.log(`All scores updated or no games close to starting.`);

            const now = new Date();
            // Get current time in US Eastern Time (handles DST automatically)
            const eastCoastDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
            const eastCoastHour = eastCoastDate.getHours();
            const minutes = eastCoastDate.getMinutes();

            console.log('Current East Coast Hour:', eastCoastHour);

            if ((eastCoastHour === 2 && minutes < 30) || (eastCoastHour === 14 && minutes < 30)) {
                games = await gameRepository.find({
                    leagueId: new mongoose.Types.ObjectId(leagueId),
                    isGameOver: { $ne: true },
                    year: year
                });
            }

            if (!games.length) {
                console.log(`Not time to update spread.`);
                console.log('------------------------');
                return;
            }

            const sharedGames = await getSharedGames({ sourceUrl: url, sourceDayNumber: dayNumber });
            const sharedGameKeys = new Set(getSharedGameKeys(sharedGames));

            if (sharedGameKeys.size === 0) {
                console.log('No shared games returned from getGames; skipping spread update run.');
                console.log('------------------------');
                return;
            }

            const results = (await scrapeGameInformation(url)).filter((result) => sharedGameKeys.has(getScrapedGameKey(result)));

            // Update spreads only
            for (const game of games) {
                const mergedGame = results.find((result) => hasSameCompetitors({ dbGame: game, scrapedGame: result }));

                if (!mergedGame) {
                    console.log('mergedGame not found for game:', game._id?.toString());
                    continue;
                }

                console.log('mergedGame:', JSON.stringify(mergedGame, null, 1));

                const spread = calculateSpread(mergedGame);

                console.log('spread:', spread);

                await gameRepository.updateOne(
                    { _id: game._id },
                    {
                        $set: {
                            spread: spread,
                            overUnder: parseInt(mergedGame.total, 10),
                            weather: (mergedGame.weather || game.weather) || '57',
                        }
                    }
                );
            }

            console.log('------------------------');
            return;
        }

        // Update game scores and spreads
        const sharedGames = await getSharedGames({ sourceUrl: url, sourceDayNumber: dayNumber });
        const sharedGameKeys = new Set(getSharedGameKeys(sharedGames));

        if (sharedGameKeys.size === 0) {
            console.log('No shared games returned from getGames; skipping score update run.');
            console.log('------------------------');
            return;
        }

        const results = (await scrapeGameInformation(url)).filter((result) => sharedGameKeys.has(getScrapedGameKey(result)));

        for (const game of games) {
            const dbGameKey = getDbGameKey(game);

            if (!sharedGameKeys.has(dbGameKey)) {
                console.log('Skipping db game not present in shared getGames list:', game._id?.toString());
                continue;
            }

            const mergedGame = results.find((result) => hasSameCompetitors({ dbGame: game, scrapedGame: result }));

            if (!mergedGame) {
                console.log('mergedGame not found for game:', game._id?.toString());
                continue;
            }

            console.log('mergedGame:', JSON.stringify(mergedGame, null, 2));

            const spreadUpdateTime = new Date(game.startDateTime.getTime() - 5 * 60 * 1000);
            const currentTime = new Date();

            if (currentTime < spreadUpdateTime) {
                const spread = calculateSpread(mergedGame);

                await gameRepository.updateOne(
                    { _id: game._id },
                    {
                        $set: {
                            spread: spread,
                            overUnder: parseInt(mergedGame.total, 10),
                            weather: (mergedGame.weather || game.weather) || '57',
                        }
                    }
                );
            } else {
                const updatedCompetitors = [
                    {
                        ...game.competitors[0],
                        score: parseInt(mergedGame.game[0].score, 10),
                    },
                    {
                        ...game.competitors[1],
                        score: parseInt(mergedGame.game[1].score, 10),
                    }
                ]

                console.log('updatedCompetitors:', updatedCompetitors);

                await gameRepository.updateOne(
                    { _id: game._id },
                    { $set: { 
                            competitors: updatedCompetitors,
                            down: `Down: ${mergedGame.down || 'N/A'} - Poss: ${mergedGame.possession || 'N/A'} - Last play: ${mergedGame.lastPlay || 'N/A'}`,
                            currentTime: mergedGame.currentTime,
                            isGameOver: mergedGame.isGameOver 
                        }
                    }
                );
            }
        }

        console.log('------------------------');
    } catch (error) {
        console.error('Error updating game information:', error);
    }
}, 10000);

async function scrapeGameInformation(url) {
    let browser;
    let page;
    try {
        browser = await puppeteer.launch({
            pipe: true,
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        page = await browser.newPage();
        await page.setViewport({ width: 2500, height: 1500 });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        await page.goto(url, { waitUntil: 'networkidle2' });

        const results = await page.evaluate(() => {
            const results = [];
            const scoreboards = document.querySelectorAll('.Scoreboard');

            scoreboards.forEach((gameElement) => {
                const cardHeader = gameElement.closest('.Card')?.querySelector('.Card__Header__Title')?.textContent?.trim() || '';
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

                    gameScores.push({
                        initial: teamInitial,
                        teamName,
                        score,
                    });
                });

                const lastPlayText = gameElement.querySelector('.Scoreboard__RowContainer.flex.flex-column.flex-auto')?.textContent?.trim() || '';
                const lastPlayMatch = lastPlayText.match(/Last\s*Play:\s*(.+)/i);
                const lastPlay = lastPlayMatch ? lastPlayMatch[1] : '';

                const spread = gameElement.querySelector('.OddsStripWrapper li:nth-child(1) .rIczU')?.textContent?.trim() || '';
                const total = gameElement.querySelector('.OddsStripWrapper li:nth-child(2) .rIczU')?.textContent?.trim() || '';

                const gameStatusText = gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time')?.textContent?.trim() || '';
                const isGameOver = /^final\b/i.test(gameStatusText);

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

                        return updatedGames.length > 0 ? { ...result, game: updatedGames } : null;
                    }).filter(Boolean);
    } catch (error) {
        console.error('Error fetching the URL:', error.message);
        return [];
    } finally {
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
    }
}

const calculateSpread = (mergedGame) => {
    const spreadText = (mergedGame.spread || '').trim();
    const spreadMatch = spreadText.match(/(?:Spread:\s*)?([A-Za-z]{2,5})\s*([+-]?\d+(?:\.\d+)?)/i);
    const spreadTeamInitial = spreadMatch && spreadMatch[1] ? spreadMatch[1].toUpperCase() : '';
    const spreadAmount = spreadMatch && spreadMatch[2] ? parseFloat(spreadMatch[2]) : 0;
    const spreadTeam = mergedGame.game.find((team) => team.teamDetails.shortLocation === spreadTeamInitial);

    const spread = {
        teamId: spreadTeam ? spreadTeam.teamDetails._id : null,
        amount: spreadAmount || 0,
        spreadDateTime: new Date(),
    };

    return spread;
};

