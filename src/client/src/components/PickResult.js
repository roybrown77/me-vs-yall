import React from 'react';
import PropTypes from 'prop-types';

const PickResult = ({games, picks}) => {
	let wins = 0;
    let losses = 0;
    let ties = 0;

	const areAnyGamesOver = games.some(x=>!!x.isGameOver);

	if (areAnyGamesOver) {
	    games.forEach((game)=>{
	        if (game.isGameOver && game.competitors[0].score === game.competitors[1].score ) {
	            ++ties;
	        }

			const winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

	        game.competitors.forEach((competitor, index)=> {
	            const winnerSelected = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;

	            if (winnerSelected && competitor._id === winner && game.isGameOver) {
	                ++wins;
	            }

	            if (winnerSelected && competitor._id !== winner && game.isGameOver) {
	                ++losses;
	            }
	        });
	    });
	}
    
	return (areAnyGamesOver && 
		<div style={{fontSize: '40px', color: '#FFC107'}}>
			{wins +  " - " + losses + " - " + ties}
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array
};

export default PickResult;