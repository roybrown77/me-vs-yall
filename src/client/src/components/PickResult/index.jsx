import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import Button from "@mui/material/Button";

import { getResults, areAnyGamesOver } from '../../utilities';

const style = {
	backgroundColor: '#3772FA',
	borderColor: '#3772FA',
	'&:hover': {
	  backgroundColor: '#3772FA',
	  color: '#FFFFFF',
	  borderColor: '#3772FA',
	},
	borderRadius: 0,
	color: '#FFD700',
	fontSize: '2rem',
	fontWeight: "700",
	margin: '0',
	padding: '0',
	width: '7rem',
	'WebkitBoxShadow': '-8px 8px 0px 0px #000',
	'MozBoxShadow': '-8px 8px 0px 0px #000',
	boxShadow: '-8px 8px 0px 0px #000',
	display: 'block',
  };

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
		<div style={{
				display: 'flex',
				margin: '1.25rem',
				alignItems: 'center',
				justifyContent: 'center',
		 	}}
		 >
			<Button
              variant="contained"
              style={style}
            >
              <div>{`${results['wins']}`}</div>
			  <div style={{ fontSize: '1rem' }}>Wins</div>
            </Button>
			<Button
              variant="contained"
              style={{...style, marginLeft: '1rem' }}
            >
              <div>{`${results['losses']}`}</div>
			  <div style={{ fontSize: '1rem' }}>Losses</div>
            </Button>
		</div>
	);
};

PickResult.propTypes = {
	games: PropTypes.array,
	picks: PropTypes.array,
	spreadMode: PropTypes.bool
};

export default PickResult;