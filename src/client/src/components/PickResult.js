import React from 'react';
import PropTypes from 'prop-types';

import { getResults, areAnyGamesOver } from '../selectors/data';

function formatMoney(number, places, symbol, thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	return (negative === '-' ? negative + symbol : symbol + negative) + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

const PickResult = ({games, picks}) => {
	const results = getResults(games, picks);
	const winnings = (results.wins * 100) - (results.losses * 110) - (results.ties * 110);
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