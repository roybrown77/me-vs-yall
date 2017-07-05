import React, { Component } from 'react';

import Header from './Header';

class About extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{marginTop: '1em'}}>
                    Pick winners of sporting events and compete with others around the world.
                </div>
            </div>
        );
    }
}

export default About;