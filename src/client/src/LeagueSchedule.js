import React, { Component } from 'react';
import update from 'react-addons-update';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';

import Header from './Header';
import Footer from './Footer';
import api from './middleware/api.js';
import { login, isLoggedIn, getUserProfile } from './middleware/AuthService';

const filterButton = {
  button: {
    margin: 0,
    width: '100%'
  }
};

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
        backgroundColor: '#fff'
    },
    tile: {
        width: '100%',
        cursor: 'pointer',
        font: '4rem/1 Permanent Marker,sans-serif', 
        color: '#000'
    },
    titleStyle: {
        font:'1.4rem/1 Permanent Marker,sans-serif', 
        color: '#000'
    },
    titleBackground: 'transparent'
};

const leagues = [ "NFL" ];

const weeks = [
                        {
                            _id: 1,
                            weekNo: 1,
                            namePrefix: "Preseason",
                            startDateTime: "2017-08-04T00:00:00+04:00",
                            endDateTime: "2017-08-05T00:00:00+04:00"
                        },
                        {
                            _id: 2,
                            weekNo: 2,
                            namePrefix: "Preseason",
                            startDateTime: "2017-08-09T00:00:00+04:00",
                            endDateTime: "2017-08-16T00:00:00+04:00"
                        }
                    ];

