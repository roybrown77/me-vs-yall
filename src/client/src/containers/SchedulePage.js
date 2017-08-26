import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import api from '../middleware/api.js';

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
            marginTop: '12px'
        },
        list: {
            width: '100%',
            backgroundColor: '#fff',
            margin: '0 !important'
        },
        tile: {
            width: '100%',
            cursor: 'pointer',
            font: '4rem/1 Permanent Marker,sans-serif', 
            color: '#000'
        },
        subTitleStyle: {
            margin: '0'
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
                    // {
                    //     weekNo: 3,
                    //     weekNumberDisplay: 2,
                    //     namePrefix: "Pre Week",
                    //     endDateTime: "2017-08-22T02:00:00+04:00",
                    //     beginDateTime: "2017-08-17T05:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 4,
                    //     weekNumberDisplay: 3,
                    //     namePrefix: "Pre Week",
                    //     endDateTime: "2017-08-28T02:00:00+04:00",
                    //     beginDateTime: "2017-08-24T05:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 5,
                    //     weekNumberDisplay: 4,
                    //     namePrefix: "Pre Week",
                    //     endDateTime: "2017-09-01T02:00:00+04:00",
                    //     beginDateTime: "2017-08-31T05:00:00+04:00"
                    // },
                    // {
                    //     weekNo: 6,
                    //     weekNumberDisplay: 1,
                    //     namePrefix: "Week",
                    //     endDateTime: "2017-09-12T02:00:00+04:00",
                    //     beginDateTime: "2017-09-07T05:00:00+04:00"
                    // }
                  ];

    const teamData = [
        {
            _id: "19823783734d1d04a1b39001",
            location: 'Kansas City',
            shortLocation: "KC",
            name: "Chiefs",
            color: "#CA2430",
            stadiumName: "Arrowhead Stadium",
            stadiumCity: "Kansas City, MO"
        },
        {
            _id: "19823783734d1d04a1b39002",
            location: 'New England',
            shortLocation: "NE",
            name: "Patriots",
            color: "#0A2342",
            stadiumName: "Gillette Stadium",
            stadiumCity: "Foxboro, MA"
        },
        {
            _id: "19823783734d1d04a1b39003",
            location: 'Atlanta',
            shortLocation: "ATL",
            name: "Falcons",
            color: "#A71930",
            stadiumName: "Mercedes-Benz Stadium",
            stadiumCity: "Atlanta, GA"
        },
        {
            _id: "19823783734d1d04a1b39004",
            location: 'Chicago',
            shortLocation: "CHI",
            name: "Bears",
            color: "#00143F",
            stadiumName: "Soldier Field",
            stadiumCity: "Chicago, IL"
        },
        {
            _id: "19823783734d1d04a1b39005",
            location: 'Arizona',
            shortLocation: "ARI",
            name: "Cardinals",
            color: "#97233F",
            stadiumName: "University of Phoenix Stadium",
            stadiumCity: "Glendale, AZ"
        },
        {
            _id: "19823783734d1d04a1b39006",
            location: 'Dallas',
            shortLocation: "DAL",
            name: "Cowboys",
            color: "#0C264C",
            stadiumName: "AT&T Stadium",
            stadiumCity: "Dallas, TX"
        },
        {
            _id: "19823783734d1d04a1b39007",
            location: 'Houston',
            shortLocation: "HOU",
            name: "Texans",
            color: "#00143F",
            stadiumName: "NRG Stadium",
            stadiumCity: "Houston, TX"
        },
        {
            _id: "19823783734d1d04a1b39008",
            location: 'Carolina',
            shortLocation: "CAR",
            name: "Panthers",
            color: "#0085CA",
            stadiumName: "Bank of America Stadium",
            stadiumCity: "Charlotte, NC"
        },
        {
            _id: "19823783734d1d04a1b39009",
            location: 'Miami',
            shortLocation: "MIA",
            name: "Dolphins",
            color: "#0091A0",
            stadiumName: "Hard Rock Stadium",
            stadiumCity: "Miami, FL"
        },
        {
            _id: "19823783734d1d04a1b3900a",
            location: 'Minnesota',
            shortLocation: "MIN",
            name: "Vikings",
            color: "#4F2E84",
            stadiumName: "U.S. Bank Stadium",
            stadiumCity: "Minneapolis, MN"
        },
        {
            _id: "19823783734d1d04a1b3900b",
            location: 'Buffalo',
            shortLocation: "BUF",
            name: "Bills",
            color: "#00338D",
            stadiumName: "New Era Field",
            stadiumCity: "Buffalo, NY"
        },
        {
            _id: "19823783734d1d04a1b3900c",
            location: 'Washington',
            shortLocation: "WAS",
            name: "Redskins",
            color: "#7C1415",
            stadiumName: "FedExField",
            stadiumCity: "Landover, MD"
        },
        {
            _id: "19823783734d1d04a1b3900d",
            location: 'Baltimore',
            shortLocation: "BAL",
            name: "Ravens",
            color: "#241773",
            stadiumName: "M&T Bank Stadium",
            stadiumCity: "Baltimore, MD"
        },
        {
            _id: "19823783734d1d04a1b3900e",
            location: 'Jacksonville',
            shortLocation: "JAC",
            name: "Jaguars",
            color: "#136677",
            stadiumName: "EverBank Field",
            stadiumCity: "Jacksonville, FL"
        },
        {
            _id: "19823783734d1d04a1b3900f",
            location: 'New Orleans',
            shortLocation: "NO",
            name: "Saints",
            color: "#A08A58",
            stadiumName: "Mercedes-Benz Superdome",
            stadiumCity: "New Orleans, LA"
        },
        {
            _id: "19823783734d1d04a1b39010",
            location: 'Cleveland',
            shortLocation: "CLE",
            name: "Browns",
            color: "#FB4F14",
            stadiumName: "FirstEnergy Stadium",
            stadiumCity: "Cleveland, OH"
        },
        {
            _id: "19823783734d1d04a1b39011",
            location: 'Philadelphia',
            shortLocation: "PHI",
            name: "Eagles",
            color: "#014A53",
            stadiumName: "Lincoln Financial Field",
            stadiumCity: "Philadelphia, PA"
        },
        {
            _id: "19823783734d1d04a1b39012",
            location: 'Green Bay',
            shortLocation: "GB",
            name: "Packers",
            color: "#24423c",
            stadiumName: "Lambeau Field",
            stadiumCity: "Green Bay, WI"
        },
        {
            _id: "19823783734d1d04a1b39013",
            location: 'Denver',
            shortLocation: "DEN",
            name: "Broncos",
            color: "#FB4F14",
            stadiumName: "Sports Authority Field",
            stadiumCity: "Denver, CO"
        },
        {
            _id: "19823783734d1d04a1b39014",
            location: 'Pittsburgh',
            shortLocation: "PIT",
            name: "Steelers",
            color: "#FFC20E",
            stadiumName: "Heinz Field",
            stadiumCity: "Pittsburgh, PA"
        },
        {
            _id: "19823783734d1d04a1b39015",
            location: 'New York',
            shortLocation: "NY",
            name: "Giants",
            color: "#192E6C",
            stadiumName: "MetLife Stadium",
            stadiumCity: "East Rutherford, NJ"
        },
        {
            _id: "19823783734d1d04a1b39016",
            location: 'Tampa Bay',
            shortLocation: "TB",
            name: "Buccaneers",
            color: "#D40909",
            stadiumName: "Raymond James Stadium",
            stadiumCity: "Tampa, FL"
        },
        {
            _id: "19823783734d1d04a1b39017",
            location: 'Cincinnati',
            shortLocation: "CIN",
            name: "Bengals",
            color: "#FB4F14",
            stadiumName: "Paul Brown Stadium",
            stadiumCity: "Cincinnati, OH"
        },
        {
            _id: "19823783734d1d04a1b39018",
            location: 'San Francisco',
            shortLocation: "SF",
            name: "49ers",
            color: "#C9243F",
            stadiumName: "Levi's Stadium",
            stadiumCity: "Santa Clara, CA"
        },
        {
            _id: "19823783734d1d04a1b39019",
            location: 'Tennessee',
            shortLocation: "TEN",
            name: "Titans",
            color: "#4095D1",
            stadiumName: "Nissan Stadium",
            stadiumCity: "Nashville, TN"
        },
        {
            _id: "19823783734d1d04a1b3901a",
            location: 'New York',
            shortLocation: "NY",
            name: "Jets",
            color: "#203731",
            stadiumName: "MetLife Stadium",
            stadiumCity: "East Rutherford, NJ"
        },
        {
            _id: "19823783734d1d04a1b3901b",
            location: 'Los Angeles',
            shortLocation: "LA",
            name: "Rams",
            color: "#95774C",
            stadiumName: "Los Angeles Stadium",
            stadiumCity: "Inglewood, CA"
        },
        {
            _id: "19823783734d1d04a1b3901c",
            location: 'Oakland',
            shortLocation: "OAK",
            name: "Raiders",
            color: "#C4C9CC",
            stadiumName: "Oakland Alameda Coliseum",
            stadiumCity: "Oakland, CA"
        },
        {
            _id: "19823783734d1d04a1b3901d",
            location: 'Detroit',
            shortLocation: "DET",
            name: "Lions",
            color: "#046EB4",
            stadiumName: "Ford Field",
            stadiumCity: "Detroit, MI"
        },
        {
            _id: "19823783734d1d04a1b3901e",
            location: 'Indianapolis',
            shortLocation: "IND",
            name: "Colts",
            color: "#003D79",
            stadiumName: "Lucas Oil Stadium",
            stadiumCity: "Indianapolis, IN"
        },
        {
            _id: "19823783734d1d04a1b3901f",
            location: 'Seattle',
            shortLocation: "SEA",
            name: "Seahawks",
            color: "#7AC142",
            stadiumName: "CenturyLink Field",
            stadiumCity: "Seattle, WA"
        },
        {
            _id: "19823783734d1d04a1b39000",
            location: 'Los Angeles',
            shortLocation: "LA",
            name: "Chargers",
            color: "#2072BA",
            stadiumName: "Los Angeles Stadium",
            stadiumCity: "Inglewood, CA"
        }
    ];

