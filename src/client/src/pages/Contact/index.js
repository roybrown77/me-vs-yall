import { useEffect } from 'react';
import ReactGA from 'react-ga';

import PageContainer from '../../components/PageContainer';

const line1 = `info@mevsyall.com`;

const Contact = () => {
    useEffect(() => {
        ReactGA.ga('send', 'pageview', '/contact');
        window.scrollTo(0, 0);
    },[]);

    return (
        <PageContainer>
            <div style={{padding: '12px'}}>{line1}</div>
        </PageContainer>
    );
};

export default Contact;
