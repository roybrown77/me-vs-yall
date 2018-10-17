import React from 'react';
import PropTypes from 'prop-types';

import { getBet, getWinnings, formatMoney, getResults, areAnyGamesOver } from '../selectors';

const PickResult = ({games, picks}) => {
	const results = getResults(games, picks);
	const winnings = getWinnings(results);
	const bet = getBet(results);
	const gamesOver = areAnyGamesOver(games);
	const winloss = (winnings || 0) < 0 ? 'lost' : 'won';

	return (gamesOver && 
		<div>
			<div style={{fontSize: '40px', color: '#FFC107'}}>
				{results['wins'] +  " - " + results['losses'] + " - " + results['ties']}
			</div>
			<div style={{fontSize: '20px', color: '#FFC107'}}>
				ya {winloss} {formatMoney(winnings)} {"bet'n"} {formatMoney(bet)}
			</div>
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array
};

export default PickResult;