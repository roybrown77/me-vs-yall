const authenticationClientId = import.meta.env.REACT_APP_AUTHENTICATION_CLIENT_ID;
const watchLiveGames = import.meta.env.REACT_APP_WATCH_LIVE_GAMES === 'true';
const apiUrl = import.meta.env.REACT_APP_API_URL;
const measurementId = import.meta.env.REACT_APP_MEASUREMENT_ID;

export {
	authenticationClientId,
	watchLiveGames,
	apiUrl,
	measurementId,
};