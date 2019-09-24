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

import green from '@material-ui/core/colors/green';

import angry from '../../styles/images/angry.png';
import money from '../../styles/images/money.png';

import america from '../../styles/images/america.png';
import mexico from '../../styles/images/mexico.png';
import brazil from '../../styles/images/brazil.png';
import italy from '../../styles/images/italy.png';
import iceland from '../../styles/images/iceland.png';
import sweden from '../../styles/images/sweden.png';

import { hasGameStarted } from '../../utilities';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '192px',
    marginBottom: '4px'
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '8px',
    marginBottom: '8px'
  },
  paper: {
    height: '100%',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none'
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
    color: '#3772FA',
    border: '4px solid #3772FA',
    fontWeight: '600'
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
        default:
          return america;
      };
    }

    render() {
        const { classes, game, pick, isAuthenticated } = this.props;
        const inProgress = get(pick,'inProgress',false);

        return (
            <div key={game._id} className={classes.container}>
                <Grid key={game._id + "-gridlist"} container className={classes.root} spacing={8}>
                    {game.competitors.map((competitor) => (
                        <Grid
                            key={game._id + "." + competitor._id}
                            item xs={6}
                            onClick={() => this.handleMakePick(game._id, competitor._id)}
                            className={inProgress ? 'fast-flash' : ''} 
                            style={{
                              cursor: 'pointer',
                              border: competitor.selected ? '8px solid #3772FA' : '',
                              borderRadius: '14px'
                            }}
                        >
                            <Grow in={true} timeout={500}>
                                <Paper className={classNames(classes.paper)}>
                                    <Grid item>
                                        <div style={{position:'absolute', padding: '4px',
                                            display: game.isGameOver ? (!competitor.selected ? 'none' : (game.winner !== competitor._id && pick.pickId === competitor._id) || (game.winner !== '000000000000000000000000' && pick.pickId === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                            <img src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', padding: '4px',
                                            display: game.isGameOver ? (!competitor.selected ? 'none' : (game.winner === competitor._id && pick.pickId === competitor._id) || (game.winner === '000000000000000000000000' && pick.pickId === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                            <img src={money} alt=""/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item>
                                              <div style={{marginTop: hasGameStarted(game.startDateTime) ? '12px' : '40px'}}>
                                                {
                                                  !['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(get(game,'leagueId')) &&
                                                  <Typography style={{fontSize:'25px', color: competitor.color}}>
                                                    {hasGameStarted(game.startDateTime) ? get(competitor,'score') || 0 : undefined}
                                                  </Typography>
                                                }
                                                {
                                                  competitor.country &&
                                                  <div>
                                                    <img alt="" style={{width:'50px', paddingTop: '3px'}} src={this.getFlag(competitor.country)}/>
                                                  </div>
                                                }
                                                <span style={{fontSize: competitor.country ? '2rem' : '2.5rem', fontWeight: '600', color: competitor.color }}>
                                                  <span style={{color:'lightgray', fontSize: '17px', paddingRight: '8px'}}>{competitor.rank}</span>{competitor.shortLocation}
                                                </span>
                                                <div style={{fontSize: competitor.country ? '15px' : '20px'}}>
                                                  {competitor.name}
                                                </div>
                                                { 
                                                  competitor.record &&
                                                  <div style={{fontSize: '16px', color: '#BDBDBD', paddingTop: '3px'}}>
                                                    {competitor.record}
                                                  </div>
                                                }
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
                  ['59723313734d1d6202a85f10','59723313734d1d6202a85f17','59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  <Button 
                      variant="outlined" 
                      className={classes.tieButton} onClick={() => this.handleTie(game._id)}>
                      {['59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f17'].includes(get(game,'leagueId')) ? 'Draw' : 'Tie'}
                  </Button>
                }
                <div className={classes.startDateTime}>
                    {
                      game.gameName && 
                      <div> 
                        {game.gameName}
                      </div>
                    } 
                    <span> 
                      {game.startDateTimeDisplay}
                    </span> 
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