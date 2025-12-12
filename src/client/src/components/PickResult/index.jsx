import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import Button from "@mui/material/Button";

import { getResults, areAnyGamesOver } from '../../utilities';

// Liquid glass style inspired by Apple's glassmorphism
const glassStyle = {
	background: 'rgba(255, 255, 255, 0.15)',
	border: '10px solid rgba(255, 255, 255, 0.3)',
	borderRadius: '10px',
	color: '#222',
	fontSize: '3rem',
	fontWeight: 700,
	margin: 0,
	padding: '1.5rem 2.5rem',
	width: '7rem',
	boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
	backdropFilter: 'blur(12px) saturate(180%)',
	WebkitBackdropFilter: 'blur(12px) saturate(180%)',
	display: 'block',
	transition: 'background 0.3s, box-shadow 0.3s',
	outline: 'none',
	borderColor: 'rgba(255,255,255,0.3)',
	'&:hover': {
		background: 'rgba(255,255,255,0.25)',
		color: '#3772FA',
		boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
	},
};

const PickResult = ({loading = false, games, picks, spreadMode = false}) => {
	const gamesOver = areAnyGamesOver(games);
	const results = getResults(games, picks, spreadMode);

	if (loading) {
		return (
			<div>
				<div style={{margin: '0 15% 10px 15%'}}>
					<Skeleton animation="pulse" height='30px' variant="rect"/>
				</div>
			</div>
		);
	}

	return (gamesOver &&
		<div style={{
			display: 'flex',
			margin: '1.25rem',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '2.5rem',
			background: 'linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(55,114,250,0.18) 100%)',
			borderRadius: '10px',
			padding: '2.5rem 2.5rem',
			boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.25), 0 1.5px 8px 0 rgba(55,114,250,0.10)',
			backdropFilter: 'blur(24px) saturate(200%)',
			WebkitBackdropFilter: 'blur(24px) saturate(200%)',
			border: '10px solid rgba(255,255,255,0.35)',
			overflow: 'hidden',
			position: 'relative',
		}}>
			{/* Decorative glassy highlight */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '60%',
				background: 'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 100%)',
				borderRadius: '2.5rem 2.5rem 50% 50%/2.5rem 2.5rem 40% 40%',
				pointerEvents: 'none',
				filter: 'blur(2px)',
				opacity: 0.7,
			}} />
			<Button
				variant="contained"
				disableElevation
				sx={{
					...glassStyle,
					background: 'rgba(255,255,255,0.22)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(55,114,250,0.10)',
					position: 'relative',
					overflow: 'hidden',
					'&:before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '50%',
						background: 'linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.10) 100%)',
						borderRadius: '10px 10px 40% 40%',
						opacity: 0.5,
						pointerEvents: 'none',
					}
				}}
			>
				<div style={{ justifyContent: 'center', display: 'flex' }}>{`${results['wins']}`}</div>
				<div style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.7, justifyContent: 'center', display: 'flex' }}>Wins</div>
			</Button>
			<Button
				variant="contained"
				disableElevation
				sx={{
					...glassStyle,
					background: 'rgba(255,255,255,0.22)',
					boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(55,114,250,0.10)',
					position: 'relative',
					overflow: 'hidden',
					'&:before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '50%',
						background: 'linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.10) 100%)',
						borderRadius: '10px 10px 40% 40%',
						opacity: 0.5,
						pointerEvents: 'none',
					}
				}}
			>
				<div style={{ justifyContent: 'center', display: 'flex' }}>{`${results['losses']}`}</div>
				<div style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.7, justifyContent: 'center', display: 'flex' }}>Losses</div>
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
