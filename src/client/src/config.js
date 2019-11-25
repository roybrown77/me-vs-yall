const isProduction = process.env.NODE_ENV === 'production';
const googleAnalyticsId = isProduction ? process.env.REACT_APP_GOOGLE_ANALYTICS_ID : process.env.REACT_APP_STAGING_GOOGLE_ANALYTICS_ID;
const authenticationClientId = process.env.REACT_APP_AUTHENTICATION_CLIENT_ID;

export {
	isProduction,
	googleAnalyticsId,
	authenticationClientId
};