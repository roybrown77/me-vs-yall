import React, { Component } from 'react';
import update from 'react-addons-update';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './Header';
import Footer from './Footer';
import api from './middleware/api.js';
import { login, isLoggedIn } from './middleware/AuthService';

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
                    weekNo: 1,
                    weekNumberDisplay: "",
                    namePrefix: "Hall of Fame Game",
                    endDateTime: "2017-08-04T02:00:00+04:00",
                    beginDateTime: "2017-08-03T05:00:00+04:00"
                },
                {
                    weekNo: 2,
                    weekNumberDisplay: 1,
                    namePrefix: "Pre Week",
                    endDateTime: "2017-08-14T02:00:00+04:00",
                    beginDateTime: "2017-08-09T05:00:00+04:00"
                },
                {
                    weekNo: 3,
                    weekNumberDisplay: 2,
                    namePrefix: "Pre Week",
                    endDateTime: "2017-08-22T02:00:00+04:00",
                    beginDateTime: "2017-08-17T05:00:00+04:00"
                },
                {
                    weekNo: 4,
                    weekNumberDisplay: 3,
                    namePrefix: "Pre Week",
                    endDateTime: "2017-08-28T02:00:00+04:00",
                    beginDateTime: "2017-08-24T05:00:00+04:00"
                },
                {
                    weekNo: 5,
                    weekNumberDisplay: 4,
                    namePrefix: "Pre Week",
                    endDateTime: "2017-09-01T02:00:00+04:00",
                    beginDateTime: "2017-08-31T05:00:00+04:00"
                },
                {
                    weekNo: 6,
                    weekNumberDisplay: 1,
                    namePrefix: "Week",
                    endDateTime: "2017-09-12T02:00:00+04:00",
                    beginDateTime: "2017-09-07T05:00:00+04:00"
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
            dataLoading: true,
            selectionInProgress: false,
            value1: 1, 
            value2: 1, 
            leagueName: "NFL",
            selectedWeek: 0,
            weeks: [],
            games: [], 
            picks: []
        };
    }

    componentWillMount() {
        if (!isLoggedIn()) {
            login();
            return;
        }

        if (leagues.find(x=>x === this.props.match.params.name.toUpperCase)) {
            history.push('/leagues/' + this.props.match.params.name.toLowerCase);
                this.setState({
                leagueName: this.props.match.params.name.toUpperCase 
            });
        } else {
            history.push('/leagues/nfl');
        }   

        weeks.map((week)=>{
            const startDateTime = moment.utc(week.beginDateTime).format('ddd M/D');
            const endDateTime = moment.utc(week.endDateTime).format('ddd M/D');

            if (startDateTime !== endDateTime) {
                week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D') + " - " + moment.utc(week.endDateTime).format('ddd M/D');
            } else {
                week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D');
            }

            return week;
        });

        this.setState({
            weeks: weeks
        });

        const currentWeek = weeks.length-1;

        this.setState({
            selectedWeek: currentWeek
        });

        this.getGamesAndPicks(weeks[currentWeek]);
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});

    selectWeek = (event, index) => {
        this.getGamesAndPicks(this.state.weeks[index]);
        this.setState({selectedWeek: index});
    };
    
    selectCompetitor (gameId, competitorId, showCheck) {
        const newPickId = !showCheck ? competitorId : null;

        if (newPickId === null) {
            return;
        }

        const game = this.state.games.find(x=>x._id === gameId);

        if (game.isGameOver) {
            return;
        }

        this.setState({selectionInProgress: true});

        const pick = this.state.picks.find(x=>x.gameId === gameId);

        if (pick && newPickId) {
            api.updatePick(pick._id, { gameId:gameId, pickId:newPickId }, response => {
                const pickIndex = this.state.picks.findIndex(x=>x._id === response._id);
                this.setState(update(this.state.picks, { $splice: [[pickIndex, 1, response]] } ));

                this.updatePickInUI(game, competitorId);
            });

            return;
        }

        api.createPick({leagueId:'59723313734d1d6202a85f10', weekNo: game.weekNo, gameId:gameId, pickId:newPickId}, response => {
            this.setState({ picks: [...this.state.picks, response] });

            this.updatePickInUI(game, competitorId);
        });
    }

    getGamesAndPicks(week) {
        const query = {
            leagueId:"59723313734d1d6202a85f10",
            weekNo: week.weekNo
        };

        const getGamesPromise = api.getGames(query);
        
        const getPickPromise = api.getPicks(query);

        Promise.all([getGamesPromise, getPickPromise]).then(data => {
            let games = data[0];
            const picks = data[1];

            games.map((game)=>{
                game.startDateTimeDisplay = moment.utc(game.startDateTime).format('dddd MMM D YYYY h:mm a') + ' ET';
                game.stadiumCity = game.overrideStadiumCity ? game.overrideStadiumCity : teamData.find(x=>x._id === game.competitors[1]._id).stadiumCity;
                game.stadiumName = game.overrideStadiumName ? game.overrideStadiumName : teamData.find(x=>x._id === game.competitors[1]._id).stadiumName;
                game.winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)
                
                return game.competitors.map((competitor, index)=> {
                    const data = teamData.find(x=>x._id === competitor._id);
                    competitor.shortLocation = data.shortLocation;
                    competitor.name = data.name;
                    competitor.color = data.color;
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

    updatePickInUI (game, competitorId) {
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
        
       this.setState({selectionInProgress: false});
    }

    render() {
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
                            <MenuItem value={1} primaryText={this.state.leagueName}/>
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
                            value={this.state.selectedWeek}
                            onChange={this.selectWeek}
                            style={dropDownFull.root}
                            autoWidth={false}
                            >
                            {this.state.weeks.map((week, index) => (
                                <MenuItem key={index} value={index} primaryText={week.displayName}  />
                            ))}
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
                                                        border: competitor.showCheck ? (game.isGameOver ? (game.winner === competitor._id ? '8px solid green' : '8px solid red') : '8px solid #BA68C8') : '0', height: "91%",
                                                        color: competitor.color
                                                    }}>
                                                        <div style={{fontSize:'36px', paddingTop:'10px', block: competitor.score ? 'block' : 'none'}}>
                                                            {competitor.score}
                                                        </div>
                                                        <div style={{paddingTop: competitor.score ? '10px' : '26px'}}>
                                                            {competitor.shortLocation}
                                                        </div>
                                                    </div>
                                                </GridTile>
                                        ))}
                                    </GridList>
                                    <div style={{
                                        width: '100%', 
                                        margin:'12px -2px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: 'gray'
                                    }}>
                                        <div style={{float: 'left', marginRight:'24px'}}>{game.startDateTimeDisplay}</div>
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