import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import green from '@material-ui/core/colors/green';

import Popover from '../Popover';

import angry from '../../styles/images/angry.png';
import money from '../../styles/images/smile-sweat.png';

import america from '../../styles/images/america.png';
import mexico from '../../styles/images/mexico.png';
import brazil from '../../styles/images/brazil.png';
import italy from '../../styles/images/italy.png';
import iceland from '../../styles/images/iceland.png';
import sweden from '../../styles/images/sweden.png';
import russia from '../../styles/images/russia.png';
import phillipines from '../../styles/images/phillipines.png';
import bulgaria from '../../styles/images/bulgaria.png';
import england from '../../styles/images/england.png';
import suriname from '../../styles/images/suriname.png';
import croatia from '../../styles/images/croatia.png';
import netherlands from '../../styles/images/netherlands.png';
import japan from '../../styles/images/japan.png';
import bahamas from '../../styles/images/bahamas.png';
import ukraine from '../../styles/images/ukraine.png';
import poland from '../../styles/images/poland.png';
import nigeria from '../../styles/images/nigeria.png';
import dominicanRepublic from '../../styles/images/dominican-republic.png';
import southKorea from '../../styles/images/south-korea.png';
import australia from '../../styles/images/australia.png';
import nicaragua from '../../styles/images/nicaragua.png';
import jamaica from '../../styles/images/jamaica.png';

import { hasGameStarted } from '../../utilities';

