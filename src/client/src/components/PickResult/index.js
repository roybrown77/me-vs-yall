import React from 'react';
import PropTypes from 'prop-types';

import { getResults, areAnyGamesOver } from '../../utilities';

const PickResult = ({games, picks, spreadMode = false}) => {
	const gamesOver = areAnyGamesOver(games);
	const results = getResults(games, picks, spreadMode);

	return (gamesOver && 
		<div>
			<div style={{fontSize: '40px', color: 'rgba(0, 0, 0, 0.87)'}}>
				{results['wins'] +  " - " + results['losses']}
			</div>
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array,
	spreadMode: PropTypes.bool
};

export default PickResult;