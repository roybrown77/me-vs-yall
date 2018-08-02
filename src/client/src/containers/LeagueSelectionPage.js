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
                                          style={{backgroundColor: '#a52a2a'}}
                                          onClick={() => { history.push('/scoreboards/nfl') }}
                                        >
                                        <div className='list-item-text'>NFL</div>
                                        </div>
                                      )} />
                        )}
                        {/*{(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                style={{backgroundColor: '#a52a2a'}}
                            >
                            <div className='list-item-text'>NCAA Football</div>
                                </div>
                            )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                        >
                                        <div className='list-item-text'>UEFA Champions League</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                        >
                                        <div className='list-item-text'>FIFA Conf Cup</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                          onClick={() => { history.push('/scoreboards/fifaworldcup') }}
                                        >
                                        <div className='list-item-text'>Fifa World Cup</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                        >
                                        <div className='list-item-text'>English Premier League</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#f0ad4e'}}
                                        >
                                        <div className='list-item-text'>Major League Soccer</div>
                                        </div>
                                      )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#00695C'}}
                        >
                        <div className='list-item-text'>Aussie Open</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#00695C'}}
                            onClick={() => { history.push('/scoreboards/frenchopen') }}
                        >
                        <div className='list-item-text'>French Open</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#00695C'}}
                        >
                        <div className='list-item-text'>US Open</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#00695C'}}
                        >
                        <div className='list-item-text'>Wimbledon</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#a52a2a'}}
                                        >
                                        <div className='list-item-text'>NBA Playoffs</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                            <div
                                className='list-item'
                                style={{backgroundColor: '#a52a2a'}}
                            >
                            <div className='list-item-text'>NCAAM March Madness</div>
                                </div>
                            )} />
                        )}*/}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#283593'}}
                                          onClick={() => { history.push('/scoreboards/mlbplayoffs') }}
                                        >
                                          <div className='list-item-text'>MLB Playoffs</div>
                                        </div>
                                      )} />
                        )}
                        {/*{(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#283593'}}
                        >
                        <div className='list-item-text'>Mens College World Series</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#283593'}}
                        >
                        <div className='list-item-text'>Womens College World Series</div>
                            </div>
                        )} />
                        )}
                        {(
                        <Route render={({ history }) => (
                        <div
                            className='list-item'
                            style={{backgroundColor: '#283593'}}
                        >
                        <div className='list-item-text'>Little League World Series</div>
                            </div>
                        )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#000000'}}
                                        >
                                          <div className='list-item-text'>NHL Stanley Cup Playoffs</div>
                                        </div>
                                      )} />
                        )}
                        {(
                            <Route render={({ history }) => (
                                        <div
                                          className='list-item'
                                          style={{backgroundColor: '#556b2f'}}
                                        >
                                          <div className='list-item-text'>Boxing</div>
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
                        )}*/}
                    </div>
                </div>
                <Footer/>
            </div>
        );
}

export default LeagueSelectionPage;