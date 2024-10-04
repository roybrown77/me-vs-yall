const authenticationClientId = process.env.REACT_APP_AUTHENTICATION_CLIENT_ID;
const watchLiveGames = process.env.REACT_APP_WATCH_LIVE_GAMES === 'true';
const apiUrl = process.env.REACT_APP_API_URL;

export {
	authenticationClientId,
	watchLiveGames,
	apiUrl,
};