import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

import { getResults, areAnyGamesOver } from '../../utilities';

const PickResult = ({loading = false, games, picks, spreadMode = false}) => {
	const gamesOver = areAnyGamesOver(games);
	const results = getResults(games, picks, spreadMode);

	if (loading) {
		<div>
			<div style={{margin: '0 15% 10px 15%'}}>
				<Skeleton animation="pulse" height='30px' variant="rect"/>
			</div>
		</div>
	}

	return (gamesOver && 
		<div style={{fontSize: '20px', fontFamily: 'monospace', fontcolor: 'rgba(0, 0, 0, 0.87)'}}>
			{`${results['wins']} wins ${results['losses']} losses`}
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array,
	spreadMode: PropTypes.bool
};

export default PickResult;