class SchedulePage extends Component {
    constructor(props) {
        super(props);

        const formattedWeeks = weeks.map((week)=>{
            const startDateTime = moment.utc(week.beginDateTime).format('ddd M/D');
            const endDateTime = moment.utc(week.endDateTime).format('ddd M/D');

            if (startDateTime !== endDateTime) {
                week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D') + " - " + moment.utc(week.endDateTime).format('ddd M/D');
            } else {
                week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D');
            }

            return week;
        });

        this.state = {
            league: "NFL",
            year: 2017,
            currentWeek: formattedWeeks.length-1,
            weeks: formattedWeeks
        };

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    handleFilterLeague(filterLeague) {
        this.setState({
            filterLeague: filterLeague
        });
    }

    handleFilterYear(filterYear) {
        this.setState({
            filterYear: filterYear
        });
    } 
  
    handleFilterWeek(filterWeek) {
        this.setState({
            filterWeek: filterWeek
        });
    }

    render() {
        return (
            <div>
                <Header/>
                <div className="page-container">
                    <GameSearchBar 
                        league={this.state.league} 
                        year={this.state.year}
                        currentWeek={this.state.currentWeek}
                        weeks={this.state.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}
                    />
                    <Games games={this.props.games || 
                        [
                            {
                                "_id": "5989007136e954b6bd131b9b",
                                "startDateTime": "2017-08-11T00:00:00+04:00",
                                "station": "",
                                "leagueId": "59723313734d1d6202a85f10",
                                "weekNo": 2,
                                "competitors": [
                                    {
                                        "_id": "19823783734d1d04a1b3900f"
                                    },
                                    {
                                        "_id": "19823783734d1d04a1b39010"
                                    }
                                ]
                            },
                            {
                                "_id": "5989007136e954b6bd131b9c",
                                "startDateTime": "2017-08-11T00:00:00+04:00",
                                "station": "",
                                "leagueId": "59723313734d1d6202a85f10",
                                "weekNo": 2,
                                "competitors": [
                                    {
                                        "_id": "19823783734d1d04a1b39011"
                                    },
                                    {
                                        "_id": "19823783734d1d04a1b39012"
                                    }
                                ]
                            }
                        ]} 
                        picks={this.props.picks || []} />
                </div>
                <Footer/>
            </div>
        )
    }
}

class GameSearchBar extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeagueInputChange = this.handleFilterLeagueInputChange.bind(this);
        this.handleFilterYearInputChange = this.handleFilterYearInputChange.bind(this);
        this.handleFilterWeekInputChange = this.handleFilterWeekInputChange.bind(this);
      }
      
      handleFilterLeagueInputChange(e) {
        this.props.onFilterLeague(e.target.value);
      }
      
      handleFilterYearInputChange(e) {
        this.props.handleFilterYear(e.target.value);
      }

      handleFilterWeekInputChange(e) {
        this.props.onFilterWeek(e.target.value);
      }
      
      render() {
        const weeks = this.props.weeks.map((week, index) =>
                        <MenuItem key={index} value={index} primaryText={week.displayName}  />
                      );

        return (
          <div style={{marginTop: '12px', backgroundColor: '#fff'}}>
                        <RaisedButton
                          label="Filtration"
                          labelPosition="before"
                          primary={true}
                          icon={<ActionAndroid />}
                          style={filterButton.button}
                        />
                        <DropDownMenu
                            value={0}
                            onChange={this.handleFilterLeagueInputChange}
                            style={dropDown.root}
                            autoWidth={false}
                            >
                            <MenuItem value={0} primaryText={this.props.league}/>
                        </DropDownMenu>
                        <DropDownMenu
                            value={0}
                            onChange={this.handleFilterYearInputChange}
                            style={dropDown.root}
                            autoWidth={false}
                            >
                            <MenuItem value={0} primaryText="2017" />
                        </DropDownMenu>
                        <DropDownMenu
                            value={this.props.currentWeek}
                            onChange={this.handleFilterWeekInputChange}
                            style={dropDownFull.root}
                            autoWidth={false}
                            >
                            {weeks}
                        </DropDownMenu>
                    </div>
        );
    }
}

