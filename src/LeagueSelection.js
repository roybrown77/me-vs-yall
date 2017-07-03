import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'

class LeagueSelection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="list js-list">
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  onClick={() => { history.push('/league/nfl') }}
                                >
                                <div className='list__item___text'>NFL</div>
                                </div>
                              )} />
                )}
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  style={{backgroundColor: '#f0ad4e'}}
                                  onClick={() => { history.push('/league/futbol') }}
                                >
                                <div className='list__item___text'>FUTBOL</div>
                                </div>
                              )} />
                )}
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  style={{backgroundColor: '#a52a2a'}}
                                  onClick={() => { history.push('/league/nba') }}
                                >
                                <div className='list__item___text'>NBA</div>
                                </div>
                              )} />
                )}
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  style={{backgroundColor: '#283593'}}
                                  onClick={() => { history.push('/league/mlb') }}
                                >
                                  <div className='list__item___text'>MLB</div>
                                </div>
                              )} />
                )}
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  style={{backgroundColor: '#00695C'}}
                                  onClick={() => { history.push('/league/tennis') }}
                                >
                                  <div className='list__item___text'>TENNIS</div>
                                </div>
                              )} />
                )}
                {(
                    <Route render={({ history }) => (
                                <div
                                  className='list__item'
                                  style={{backgroundColor: '#556b2f'}}
                                  onClick={() => { history.push('/league/mma') }}
                                >
                                  <div className='list__item___text'>MMA</div>
                                </div>
                              )} />
                )}
            </div>
        );
    }
}

export default LeagueSelection;