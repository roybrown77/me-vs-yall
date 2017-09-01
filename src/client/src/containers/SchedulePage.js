import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';
import { connect } from 'react-redux'
import { loadGames, loadPicks } from '../actions'

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import Game from '../components/Game';

import api from '../middleware/api.js';

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
                }
              ];

const loadData = ({ leagueId, weekNo }) => {
    const query = {
            leagueId:"59723313734d1d6202a85f10",
            weekNo: 5
        };
  loadGames(query);
  loadPicks(query);
}

class SchedulePage extends Component {
    static propTypes = {
        //login: PropTypes.string.isRequired,
        //user: PropTypes.object,
        leagueId: PropTypes.string,//.isRequired,
        weekNo: PropTypes.number,//.isRequired,
        games: PropTypes.array,//.isRequired,
        picks: PropTypes.array,//.isRequired,
        loadGames: PropTypes.func.isRequired,
        loadPicks: PropTypes.func.isRequired
    }

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

    componentWillMount() {
        loadData(this.props)
    } 

    componentWillReceiveProps(nextProps) {
        // if (nextProps.login !== this.props.login) {
             loadData(nextProps)
        // }
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
                    <Games games={this.props.games} picks={this.props.picks} />
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  // const login = ownProps.params.login.toLowerCase();

  const { games, picks, leagueId, weekNo } = state;

  // const starredPagination = starredByUser[login] || { ids: [] };
  // const starredRepos = starredPagination.ids.map(id => repos[id]);
  // const starredRepoOwners = starredRepos.map(repo => users[repo.owner]);

  return {
    //login,
    games,
    picks,
    leagueId,
    weekNo
  }
}

export default connect(mapStateToProps, {
  loadGames,
  loadPicks
})(SchedulePage);

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

//export default SchedulePage;