class Games extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLoading: false
        };
    }

    render() {
        const { picks, games } = this.props;

        const sortedGames = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        const formattedGames = games.map((game)=>{
                game.startDateTimeDisplay = moment.utc(new Date(game.startDateTime)).format('dddd MMM D YYYY h:mm a') + ' ET';
                game.stadiumCity = game.overrideStadiumCity ? game.overrideStadiumCity : teamData.find(x=>x._id === game.competitors[1]._id).stadiumCity;
                game.stadiumName = game.overrideStadiumName ? game.overrideStadiumName : teamData.find(x=>x._id === game.competitors[1]._id).stadiumName;
                game.winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

                game.competitors = game.competitors.map((competitor, index)=> {
                    const team = teamData.find(x=>x._id === competitor._id);
                    competitor.shortLocation = team.shortLocation;
                    competitor.name = team.name;
                    competitor.color = team.color;
                    competitor.showCheck = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;
                    return competitor;
                });

                return game;
            });

        const rows = formattedGames.map(function(game) {
            const pick = picks.find(x=>x.gameId === game._id);
            return <Game game={game} pick={pick} key={game._id} />;
        });

        return (
            <div style={grid.root}>
                {this.state.dataLoading && <Spinner/>}
                {rows}
            </div>
        );
    }
}

