import React from 'react';
import PropTypes from 'prop-types';

import { getWinnings, formatMoney, getResults, areAnyGamesOver } from '../selectors/data';

const PickResult = ({games, picks}) => {
	const results = getResults(games, picks);
	const winnings = getWinnings(results);
	const bet = (results.wins * 110) + (results.losses * 110) + (results.ties * 110);
	const gamesOver = areAnyGamesOver(games);

	return (gamesOver && 
		<div style={{fontSize: '40px', color: '#FFC107'}}>
			{results.wins +  " - " + results.losses + " - " + results.ties}

			<div style={{fontSize: '20px', color: '#FFC107'}}>
				{formatMoney(winnings)} on {formatMoney(bet)}
			</div>
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array
};

export default PickResult;