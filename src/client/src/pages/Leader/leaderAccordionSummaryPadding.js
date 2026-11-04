const countEmojiGraphemes = (value) => [...String(value)].length;

/** ~9rem column at 1.25rem — emojis + " x12" suffix. */
const EMOJI_LINE_CAPACITY = 8;

const estimateStreakWrapRows = (streakEmoji, streakMultiplier) => {
  const emojiCount = countEmojiGraphemes(streakEmoji);
  const suffixLen = 2 + String(streakMultiplier ?? 0).length;
  const wrapUnits = emojiCount + suffixLen;
  return Math.max(1, Math.ceil(wrapUnits / EMOJI_LINE_CAPACITY));
};

/** Room for absolutely positioned stats + wrapping streak emojis (9rem column). */
export const getLeaderAccordionSummaryPaddingBottomRem = ({
  streakEmoji = "",
  streakMultiplier = 0,
  areAnyGamesInProgress = false,
  showBonusPoints = false,
}) => {
  const base = 1.75;
  let pad = base;

  if (areAnyGamesInProgress) {
    pad += 0.15;
  }
  if (showBonusPoints) {
    pad += 0.15;
  }

  const streakRows = estimateStreakWrapRows(streakEmoji, streakMultiplier);
  if (streakRows <= 1) {
    return Math.round(pad * 4) / 4;
  }

  const perExtraRowRem = 0.28;
  pad += (streakRows - 1) * perExtraRowRem;

  return Math.round(pad * 4) / 4;
};

export { estimateStreakWrapRows };
