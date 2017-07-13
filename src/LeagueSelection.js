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
                                          className='list__item'
                                          onClick={() => { history.push('/leagues/nfl') }}
                                        >
                                        <div className='list__item__text'>NFL</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list__item'
                                onClick={() => { history.push('/leagues/ncaaf') }}
                            >
                            <div className='list__item__text'>NCAAF</div>
                                </div>
                            )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list__item'
                            onClick={() => { history.push('/leagues/rugby') }}
                        >
                        <div className='list__item__text'>RUGBY</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list__item'
                                onClick={() => { history.push('/leagues/affl') }}
                            >
                            <div className='list__item__text'>AFFL</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list__item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                          onClick={() => { history.push('/leagues/futbol') }}
                                        >
                                        <div className='list__item__text'>FUTBOL</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list__item'
                            style={{backgroundColor: '#00695C'}}
                            onClick={() => { history.push('/leagues/tennis') }}
                        >
                        <div className='list__item__text'>TENNIS</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list__item'
                                          style={{backgroundColor: '#a52a2a'}}
                                          onClick={() => { history.push('/leagues/nba') }}
                                        >
                                        <div className='list__item__text'>NBA</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list__item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/wnba') }}
                            >
                            <div className='list__item__text'>WNBA</div>
                            </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list__item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/ncaam') }}
                            >
                            <div className='list__item__text'>NCAAM</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list__item'
                                style={{backgroundColor: '#a52a2a'}}
                                onClick={() => { history.push('/leagues/ncaaw') }}
                            >
                            <div className='list__item__text'>NCAAW</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list__item'
                                          style={{backgroundColor: '#283593'}}
                                          onClick={() => { history.push('/leagues/mlb') }}
                                        >
                                          <div className='list__item__text'>MLB</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list__item'
                                          style={{backgroundColor: '#283593'}}
                                          onClick={() => { history.push('/leagues/npb') }}
                                        >
                                          <div className='list__item__text'>NPB</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list__item'
                            style={{backgroundColor: '#283593'}}
                            onClick={() => { history.push('/leagues/cricket') }}
                        >
                        <div className='list__item__text'>CRICKET</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list__item'
                            style={{backgroundColor: '#283593'}}
                            onClick={() => { history.push('/leagues/llws') }}
                        >
                        <div className='list__item__text'>LLWS</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list__item'
                                          style={{backgroundColor: '#556b2f'}}
                                          onClick={() => { history.push('/leagues/boxing') }}
                                        >
                                          <div className='list__item__text'>BOXING</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list__item'
                            style={{backgroundColor: '#556b2f'}}
                            onClick={() => { history.push('/leagues/mma') }}
                        >
                        <div className='list__item__text'>MMA</div>
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