import { getField } from './fields';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'fit-content'
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '8px',
    marginBottom: '8px'
  },
  paper: {
    borderRadius: '8px',
    boxShadow: 'none'
  },
  control: {
    padding: '32px',
  },
  checkBox: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  startDateTime: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)'
  },
  lastPlay: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)',
    margin: '8px 0'
  },
  tieButton: {
    fontWeight: "700",
    marginTop: '10px',
    width: '25%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  saveButton: {
    fontWeight: "700",
    width: '25%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  gameHeader: {
    minHeight: '32px'
  }
});

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            awayScore: null,
            homeScore: null,
            awayRank: null,
            homeRank: null,
            awayRecord: null,
            homeRecord: null,
            awaySpread: null,
            homeSpread: null,
            gameName: null,
            isGameOver: null,
            currentTime: null,
            gameTime: null,
            gameDate: null
        };
    }

    handleMakePick(gameId, pickId) {
        if (get(this.props,'pick.pickId') === pickId || 
          get(this.props,'pick.inProgress',false) || 
          hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: pickId
        };

        this.props.handleMakePick(pick);
    }

    handleTie(gameId) {
        if (get(this.props,'pick.pickId') === '000000000000000000000000' || 
          get(this.props,'pick.inProgress',false) || 
          hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: '000000000000000000000000'
        };

        this.props.handleMakePick(pick);
    }

    handleClearInput = () => {
      this.setState({
        awayScore: null,
        homeScore: null,
        awayRank: null,
        homeRank: null,
        awayRecord: null,
        homeRecord: null,
        awaySpread: null,
        homeSpread: null,
        gameName: null,
        isGameOver: null,
        currentTime: null,
        gameTime: null,
        gameDate: null
      });
    }

    handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    handleSaveGame = (gameId) => {
        if (get(this.props,'userId') !== 'google-oauth2|114172296334563495985') {
            return;
        }

        const {awayScore,homeScore,awayRank,homeRank,awayRecord,homeRecord,awaySpread,homeSpread,gameName,isGameOver,currentTime,gameDate,gameTime} = this.state;

        const gameTimeFormatted = gameTime ? (gameDate || moment().format("YYYY-MM-DD")) + " " + gameTime : null;

        const game = {
            id: gameId,
            awayScore,
            homeScore,
            awayRank,
            homeRank,
            awayRecord,
            homeRecord,
            awaySpread,
            homeSpread,
            gameName,
            isGameOver,
            currentTime,
            gameTime: gameTimeFormatted
        };

        console.log(game);

        this.props.handleUpdateGame(game);
    }

    getFlag(country) {
      switch (country) {
        case 'USA':
          return america;
        case 'MEXICO':
          return mexico;
        case 'BRAZIL':
          return brazil;
        case 'ITALY':
          return italy;
        case 'ICELAND':
          return iceland;
        case 'SWEDEN':
          return sweden;
        case 'RUSSIA':
          return russia;
        case 'PHILLIPINES':
          return phillipines;
        case 'BULGARIA':
          return bulgaria;
        case 'ENGLAND':
          return england;
        case 'CROATIA':
          return croatia;
        case 'SURINAME':
          return suriname;
        case 'NETHERLANDS':
          return netherlands;
        case 'JAPAN':
          return japan;
        case 'BAHAMAS':
          return bahamas;
        case 'UKRAINE':
          return ukraine;
        case 'NIGERIA':
          return nigeria;
        case 'POLAND':
          return poland;
        case 'DOMINICAN REPUBLIC':
          return dominicanRepublic;
        case 'AUSTRALIA':
          return australia;
        case 'SOUTH KOREA':
          return southKorea;
        case 'NICARAGUA':
          return nicaragua;
        case 'JAMAICA':
          return jamaica;
        default:
          return america;
      };
    }

    render() {
        const { classes, game, pick, isAuthenticated, showDetails, userId, disableTie } = this.props;
        const { awayScore, homeScore, awayRank, homeRank, awayRecord, homeRecord, awaySpread, homeSpread, gameName, isGameOver, currentTime, gameDate, gameTime } = this.state;

        const inProgress = get(pick,'inProgress',false);

        const spreadMode = localStorage.getItem('spreadModeToggle') === 'true';

        if (!showDetails) {
          return (
            <div key={game._id} className={classes.container}>
                <Grid key={game._id + "-gridlist"} container className={classes.root}>
                    {game.competitors.map((competitor) => (
                        <Grid
                            key={game._id + "." + competitor._id}
                            item xs={6}
                            onClick={() => this.handleMakePick(game._id, competitor._id)}
                            className={inProgress ? 'fast-flash' : ''} 
                            style={{
                              cursor: 'pointer',
                              border: competitor.selected ? '10px solid #3772FA' : ''
                            }}
                        >
                            <Grow in={true} timeout={500}>
                                <Paper className={classNames(classes.paper)}>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item>
                                              <div>
                                                {
                                                  !['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(get(game,'leagueId')) &&
                                                  <div style={{fontSize:'25px', color: competitor.color}}>
                                                    {hasGameStarted(game.startDateTime) || game.isGameOver ? get(competitor,'score') || 0 : undefined}
                                                  </div>
                                                }
                                                {
                                                  competitor.country &&
                                                  <div style={{paddingBottom: '4px'}}>
                                                    <img alt="" style={{width:'50px', paddingTop: '3px'}} src={this.getFlag(competitor.country)}/>
                                                  </div>
                                                }
                                                <span style={{fontSize: competitor.country ? '2rem' : '2.5rem', fontWeight: '600', color: competitor.color }}>
                                                  <span style={{color:'lightgray', fontSize: '17px', paddingRight: '8px'}}>{competitor.rank}</span>{competitor.shortLocation}
                                                </span>
                                                <div style={{paddingBottom: '4px', fontSize: competitor.country ? '15px' : '20px'}}>
                                                   {competitor.name}
                                                </div>
                                              </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grow>
                        </Grid>
                    ))}                            
                </Grid>
                {
                  isAuthenticated &&
                  !hasGameStarted(game.startDateTime) &&
                  ['59723313734d1d6202a85f10','59723313734d1d6202a85f17','59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  !spreadMode &&
                  !disableTie &&
                  <div>
                    <Button 
                        size="small"
                        className={classes.tieButton} onClick={() => this.handleTie(game._id)}>
                        {['59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f17'].includes(get(game,'leagueId')) ? 'Draw' : 'Tie'}
                    </Button>
                  </div>
                }
                <div className={classes.startDateTime}>
                  {
                    game.gameName && 
                    <div style={{marginTop: '10px', fontSize: '15px'}}> 
                      {game.gameName}
                    </div>
                  }
                </div>
            </div>
          );
        } else {
        return (
            <div key={game._id} className={classes.container}>
                <Grid key={game._id + "-gridlist"} container className={classes.root}>
                    {game.competitors.map((competitor) => (
                        <Grid
                            key={game._id + "." + competitor._id}
                            item xs={6}
                            onClick={() => this.handleMakePick(game._id, competitor._id)}
                            className={inProgress ? 'fast-flash' : ''} 
                            style={{
                              cursor: 'pointer',
                              border: competitor.selected ? '10px solid #3772FA' : ''
                            }}
                        >
                            <Grow in={true} timeout={500}>
                                <Paper className={classNames(classes.paper)}>
                                    {
                                      ((get(game,'isGameOver') && get(pick,'pickId')) || (get(game,'spread.amount') && spreadMode)) &&
                                      <Grid item className={classNames(classes.gameHeader)}>
                                    {
                                      spreadMode &&
                                      <div>
                                        <div style={{position:'absolute', padding: '4px',
                                          display: get(game,'isGameOver') && competitor.selected && !competitor.selectedWinner ? 'block' : 'none'}}>
                                          <img style={{width:'40px'}} src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', padding: '4px',
                                          display: get(game,'isGameOver') && competitor.selected && competitor.selectedWinner ? 'block' : 'none'}}>
                                          <img style={{width:'40px'}} src={money} alt=""/>
                                        </div>
                                      </div>
                                    }
                                    {
                                      !spreadMode &&
                                      <div>
                                        <div style={{position:'absolute', padding: '4px',
                                          display: get(game,'isGameOver') ? (!competitor.selected ? 'none' : (game.winner !== competitor._id && get(pick,'pickId') === competitor._id) || (game.winner !== '000000000000000000000000' && get(pick,'pickId') === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                          <img style={{width:'40px'}} src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', padding: '4px',
                                          display: get(game,'isGameOver') ? (!competitor.selected ? 'none' : (game.winner === competitor._id && get(pick,'pickId') === competitor._id) || (game.winner === '000000000000000000000000' && get(pick,'pickId') === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                          <img style={{width:'40px'}} src={money} alt=""/>
                                        </div>
                                      </div>
                                    }
                                    {
                                      spreadMode &&
                                      <div style={{fontSize: '17px', padding: '5px 5px 0 0', 
                                          display: get(game,'spread.teamId') === competitor._id && spreadMode ? 'block' : 'none', 
                                          textAlign: 'right'}}>
                                          {get(game,'spread.amount')}
                                      </div>
                                    }
                                    </Grid>}
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item>
                                              <div>
                                                {
                                                  !['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(get(game,'leagueId')) &&
                                                  <div style={{fontSize:'25px', color: competitor.color}}>
                                                    {hasGameStarted(game.startDateTime) || game.isGameOver ? get(competitor,'score') || 0 : undefined}
                                                  </div>
                                                }
                                                {
                                                  competitor.country &&
                                                  <div style={{paddingBottom: '4px'}}>
                                                    <img alt="" style={{width:'50px', paddingTop: '3px'}} src={this.getFlag(competitor.country)}/>
                                                  </div>
                                                }
                                                <span style={{fontSize: competitor.country ? '2rem' : '2.5rem', fontWeight: '600', color: competitor.color}}>
                                                  <span style={{color:'lightgray', fontSize: '17px', paddingRight: '8px'}}>{competitor.rank}</span>{competitor.shortLocation}
                                                </span>
                                                <div style={{paddingBottom: '4px', fontSize: competitor.country ? '15px' : '20px', padding: competitor.record ? '0' : ((get(game,'isGameOver') && get(pick,'pickId')) || (get(game,'spread.amount') && spreadMode)) ? '4px 0 24px 0' :  '4px 0'}}>
                                                  {competitor.name}
                                                </div>
                                                { 
                                                  competitor.record &&
                                                  <div style={{fontSize: '16px', color: '#BDBDBD', padding: ((get(game,'isGameOver') && get(pick,'pickId')) || (get(game,'spread.amount') && spreadMode)) ? '4px 0 24px 0' :  '4px 0'}}>
                                                    {competitor.record}
                                                  </div>
                                                }
                                              </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grow>
                        </Grid>
                    ))}                            
                </Grid>
                {
                  isAuthenticated &&
                  !hasGameStarted(game.startDateTime) &&
                  ['59723313734d1d6202a85f10','59723313734d1d6202a85f17','59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  !spreadMode &&
                  !disableTie &&
                  <div>
                    <Button 
                        size="small"
                        className={classes.tieButton} onClick={() => this.handleTie(game._id)}>
                        {['59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f17'].includes(get(game,'leagueId')) ? 'Draw' : 'Tie'}
                    </Button>
                  </div>
                }
                {
                  getField(get(game,'leagueId'), {
                    away: game.competitors[0].shortLocation, 
                    awayColor: game.competitors[0].color, 
                    home: game.competitors[1].shortLocation, 
                    homeColor: game.competitors[1].color,
                  })
                }
                <div className={classes.startDateTime}>
                    {
                      game.gameName && 
                      <div style={{marginTop: '10px', fontSize: '15px'}}> 
                        {game.gameName}
                      </div>
                    }
                    {
                      isAuthenticated &&
                      userId === 'google-oauth2|114172296334563495985' &&
                      <Popover 
                        titleStyle={{fontWeight: 'bold', marginTop: '10px'}}
                        title={game.startDateTimeDisplay}
                        handleOpen={this.handleClearInput}>
                        <div style={{padding:'16px'}}>
                          <div>
                            <Checkbox
                              name="isGameOver"
                              color="primary"
                              checked={isGameOver}
                              inputProps={{ 'aria-label': 'secondary checkbox' }}
                              onChange={this.handleInputChange}
                            />
                            is game over
                          </div>
                          <div style={{display: 'flex'}}>
                            <div>
                              <TextField
                                name="awayScore"
                                id="outlined-number"
                                label={game.competitors[0].shortLocation + " score"}
                                type="number"
                                defaultValue={awayScore}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                            <div style={{paddingLeft: '16px'}}>
                              <TextField
                                name="homeScore"
                                id="outlined-number"
                                label={game.competitors[1].shortLocation + " score"}
                                type="number"
                                defaultValue={homeScore}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div style={{display: 'flex', marginTop: '16px'}}>
                            <div>
                              <TextField
                                name="awayRank"
                                id="outlined-number"
                                label={game.competitors[0].shortLocation + " rank"}
                                type="number"
                                defaultValue={awayRank}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                            <div style={{paddingLeft: '16px'}}>
                              <TextField
                                name="homeRank"
                                id="outlined-number"
                                label={game.competitors[1].shortLocation + " rank"}
                                type="number"
                                defaultValue={homeRank}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div style={{display: 'flex', marginTop: '16px'}}>
                            <div>
                              <TextField
                                name="awayRecord"
                                id="outlined-number"
                                label={game.competitors[0].shortLocation + " record"}
                                type="string"
                                defaultValue={awayRecord}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                            <div style={{paddingLeft: '16px'}}>
                              <TextField
                                name="homeRecord"
                                id="outlined-number"
                                label={game.competitors[1].shortLocation + " record"}
                                type="string"
                                defaultValue={homeRecord}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div style={{display: 'flex', marginTop: '16px'}}>
                            <div>
                              <TextField
                                name="awaySpread"
                                id="outlined-number"
                                label={game.competitors[0].shortLocation + " spread"}
                                type="number"
                                defaultValue={awaySpread}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                            <div style={{paddingLeft: '16px'}}>
                              <TextField
                                name="homeSpread"
                                id="outlined-number"
                                label={game.competitors[1].shortLocation + " spread"}
                                type="number"
                                defaultValue={homeSpread}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div style={{marginTop: '16px'}}>
                            <TextField
                              name="currentTime"
                              id="outlined-number"
                              label="Game Clock"
                              defaultValue={currentTime}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={this.handleInputChange}
                              variant="outlined"
                            />
                          </div>
                          <div style={{display: 'flex', marginTop: '16px'}}>
                            <div>
                              <TextField
                                name="gameDate"
                                id="outlined-number"
                                label="Game Date"
                                type="date"
                                defaultValue={gameDate}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                            <div style={{paddingLeft: '16px'}}>
                              <TextField
                                name="gameTime"
                                id="outlined-number"
                                label="Game Time"
                                type="time"
                                defaultValue={gameTime}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={this.handleInputChange}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          <div style={{marginTop: '16px'}}>
                            <TextField
                              name="gameName"
                              id="outlined-number"
                              label="Game Name"
                              defaultValue={gameName}
                              fullWidth
                              multiline={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={this.handleInputChange}
                              variant="outlined"
                            />
                          </div>
                          <div>
                            <Button 
                                size="small"
                                className={classes.saveButton} onClick={() => this.handleSaveGame(game._id)}>
                                Save
                            </Button>
                          </div>
                        </div>
                      </Popover>
                    }
                    {
                      (userId !== 'google-oauth2|114172296334563495985' || !isAuthenticated) &&                   
                      <div style={{marginTop: '10px'}}> 
                        {game.startDateTimeDisplay}
                      </div>
                    }
                    {
                      get(game,'isGameOver') && 
                      <span style={{marginLeft:'12px'}}>Final</span>
                    }
                    {
                      !get(game,'isGameOver') && 
                      hasGameStarted(game.startDateTime) && 
                      <span className='fast-flash' style={{color: 'deeppink', marginLeft:'12px'}}>
                        {game.currentTime || 'in progress'}
                      </span>
                    }
                </div>
                {
                  hasGameStarted(game.startDateTime) &&
                  !get(game,'isGameOver') && 
                  <div className={classes.startDateTime}>
                    {game.possession} {game.down}
                  </div>
                }
                {
                  hasGameStarted(game.startDateTime) &&
                  (game.playHistory || []).length > 0 && 
                  ['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  <div className={classes.lastPlay}>
                    {
                      (game.playHistory || []).map((play,playIndex)=> (
                        <div key={playIndex} style={{margin:'4px 0',display:'flex'}}>
                          <div style={{minWidth:'40px',padding:'4px',backgroundColor:play.color,marginRight:'4px',color:'#fff'}}>
                            {play.shortLocation}
                          </div>
                          <div style={{textAlign:'left'}}>
                            {play.lastPlay}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                }
                {
                  hasGameStarted(game.startDateTime) &&
                  (game.playHistory || []).length > 0 && 
                  !['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  <div className={classes.lastPlay}>
                    {
                      (game.playHistory || []).map((play,playIndex)=> (
                        <div key={playIndex} style={{margin:'4px 0',display:'flex'}}>
                          <div style={{minWidth:'40px',padding:'4px',backgroundColor:'rgb(45, 232, 149)', marginRight:'4px'}}>
                            <div>
                              {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? play.quarter : play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                            </div>
                            {
                              !['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) &&
                              <div>
                                {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                              </div>
                            }
                          </div>
                          <div style={{textAlign:'left'}}>
                            {play.lastPlay}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                }
            </div>
        );
      }
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  showDetails: PropTypes.bool,
  spreadMode: PropTypes.bool,
  disableTie: PropTypes.bool,
  handleMakePick: PropTypes.func,
  handleUpdateGame: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(Game);
