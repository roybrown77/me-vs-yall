import React from 'react';
import PropTypes from 'prop-types';

import { getResults, areAnyGamesOver } from '../selectors/data';

const PickResult = ({games, picks}) => {
	const results = getResults(games, picks);
	const gamesOver = areAnyGamesOver(games);

	return (gamesOver && 
		<div style={{fontSize: '40px', color: '#FFC107'}}>
			{results.wins +  " - " + results.losses + " - " + results.ties}
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array
};

export default PickResult;