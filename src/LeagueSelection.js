import React, { Component } from 'react';
import { Route } from 'react-router-dom'

import Header from './Header';

class LeagueSelection extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className="page-container">
                    <div className="list js-list">
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          onClick={() => { history.push('/leagues/nfl') }}
                                        >
                                        <div className='list-item-text'>NFL</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                onClick={() => { history.push('/leagues/ncaaf') }}
                            >
                            <div className='list-item-text'>NCAAF</div>
                                </div>
                            )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            onClick={() => { history.push('/leagues/rugby') }}
                        >
                        <div className='list-item-text'>RUGBY</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                onClick={() => { history.push('/leagues/affl') }}
                            >
                            <div className='list-item-text'>AFFL</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                          onClick={() => { history.push('/leagues/futbol') }}
                                        >
                                        <div className='list-item-text'>FUTBOL</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#00695C'}}
                            onClick={() => { history.push('/leagues/tennis') }}
                        >
                        <div className='list-item-text'>TENNIS</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#a52a2a'}}
                                          onClick={() => { history.push('/leagues/nba') }}
                                        >
                                        <div className='list-item-text'>NBA</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/wnba') }}
                            >
                            <div className='list-item-text'>WNBA</div>
                            </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/ncaam') }}
                            >
                            <div className='list-item-text'>NCAAM</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/ncaaw') }}
                            >
                            <div className='list-item-text'>NCAAW</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#283593'}}
                                          onClick={() => { history.push('/leagues/mlb') }}
                                        >
                                          <div className='list-item-text'>MLB</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#283593'}}
                                          onClick={() => { history.push('/leagues/npb') }}
                                        >
                                          <div className='list-item-text'>NPB</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#283593'}}
                            onClick={() => { history.push('/leagues/cricket') }}
                        >
                        <div className='list-item-text'>CRICKET</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#283593'}}
                            onClick={() => { history.push('/leagues/llws') }}
                        >
                        <div className='list-item-text'>LLWS</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#556b2f'}}
                                          onClick={() => { history.push('/leagues/boxing') }}
                                        >
                                          <div className='list-item-text'>BOXING</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#556b2f'}}
                            onClick={() => { history.push('/leagues/mma') }}
                        >
                        <div className='list-item-text'>MMA</div>
                            </div>
                        )} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default LeagueSelection;