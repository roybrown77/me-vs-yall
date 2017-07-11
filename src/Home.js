import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// <iframe width="100%" height="50%" src={"https://www.youtube.com/embed/vnfulwtcwKQ?rel=0&version=3&autoplay=1&loop=1&controls=0&&showinfo=0playlist=vnfulwtcwKQ"} allowFullScreen="">
//     </iframe>

class Home extends Component {
    render() {
        return (
            <div id="home" className="fade-in">

                <div id="home-title">Me vs Yall</div>
                <div id="home-description">Pick winners of sporting events and compete with others around the world.</div>
                {(
                    <Route render={({ history }) => (
                                <div
                                  id='home-go'
                                  className='flash'
                                  onClick={() => { history.push('/league') }}
                                >
                                    <div>-></div>
                                </div>
                              )} />
                )}
            </div>
        );
    }
}

export default Home;