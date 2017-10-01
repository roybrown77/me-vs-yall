import React from 'react';
import { Route } from 'react-router-dom'

import Header from '../components/Header';
import Footer from '../components/Footer';

function LeagueSelectionPage(props) {
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
                            >
                            <div className='list-item-text'>NCAAF</div>
                                </div>
                            )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                        >
                        <div className='list-item-text'>RUGBY</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
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
                        >
                        <div className='list-item-text'>MMA</div>
                            </div>
                        )} />
                        )}
                    </div>
                </div>
                <Footer/>
            </div>
        );
}

export default LeagueSelectionPage;