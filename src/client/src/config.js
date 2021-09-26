import get from 'lodash/get';

const isProduction = process.env.NODE_ENV === 'production';
const googleAnalyticsId = isProduction ? process.env.REACT_APP_GOOGLE_ANALYTICS_ID : process.env.REACT_APP_STAGING_GOOGLE_ANALYTICS_ID;
const authenticationClientId = process.env.REACT_APP_AUTHENTICATION_CLIENT_ID;
const displayHomePageImages = process.env.REACT_APP_DISPLAY_HOME_PAGE_IMAGES === 'true';
const watchLiveGames = process.env.REACT_APP_WATCH_LIVE_GAMES === 'true';

const userJson = localStorage.getItem('user');
const user = JSON.parse(userJson);
const userId = get(user, 'sub');

const isAuthenticated = !!userId;

export {
	isProduction,
	googleAnalyticsId,
	authenticationClientId,
	displayHomePageImages,
	watchLiveGames,
	isAuthenticated
};