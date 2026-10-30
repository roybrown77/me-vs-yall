const FINAL_STATUS_DELAY_MS = 60 * 1000;

// Marks games final immediately for rankings; keeps scraping last-play for a short window.
const resolveFinalStatus = ({ game = {}, scrapedIsGameOver = false, now = Date.now() }) => {
    if (!scrapedIsGameOver) {
        return {
            isGameOver: false,
            playCollectionUntil: null,
            finalStatusDueAt: null,
        };
    }

    if (game.isGameOver && !game.playCollectionUntil && !game.finalStatusDueAt) {
        return {
            isGameOver: true,
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

    if (!collectUntilMs || !Number.isFinite(collectUntilMs)) {
        collectUntilMs = now + FINAL_STATUS_DELAY_MS;
    } else if (now >= collectUntilMs) {
        return {
            isGameOver: true,
            playCollectionUntil: null,
            finalStatusDueAt: null,
        };
    }

    return {
        isGameOver: true,
        playCollectionUntil: new Date(collectUntilMs),
        finalStatusDueAt: null,
    };
};

module.exports = {
    FINAL_STATUS_DELAY_MS,
    resolveFinalStatus,
};
