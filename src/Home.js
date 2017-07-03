import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div id="home">
                <div id="home-title">Me vs Yall</div>
                {(
                    <Route render={({ history }) => (
                                <div
                                  id='home-go'
                                  onClick={() => { history.push('/league') }}
                                >
                                    <i class="material-icons">-></i>
                                </div>
                              )} />
                )}
            </div>
        );
    }
}

export default Home;