const calendar = [
    {
        _id: "nfl",
        years: [
            {
                _id: "2017",
                preseason: {
                    weeks: [
                        {
                            weekNo: 1,
                            startDateTime: "",
                            endDateTime: "",
                            games: [
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                },
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                season: {
                    weeks: [
                        {
                            weekNo: 1,
                            startDateTime: "",
                            endDateTime: "",
                            games: [
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                },
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            weekNo: 2,
                            startDateTime: "",
                            endDateTime: "",
                            games: [
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                },
                                {
                                    startDateTime: "",
                                    competitors: [
                                        {
                                            _id: ""
                                        },
                                        {
                                            _id: ""
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                }    
            }
        ]    
    }
];

const teamData = [
    {
        _id: "59823783734d1d04a1b39d00",
        location: 'Kansas City',
        shortLocation: "KC",
        name: "Chiefs",
        color: "#CA2430",
        stadiumName: "Arrow Head Stadium",
        stadiumCity: "Kansas City, MO"
    },
    {
        _id: "59823783734d1d04a1b39d01",
        location: 'New England',
        shortLocation: "NE",
        name: "Patriots",
        color: "#0A2342",
        stadiumName: "Gillette Stadium",
        stadiumCity: "Foxboro, MA"
    },
    {
        _id: "59823783734d1d04a1b39000",
        location: 'Atlanta Falcons',
        shortLocation: "ATL",
        name: "Falcons",
        color: "#A71930",
        stadiumName: "Mercedes-Benz Stadium",
        stadiumCity: "Atlanta, GA"
    },
    {
        _id: "59823783734d1d04a1b39001",
        location: 'Chicago',
        shortLocation: "CHI",
        name: "Bears",
        color: "#00143F",
        stadiumName: "Soldier Field",
        stadiumCity: "Chicago, IL"
    },
    {
        _id: "59823783734d1d04a1b39100",
        location: 'Arizona',
        shortLocation: "ARI",
        name: "Cardinals",
        color: "#97233F"
    },
    {
        _id: "59823783734d1d04a1b39101",
        location: 'Dallas',
        shortLocation: "DAL",
        name: "Cowboys",
        color: "#0C264C",
        stadiumCity: "Dallas, TX"
    }
];

class LeagueSchedule extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value1: 1, 
            value2: 1, 
            value3: 1, 
            leagueName: "NFL",
            winnerSelected: false, 
            selectionInProgress: false, 
            games: [], 
            picks: [], 
            userProfile: undefined
        };

        if (!isLoggedIn()) {
            login();
            return;
        }

        var currentWeek = weeks[0];
        var last = 0;

        weeks.forEach(function(x, index) {
            var weekEndDateTime = moment.utc(new Date(x.endDateTime)).format("YYYY-MM-DD HH:mm:ss");
            var currentDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            var diff = moment(weekEndDateTime).diff(currentDateTime, 'minutes');

            if ((diff < last && diff >= 15) || index === 0) {
                last = diff;
                currentWeek = x;
            }
        })

        let getGamesPromise = api.getGames({
            leagueId:"59723313734d1d6202a85f10",
            startDatetime:"2017-09-07T00:30:00+04:00",
            endDateTime:"2017-09-12T00:30:00+04:00"
        });
        
        let getPickPromise = api.getPicks({
            leagueId:"59723313734d1d6202a85f10",
            startDatetime:"2017-09-07T00:30:00+04:00",
            endDateTime:"2017-09-12T00:30:00+04:00"
        });

        Promise.all([getGamesPromise, getPickPromise]).then(data => { 
            let games = data[0];
            let picks = data[1];

            games.map((game)=>{
                game.startDateTime = moment.utc(game.startDateTime).format('dddd MMM D YYYY h:mm a') + ' ET';
                game.stadiumCity = game.overrideStadiumCity ? game.overrideStadiumCity : teamData.find(x=>x._id === game.competitors[1]._id).stadiumCity;
                game.stadiumName = game.overrideStadiumName ? game.overrideStadiumName : teamData.find(x=>x._id === game.competitors[1]._id).stadiumName;

                return game.competitors.map((competitor, index)=>{
                    var data = teamData.find(x=>x._id === competitor._id);
                    competitor.shortLocation = data.shortLocation;
                    competitor.name = data.name;
                    competitor.color = data.color;
                    competitor.showCheck = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;    
                    return competitor;
                });
            });

            const leagueName = props.match.params.name;

            if (leagues.find(x=>x === props.match.params.name.toUpperCase)) {
                history.push('/leagues/' + props.match.params.name.toLowerCase);
                this.setState({
                    leagueName: props.match.params.name.toUpperCase 
                });
            } else {
                history.push('/leagues/nfl');
            }   

            this.setState({
                games: games
            });

            this.setState({
                picks: picks
            });

            // get singleton userprofile and store in session in auth0
            //const { userProfile, getProfile } = this.props.auth;
            if (!this.state.userProfile) {
                getUserProfile((err, profile) => {
                    this.setState({ userProfile: profile });
                });
            }
        });
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});
    
    selectCompetitor (gameId, competitorId, showCheck) {
        let newPickId = !showCheck ? competitorId : null;

        if (newPickId === null) {
            return;
        }

        let pick = this.state.picks.find(x=>x.gameId === gameId);

        if (pick && newPickId) {
            api.updatePick(pick._id, { gameId:gameId, pickId:newPickId }, response => {
                const pickIndex = this.state.picks.findIndex(x=>x._id === response._id);
                this.setState(update(this.state.picks, { $splice: [[pickIndex, 1, response]] } ));

                this.updatePickInUI(gameId, competitorId);
            });

            return;
        }

        api.createPick({leagueId:'59723313734d1d6202a85f10', gameId:gameId, pickId:newPickId}, response => {
            this.setState({ picks: [...this.state.picks, response] });

            this.updatePickInUI(gameId, competitorId);
        });
    }

    updatePickInUI (gameId, competitorId) {
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
    }

    render() {
        const profile = this.state.userProfile;

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
                            <MenuItem value={1} primaryText={this.state.leagueName.toUpperCase()}/>
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
                                <div
                                    key={game._id}
                                    style={{width:'100%', marginBottom: '12px'}}>
                                    <GridList
                                        key={game._id + "-gridlist"}
                                        style={grid.list}
                                        >
                                        {game.competitors.map((competitor, index2) => (
                                                <GridTile
                                                    key={game._id + "." + competitor._id}
                                                    style={grid.tile}
                                                    title={competitor.name}
                                                    titleStyle={grid.titleStyle}
                                                    titleBackground={grid.titleBackground}
                                                    onClick={() => this.selectCompetitor(game._id, competitor._id, competitor.showCheck)}
                                                    >
                                                    <div 
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: competitor.showCheck ? '8px solid #BA68C8' : '0', height: "91%",
                                                        color: competitor.color
                                                    }}>
                                                        {competitor.shortLocation}
                                                    </div>
                                                </GridTile>
                                        ))}
                                    </GridList>
                                    <div style={{
                                        width: '100%', 
                                        backgroundColor: '#fff', 
                                        margin:'12px -2px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: 'gray'
                                    }}>
                                        <div style={{float: 'left', marginRight:'24px'}}>{game.startDateTime}</div>
                                        <div style={{float: 'left', marginRight:'24px'}}>{game.station}</div>
                                        <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumName}</div>
                                        <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumCity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                <Footer/>
            </div>
        );
    }
}

export default LeagueSchedule;