Games.propTypes = {
  games: PropTypes.array,
  picks: PropTypes.array
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameAndPickLoading: false,
            pickProcessing: false
        };
        
        this.handlePick = this.handlePick.bind(this);
    }

    handlePick(gameId, pickId, showCheck) {
    }

    render() {
        // var name = this.props.product.stocked ?
        //   this.props.product.name :
        //   <span style={{color: 'red'}}>
        //     {this.props.product.name}
        //   </span>;

        const { game, pick } = this.props;

        return (
            <div key={game._id} style={{width:'100%', marginBottom: '12px'}}>
                <GridList key={game._id + "-gridlist"} style={grid.list}>
                    {game.competitors.map((competitor) => (
                        <GridTile
                        key={game._id + "." + competitor._id}
                        className="grid-tile"
                        style={grid.tile}
                        title={competitor.name}
                        titleStyle={grid.titleStyle}
                        titleBackground={grid.titleBackground}
                        onClick={this.handlePick(game._id, competitor._id, competitor.showCheck)}>
                        <div style={{border: competitor.showCheck ? 
                            (game.isGameOver ? (game.winner ? (game.winner === competitor._id ? '8px solid green' : '8px solid red')
                            : '8px solid #f0ad4e') : '8px solid #BA68C8') : '0', height: "91%", color: competitor.color}}>
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
                <div style={{width: '100%',fontSize: '14px',fontWeight: 'bold',color: 'gray'}}>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.startDateTimeDisplay}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.station}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumName}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumCity}</div>
                </div>
            </div>
        );
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object
};

// class Schedules2 extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             leagueName: "NFL",
//             selectedWeek: 0,
//             weeks: [],

//             areAnyGamesOver: false,
//             wins: 0,
//             losses: 0,
//             ties: 0,

//             dataLoading: true,
//             games: [], 

//             selectionInProgress: false,
//             picks: [],
            
//             value1: 1, 
//             value2: 1
//         };
//     }

//     componentWillMount() {
//         if (leagues.find(x=>x === this.props.match.params.name.toUpperCase)) {
//             history.push('/leagues/' + this.props.match.params.name.toLowerCase);
//             this.setState({
//                 leagueName: this.props.match.params.name.toUpperCase 
//             });
//         } else {
//             history.push('/leagues/nfl');
//         }   

