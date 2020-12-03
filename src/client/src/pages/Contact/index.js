import React, { Component } from 'react';
import ReactGA from 'react-ga';

import PageContainer from '../PageContainer';

const line1 = `info@mevsyall.com`;

class Contact extends Component {
    componentDidMount() {
      ReactGA.ga('send', 'pageview', '/contact');
      window.scrollTo(0, 0);
    }

    render() {
        return (
            <PageContainer>
                <div style={{padding: '12px'}}>{line1}</div>
            </PageContainer>
        );
    }
}

export default Contact;
