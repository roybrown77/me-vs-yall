import React, { Component } from 'react';

import Header from './Header';

class About extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{marginTop: '1em'}}>
                    Me pick winners of sporting events and compete with yall.
                </div>
            </div>
        );
    }
}

export default About;