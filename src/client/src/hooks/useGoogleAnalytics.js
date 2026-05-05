import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { measurementId } from '../config';

const useGoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        if (!measurementId) {
            console.warn('Google Analytics Measurement ID is missing.');
            return;
        }

        // Initialize Google Analytics only once
        ReactGA.initialize(measurementId);

        // Track initial page load
        ReactGA.send({ hitType: 'pageview', page: location.pathname });

        // Track page views on route changes
        return () => {
            ReactGA.send({ hitType: 'pageview', page: location.pathname });
        };
    }, [measurementId, location]);
};

export default useGoogleAnalytics;
