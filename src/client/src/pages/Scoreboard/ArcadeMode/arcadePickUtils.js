const TIE_PICK_ID = "000000000000000000000000";

const getWinnerId = (game) => {
  if (!game?.isGameOver) return null;
  const a = game?.competitors?.[0];
  const h = game?.competitors?.[1];
  const aScore = typeof a?.score === "number" ? a.score : null;
  const hScore = typeof h?.score === "number" ? h.score : null;
  if (aScore == null || hScore == null) return null;
  if (aScore === hScore) return TIE_PICK_ID;
  return aScore > hScore ? a?._id : h?._id;
};

// Returns: 'win' | 'loss' | 'push' | 'pending' | null
const getPickOutcome = ({ game, pickId }) => {
  if (!pickId) return null;
  if (!game?.isGameOver) return "pending";
  const winnerId = getWinnerId(game);
  if (!winnerId) return null;
  if (winnerId === TIE_PICK_ID) {
    return pickId === TIE_PICK_ID ? "win" : "push";
  }
  return pickId === winnerId ? "win" : "loss";
};

export { TIE_PICK_ID, getPickOutcome, getWinnerId };
