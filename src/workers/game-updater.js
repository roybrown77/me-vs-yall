const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const gameRepository = require('../server/game/databaseRepositories/GameRepository');
const { dbConnectionString } = require('../../config');
const { nflTeams } = require('../server/utilities/teams/nfl');

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

const url = 'https://www.espn.com/nfl/scoreboard';
const leagueId = '59723313734d1d6202a85f10';
const year = 2026;

setInterval(async () => {
    try {
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

            if ((eastCoastHour === 2 && minutes < 15) || (eastCoastHour === 14 && minutes < 15)) {
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

            const results = await scrapeGameInformation(url);

            // Update spreads only
            for (const game of games) {
                const mergedGame = results.find((result) =>
                    result.game.some((team) =>
                        team.teamDetails._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()
                    )
                );

                console.log('mergedGame:', JSON.stringify(mergedGame, null, 1));

                if (mergedGame) {
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
            }

            console.log('------------------------');
            return;
        }

        // Update game scores and spreads
        const results = await scrapeGameInformation(url);

        for (const game of games) {
            const mergedGame = results.find((result) =>
                result.game.some((team) =>
                    team.teamDetails._id.toString().toLowerCase() === game.competitors[1]._id.toString().toLowerCase()
                )
            );

            console.log('mergedGame:', JSON.stringify(mergedGame, null, 2));

            if (mergedGame) {
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
        }

        console.log('------------------------');
    } catch (error) {
        console.error('Error updating game information:', error);
    }
}, 10000);

async function scrapeGameInformation(url) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const results = await page.evaluate(() => {
            const results = [];
            const cards = document.querySelectorAll('.Card.gameModules');

            cards.forEach((cardElement, cardIndex) => {
                const cardHeader = cardElement.querySelector('.Card__Header__Title')?.textContent.trim() || '';
                console.log(`Card ${cardIndex + 1}: ${cardHeader}`);

                const games = cardElement.querySelectorAll('.Scoreboard');
                games.forEach((gameElement) => {
                    const competitors = gameElement.querySelectorAll('.ScoreboardScoreCell__Competitors > li');
                    const gameScores = [];

                    competitors.forEach((teamElement) => {
                        const teamNameEl = teamElement.querySelector('.ScoreCell__TeamName--shortDisplayName');
                        const teamName = teamNameEl?.textContent.trim() || '';

                        let teamInitial = '';
                        const teamAnchor = teamElement.querySelector('a.AnchorLink')?.getAttribute('href');
                        if (teamAnchor) {
                            const match = teamAnchor.match(/\/name\/(\w+)\//);
                            if (match && match[1]) {
                                teamInitial = match[1].toUpperCase();
                            }
                        }

                        const scoreEl = teamElement.querySelector('.ScoreCell__Score');
                        let score;

                        if (scoreEl) {
                            score = scoreEl.textContent.trim();
                        }

                        gameScores.push({
                            initial: teamInitial,
                            teamName: teamName,
                            score: score
                        });
                    });

                    const lastPlayEl = gameElement.querySelector('.Scoreboard__RowContainer.flex.flex-column.flex-auto');
                    let lastPlay;
                    if (lastPlayEl) {
                        const lastPlayText = lastPlayEl.textContent.trim();
                        const match = lastPlayText.match(/Last Play:\s*(.+)/);
                        if (match && match[1]) {
                            lastPlay = match[1];
                        }
                    }

                    let spread;
                    let total;

                    const oddsStrip = gameElement.querySelector('.OddsStripWrapper');
                    if (oddsStrip) {
                        const spreadEl = oddsStrip.querySelector('li:nth-child(1) .rIczU');
                        const totalEl = oddsStrip.querySelector('li:nth-child(2) .rIczU');

                        if (spreadEl) {
                            spread = spreadEl.textContent.trim();
                        }
                        if (totalEl) {
                            total = totalEl.textContent.trim();
                        }
                    }

                    const gameStatusEl = gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time');
                    const gameStatusText = gameStatusEl ? gameStatusEl.textContent.trim() : '';
                    const isGameOver = /^final\b/i.test(gameStatusText);

                    const currentTimeEl = gameElement.querySelector('.ScoreCell__Time.ScoreboardScoreCell__Time.h9.clr-negative');
                    const currentTime = currentTimeEl ? currentTimeEl.textContent.trim() : null;

                    const downAndDistanceEl = gameElement.querySelector('.DriveChart2D__DownAndDistance');
                    const down = downAndDistanceEl ? downAndDistanceEl.textContent.trim() : null;

                    const possessionEl = gameElement.querySelector('.ScoreboardScoreCell__Item--poss .AnchorLink');
                    let possession = null;
                    if (possessionEl) {
                        const possessionHref = possessionEl.getAttribute('href');
                        const match = possessionHref.match(/\/name\/(\w+)\//);
                        if (match && match[1]) {
                            possession = match[1].toUpperCase();
                        }
                    }

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
                            "44.png": "Mostly Cloudy w/ Snow (Night)"
                        };

                        if (weatherIconStyle) {
                            const match = weatherIconStyle.match(/(\d+\.png)/);
                            if (match && match[1] && weatherIconMap[match[1]]) {
                                weather += `,${weatherIconMap[match[1]]}`;
                            }
                        }
                    }

                    if (gameScores.length > 0) {
                        results.push({
                            card: cardHeader,
                            game: gameScores,
                            spread: spread,
                            total: total,
                            currentTime: currentTime,
                            lastPlay: lastPlay,
                            down: down,
                            possession: possession,
                            weather: weather,
                            isGameOver: isGameOver,
                        });
                    }

                    if (gameScores.length > 0) {
                        results.push({
                            card: cardHeader,
                            game: gameScores
                        });
                    }
                });
            });

            return results;
        });

        return results.map((result) => {
                    const updatedGames = result.game.map((game) => {
                        const teamData = nflTeams.find((team) => team.shortLocation === game.initial);
                        return teamData ? { ...game, teamDetails: teamData } : null;
                    }).filter(Boolean);

                        return updatedGames.length > 0 ? { ...result, game: updatedGames } : null;
                    }).filter(Boolean);
    } catch (error) {
        console.error('Error fetching the URL:', error.message);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

const calculateSpread = (mergedGame) => {
    const spreadParts = mergedGame.spread.split(' ');
    const spreadTeamInitial = spreadParts[0];
    const spreadAmount = parseFloat(spreadParts[1]);
    const spreadTeam = mergedGame.game.find((team) => team.teamDetails.shortLocation === spreadTeamInitial);

    const spread = {
        teamId: spreadTeam ? spreadTeam.teamDetails._id : null,
        amount: spreadAmount || 0,
        spreadDateTime: new Date(),
    };

    return spread;
};