//         weeks.map((week)=>{
//             const startDateTime = moment.utc(week.beginDateTime).format('ddd M/D');
//             const endDateTime = moment.utc(week.endDateTime).format('ddd M/D');

//             if (startDateTime !== endDateTime) {
//                 week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D') + " - " + moment.utc(week.endDateTime).format('ddd M/D');
//             } else {
//                 week.displayName = week.namePrefix + " " + week.weekNumberDisplay + " " + moment.utc(week.beginDateTime).format('ddd M/D');
//             }

//             return week;
//         });

//         this.setState({
//             weeks: weeks
//         });

//         const currentWeek = weeks.length-1;

//         this.setState({
//             selectedWeek: currentWeek
//         });

//         this.getGamesAndPicks(weeks[currentWeek]);
//     }

//     handleChange1 = (event, index, value1) => this.setState({value1});
//     handleChange2 = (event, index, value2) => this.setState({value2});

//     selectWeek = (event, index) => {
//         this.getGamesAndPicks(this.state.weeks[index]);
//         this.setState({selectedWeek: index});
//     };
    
//     selectCompetitor (gameId, competitorId, showCheck) {
//         const newPickId = !showCheck ? competitorId : null;

//         if (newPickId === null) {
//             return;
//         }

//         const game = this.state.games.find(x=>x._id === gameId);

//         if (game.isGameOver) {
//             return;
//         }

//         this.setState({selectionInProgress: true});

//         const pick = this.state.picks.find(x=>x.gameId === gameId);

//         if (pick && newPickId) {
//             api.updatePick(pick._id, { gameId:gameId, pickId:newPickId }, response => {
//                 const pickIndex = this.state.picks.findIndex(x=>x._id === response._id);
//                 this.setState(update(this.state.picks, { $splice: [[pickIndex, 1, response]] } ));
//                 this.updatePickInUI(game, competitorId);
//             });

//             return;
//         }

//         api.createPick({leagueId:'59723313734d1d6202a85f10', weekNo: game.weekNo, gameId:gameId, pickId:newPickId}, response => {
//             this.setState({ picks: [...this.state.picks, response]});
//             this.updatePickInUI(game, competitorId);
//         });
//     }

//     getGamesAndPicks(week) {
//         this.setState({
//             dataLoading: true
//         });

//         const query = {
//             leagueId:"59723313734d1d6202a85f10",
//             weekNo: week.weekNo
//         };

//         const getGamesPromise = api.getGames(query);
        
//         const getPickPromise = api.getPicks(query);

//         Promise.all([getGamesPromise, getPickPromise]).then(response => {
//             let games = response[0];
//             const picks = response[1];

//             games = games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
            
//             let wins = 0;
//             let losses = 0;
//             let ties = 0;

//             games.map((game)=>{
//                 game.startDateTimeDisplay = moment.utc(new Date(game.startDateTime)).format('dddd MMM D YYYY h:mm a') + ' ET';
//                 game.stadiumCity = game.overrideStadiumCity ? game.overrideStadiumCity : teamData.find(x=>x._id === game.competitors[1]._id).stadiumCity;
//                 game.stadiumName = game.overrideStadiumName ? game.overrideStadiumName : teamData.find(x=>x._id === game.competitors[1]._id).stadiumName;
//                 game.winner = game.competitors[0].score === game.competitors[1].score ? null : (game.competitors[0].score > game.competitors[1].score ? game.competitors[0]._id : game.competitors[1]._id)

//                 if (game.isGameOver && game.competitors[0].score === game.competitors[1].score ) {
//                     ++ties;
//                 }

//                 return game.competitors.map((competitor, index)=> {
//                     const team = teamData.find(x=>x._id === competitor._id);
//                     competitor.shortLocation = team.shortLocation;
//                     competitor.name = team.name;
//                     competitor.color = team.color;
//                     competitor.showCheck = picks.find(x=>x.gameId === game._id && x.pickId === competitor._id) ? true : false;

//                     if (competitor.showCheck && competitor._id === game.winner && game.isGameOver) {
//                         ++wins;
//                     }

//                     if (competitor.showCheck && competitor._id !== game.winner && game.isGameOver) {
//                         ++losses;
//                     }

//                     return competitor;
//                 });
//             });

//             const areAnyGamesOver = games.some(x=>!!x.isGameOver);
            
