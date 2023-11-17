const isProduction = process.env.NODE_ENV === 'production';
const authenticationClientId = process.env.REACT_APP_AUTHENTICATION_CLIENT_ID;
const displayHomePageImages = process.env.REACT_APP_DISPLAY_HOME_PAGE_IMAGES === 'true';
const watchLiveGames = process.env.REACT_APP_WATCH_LIVE_GAMES === 'true';

export {
	isProduction,
	authenticationClientId,
	displayHomePageImages,
	watchLiveGames
};