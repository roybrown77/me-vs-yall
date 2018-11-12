import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import green from '@material-ui/core/colors/green';

import VideoGame from '@material-ui/icons/VideogameAssetTwoTone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import angry from '../styles/images/angry.png';
import money from '../styles/images/money.png';

import { hasGameStarted } from '../selectors';

const styles = theme => ({
  container: {
    backgroundColor: '#ffffff',
    padding: '8px',
    marginBottom: '8px',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
  },
  root: {
    flexGrow: 1,
    height: '192px',
    marginBottom: '4px'
  },
  paper: {
    height: '100%',
    width: '100%',
  },
  control: {
    padding: theme.spacing.unit * 2,
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
    color: 'rgba(0,0,0,.87)',
    marginTop: '4px'
  },
  lastPlay: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)',
    marginTop: '4px'
  },
  tieButton: {
    width: '100%',
    color: 'rgb(0, 188, 212)',
    border: '4px solid rgb(0, 188, 212)',
    fontWeight: '600',
    borderRadius: '8px'
  },
});
                                
class Game extends Component {
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

    render() {
        const { classes, game, pick, isAuthenticated } = this.props;
        const inProgress = get(pick,'inProgress',false);

        return (
            <div key={game._id} className={classes.container}>
                <Grid key={game._id + "-gridlist"} container className={classes.root} spacing={16}>
                    {game.competitors.map((competitor) => (
                        <Grid
                            key={game._id + "." + competitor._id}
                            item xs={6}
                            onClick={() => this.handleMakePick(game._id, competitor._id)}
                            style={{cursor: 'pointer'}}>
                            <Grow in={true} timeout={500}>
                                <Paper className={classNames(classes.paper)}>
                                    <Grid item>
                                        <div style={{position:'absolute', padding: '4px',
                                            display: game.isGameOver ? (!competitor.selected ? 'none' : (game.winner !== competitor._id && pick.pickId === competitor._id) || (game.winner !== '000000000000000000000000' && pick.pickId === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                            <img className="emoji-image" src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', padding: '4px',
                                            display: game.isGameOver ? (!competitor.selected ? 'none' : (game.winner === competitor._id && pick.pickId === competitor._id) || (game.winner === '000000000000000000000000' && pick.pickId === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                            <img className="emoji-image" src={money} alt=""/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item>
                                              <div style={{marginTop: competitor.score || hasGameStarted(game.startDateTime) ? (isAuthenticated && pick ? 
                                                (competitor.record ? '' : '8px') : (competitor.record ? '16px' : '24px')) : 
                                              (isAuthenticated && pick ? (competitor.record ? '32px' : '32px') : (competitor.record ? '40px' : '48px'))}}>
                                                <Typography style={{fontSize:'25px', color: competitor.color}}>
                                                  {hasGameStarted(game.startDateTime) ? get(competitor,'score',0) : undefined}
                                                </Typography>
                                                <span style={{fontSize:'2.5rem', fontWeight: '600', color: competitor.color }}>
                                                  {competitor.shortLocation}
                                                </span>
                                                <div style={{fontSize: '20px'}}>
                                                  {competitor.name}
                                                </div>
                                                { 
                                                  competitor.record &&
                                                  <div style={{fontSize: '16px', color: '#BDBDBD', paddingTop: '3px'}}>
                                                    {competitor.record}
                                                  </div>
                                                }
                                              </div>
                                              <div className={inProgress ? 'fast-flash' : ''} 
                                                style={{zIndex:'999999', bottom: '-8px', width: '100%',
                                                position: 'absolute', display: competitor.selected || inProgress ? 'block' : 'none'}}>
                                                <VideoGame style={{color: 'rgb(0, 188, 212)', fontSize: 55}}/>
                                              </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{position:'absolute', fontSize: '17px', right: '8px', top: '4px',
                                            display: get(game,'spread.teamId') === competitor._id ? 'block' : 'none'}}>
                                            {get(game,'spread.amount')}
                                        </Typography>
                                    </Grid>
                                </Paper>
                            </Grow>
                        </Grid>
                    ))}                            
                </Grid>
                {
                  isAuthenticated &&
                  !hasGameStarted(game.startDateTime) &&
                  <Button 
                      variant="outlined" 
                      className={classes.tieButton} onClick={() => this.handleTie(game._id)}>
                      Tie
                  </Button>
                }
                <div className={classes.startDateTime}>
                    {game.startDateTimeDisplay} 
                    {
                      game.isGameOver && 
                      <span style={{marginLeft:'12px'}}>Final</span>
                    }
                    {
                      !game.isGameOver && 
                      hasGameStarted(game.startDateTime) && 
                      <span className='fast-flash' style={{color: 'darkorange', marginLeft:'12px'}}>
                        {game.currentTime || 'in progress'}
                      </span>
                    }
                </div>
                {
                  hasGameStarted(game.startDateTime) &&
                  !game.isGameOver && 
                  <div className={classes.startDateTime}>
                    {game.possession} {game.down}
                  </div>
                }
                {
                  hasGameStarted(game.startDateTime) &&
                  !game.isGameOver && 
                  game.lastPlay && 
                  <div className={classes.lastPlay}>
                    {' Last Play: ' + game.lastPlay}
                  </div>
                }
                {
                  false &&
                  hasGameStarted(game.startDateTime) &&
                  (game.playHistory || ['(14:30) Touchdown','15: Kickoff']).length > 0 &&
                    <ExpansionPanel>
                      <ExpansionPanelSummary className={classes.expansionSummary} expandIcon={<ExpandMoreIcon />}>
                        <div>
                            Play History
                        </div>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {
                          (game.playHistory || ['(14:30) Touchdown','15: Kickoff']).map((play, index) => (
                          <div>
                            {index+1}: {play}
                          </div>
                        ))}
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                }
            </div>
        );
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  handleMakePick: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Game);