//             this.setState({
//                 games: games,
//                 picks: picks,
//                 dataLoading: false,
//                 areAnyGamesOver: areAnyGamesOver,
//                 wins: wins,
//                 losses: losses,
//                 ties: ties
//             });
//         });
//     }

//     updatePickInUI (game, competitorId) {
//         let competitorSelected = game.competitors.find(x=>x._id === competitorId);

//         if (competitorSelected.showCheck) {
//             competitorSelected.showCheck = false;
//         } else {
//             game.competitors.map((competitor) => {
//                 if (competitor._id !== competitorId) {
//                       competitor.showCheck = false;
//                 }

//                 return competitor;
//             });

//             competitorSelected.showCheck = true;
//         }
        
//        this.setState({selectionInProgress: false});
//     }

//     render() {
//         const record = this.state.wins +  " - " + this.state.losses + " - " + this.state.ties;
//         return (
//             <div>
//                 <Header/>
//                 <div className="page-container">
//                     <div style={{marginTop: '12px', backgroundColor: '#fff'}}>
//                         <RaisedButton
//                           label="Filtration"
//                           labelPosition="before"
//                           primary={true}
//                           icon={<ActionAndroid />}
//                           style={filterButton.button}
//                         />
//                         <DropDownMenu
//                             value={this.state.value1}
//                             onChange={this.handleChange1}
//                             style={dropDown.root}
//                             autoWidth={false}
//                             >
//                             <MenuItem value={1} primaryText={this.state.leagueName}/>
//                         </DropDownMenu>
//                         <DropDownMenu
//                             value={this.state.value2}
//                             onChange={this.handleChange2}
//                             style={dropDown.root}
//                             autoWidth={false}
//                             >
//                             <MenuItem value={1} primaryText="2017" />
//                         </DropDownMenu>
//                         <DropDownMenu
//                             value={this.state.selectedWeek}
//                             onChange={this.selectWeek}
//                             style={dropDownFull.root}
//                             autoWidth={false}
//                             >
//                             {this.state.weeks.map((week, index) => (
//                                 <MenuItem key={index} value={index} primaryText={week.displayName}  />
//                             ))}
//                         </DropDownMenu>
//                     </div>
//                     {this.state.areAnyGamesOver && <div style={{margin: '12px 0', fontSize: '40px', color: 'gray'}}>{record}</div>}
//                         <div style={grid.root}>
//                             {this.state.dataLoading && <Spinner/>}
//                             {!this.state.dataLoading && this.state.games.map((game, index1) => (
//                                 <div
//                                     key={game._id}
//                                     style={{width:'100%', marginBottom: '12px'}}>
//                                     <GridList
//                                         key={game._id + "-gridlist"}
//                                         style={grid.list}
//                                         >
//                                         {game.competitors.map((competitor, index2) => (
//                                                 <GridTile
//                                                     key={game._id + "." + competitor._id}
//                                                     className="grid-tile"
//                                                     style={grid.tile}
//                                                     title={competitor.name}
//                                                     titleStyle={grid.titleStyle}
//                                                     titleBackground={grid.titleBackground}
//                                                     onClick={() => this.selectCompetitor(game._id, competitor._id, competitor.showCheck)}
//                                                     >
//                                                     <div 
//                                                     style={{
//                                                         border: competitor.showCheck ? (game.isGameOver ? (game.winner ? (game.winner === competitor._id ? '8px solid green' : '8px solid red') : '8px solid #f0ad4e') : '8px solid #BA68C8') : '0', height: "91%",
//                                                         color: competitor.color
//                                                     }}>
//                                                         <div style={{fontSize:'36px', paddingTop:'10px', block: competitor.score ? 'block' : 'none'}}>
//                                                             {competitor.score}
//                                                         </div>
//                                                         <div style={{paddingTop: competitor.score ? '10px' : '26px'}}>
//                                                             {competitor.shortLocation}
//                                                         </div>
//                                                     </div>
//                                                 </GridTile>
//                                         ))}
//                                     </GridList>
//                                     <div style={{
//                                         width: '100%',
//                                         fontSize: '14px',
//                                         fontWeight: 'bold',
//                                         color: 'gray'
//                                     }}>
//                                         <div style={{float: 'left', marginRight:'24px'}}>{game.startDateTimeDisplay}</div>
//                                         <div style={{float: 'left', marginRight:'24px'}}>{game.station}</div>
//                                         <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumName}</div>
//                                         <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumCity}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                 </div>
//                 <Footer/>
//             </div>
//         );
//     }
// }

export default SchedulePage;