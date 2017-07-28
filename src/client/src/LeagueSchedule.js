import React, { Component } from 'react';
import update from 'react-addons-update';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './Header';
import Footer from './Footer';
import api from './middleware/api.js';

import Chiefs from './images/kansas-city-chiefs.png';
import Patriots from './images/new-england-patriots.png';
import Falcons from './images/atlanta-falcons.png';
import Bears from './images/chicago-bears.png';

const dropDown = {
    root: {
        width: '50%'
    }
};

const dropDownFull = {
    root: {
        width: '100%',
        marginBottom: '16px'
    }
};

const grid = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: '12px'
    },
    list: {
        width: '100%',
        marginBottom: '12px',
        backgroundColor: '#fff'
    },
    tile: {
        width: '100%',
        cursor: 'pointer'
    },
    titleStyle: {
        font:'1.4rem/1 Permanent Marker,sans-serif', 
        color: '#000'
    },
    titleBackground: 'transparent'
};

const filterButton = {
  button: {
    margin: 0,
    width: '100%'
  }
};

const staticData = [
    {
        id: 'Kansas City Chiefs',
        img: Chiefs,
        shortName: "KC Chiefs"
    },
    {
        id: 'New England Patriots',
        img: Patriots,
        shortName: "NE Patriots"
    },
    {
        id: 'Atlanta Falcons',
        img: Falcons,
        shortName: "ATL Falcons"
    },
    {
        id: 'Chicago Bears',
        img: Bears,
        shortName: "CHI Bears"
    }
];

//         startDateTime: "Thursday Sep 7 2017 8:30 pm ET",
//         station: "NBC",
//         stadiumName: "Gillette Stadium",

class LeagueSchedule extends Component {
    constructor(props) {
        super(props);
        
        this.state = {value1: 1, value2: 1, value3: 1, winnerSelected: false, selectionInProgress: false, games: [], picks: []};

        let getGamesPromise = api.getGames({leagueId:"59723313734d1d6202a85f10",startDatetime:"2017-09-07T00:30:00+04:00",endDateTime:"2017-09-12T00:30:00+04:00"});

        let getPickPromsise = api.getPicks({userId:"59723313734d1d6202a85f10", leagueId:"59723313734d1d6202a85f10",startDatetime:"2017-09-07T00:30:00+04:00",endDateTime:"2017-09-12T00:30:00+04:00"});

        Promise.all([getGamesPromise, getPickPromsise]).then(data => { 
            let games = data[0];
            let picks = data[1];

            games.map((game)=>{
                return game.competitors.map((competitor)=>{
                    var data = staticData.find(x=>x.id === competitor.name);
                    competitor.img = data.img;
                    competitor.shortName = data.shortName;
                    competitor.showCheck = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;
                    return competitor;
                });
            });

            this.setState({
                games: games
            });

            this.setState({
                picks: picks
            });
        });
    }

    componentDidMount() {
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

    selectCompetitor (gameId, competitorId, showCheck) {
        let newPickId = !showCheck ? competitorId : null;

        if (newPickId === null) {
            // may not need to delete a pick
            return;
        }

        let pick = this.state.picks.find(x=>x.gameId === gameId);

        if (pick && newPickId) {
            api.updatePick(pick._id, newPickId, response => {
                const pickIndex = this.state.picks.findIndex(x=>x._id === response._id);
                this.setState(update(this.state.picks, { $splice: [[pickIndex, 1, response]] } ));

                let game = this.state.games.find(x=>x._id === gameId);
                let competitorSelected = game.competitors.find(x=>x._id === competitorId);

                if (competitorSelected.showCheck) {
                    competitorSelected.showCheck = false;
                } else {
                    game.competitors.map((competitor) => {
                        if (competitor._id !== competitorId) {
                            competitor.showCheck = false;
                        }

                        return competitor;
                    });

                    competitorSelected.showCheck = true;
                }
            
               this.setState({winnerSelected: true});
            });

            return;
        }

        api.createPick({userId:'59723313734d1d6202a85f10', leagueId:'59723313734d1d6202a85f10', gameId:gameId, pickId:newPickId}, response => {
            this.setState({ picks: [...this.state.picks, response] });

            let game = this.state.games.find(x=>x._id === gameId);
            let competitorSelected = game.competitors.find(x=>x._id === competitorId);

            if (competitorSelected.showCheck) {
                competitorSelected.showCheck = false;
            } else {
                game.competitors.map((competitor) => {
                    if (competitor._id !== competitorId) {
                        competitor.showCheck = false;
                    }

                    return competitor;
                });

                competitorSelected.showCheck = true;
            }
        
           this.setState({winnerSelected: true});
        });
    }

    render() {
        let name = this.props.match.params.name;

        return (
            <div>
                <Header/>
                <div className="page-container">
                    <div style={{marginTop: '12px', backgroundColor: '#fff'}}>
                        <RaisedButton
                          label="Filtration"
                          labelPosition="before"
                          primary={true}
                          icon={<ActionAndroid />}
                          style={filterButton.button}
                        />
                        <DropDownMenu
                            value={this.state.value1}
                            onChange={this.handleChange1}
                            style={dropDown.root}
                            autoWidth={false}
                            >
                            <MenuItem value={1} primaryText={name.toUpperCase()}/>
                        </DropDownMenu>
                        <DropDownMenu
                            value={this.state.value2}
                            onChange={this.handleChange2}
                            style={dropDown.root}
                            autoWidth={false}
                            >
                            <MenuItem value={1} primaryText="2017" />
                        </DropDownMenu>
                        <DropDownMenu
                            value={this.state.value3}
                            onChange={this.handleChange3}
                            style={dropDownFull.root}
                            autoWidth={false}
                            >
                            <MenuItem value={1} primaryText="Week 1 Thursday 9/7 - Monday 9/11" />
                        </DropDownMenu>
                    </div>
                    <div style={{color:'#BA68C8', marginTop: '12px'}}>*tap winners</div>
                        <div style={grid.root}>
                            {this.state.games.map((game, index1) => (
                                <GridList
                                    key={game._id}
                                    style={grid.list}
                                    >
                                    {game.competitors.map((competitor, index2) => (
                                            <GridTile
                                                key={game._id + "." + competitor._id}
                                                style={grid.tile}
                                                title={competitor.shortName}
                                                titleStyle={grid.titleStyle}
                                                titleBackground={grid.titleBackground}
                                                onClick={() => this.selectCompetitor(game._id, competitor._id, competitor.showCheck)}
                                                >
                                                <div style={{border: competitor.showCheck ? '8px solid #BA68C8': '0', height: "91%", }}>
                                                    <div>
                                                        <img className="competitor-image" src={ competitor.img } alt=""/>
                                                    </div>
                                                </div>
                                            </GridTile>
                                    ))}
                                </GridList>
                            ))}
                        </div>
                    </div>
                <Footer/>
            </div>
        );
    }
}

export default LeagueSchedule;