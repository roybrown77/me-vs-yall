import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import green from '@material-ui/core/colors/green';

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
    height: '184px'
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
    marginTop: '12px'
  }
});
                                
class Game extends Component {
    handleMakePick(gameId, pickId) {
        if ((!!this.props.pick && 
            (this.props.pick.pickId === pickId || this.props.pick.inProgress)) || hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: pickId
        };
        this.props.handleMakePick(pick);
    }

    handleChange = id => event => {
        this.setState({ [id]: event.target.checked });
    };

    render() {
        const { classes, game, pick } = this.props;
        const inProgress = get(pick,'inProgress',false);

        return (
            <div key={game._id} className={classes.container}>
                <Grid key={game._id + "-gridlist"} container className={classes.root} spacing={16}>
                    {game.competitors.map((competitor,competitorIndex) => (
                        <Grid
                            className={inProgress ? 'fast-flash' : ''}
                            key={game._id + "." + competitor._id}
                            item xs={6}
                            onClick={() => this.handleMakePick(game._id, competitor._id)}
                            style={{
                              border: competitor.selected || inProgress ? '8px solid rgb(0, 188, 212)' : '0'
                            }}>
                            <Grow in={true} timeout={500}>
                                <Paper className={classNames(classes.paper)}>
                                    <Grid item>
                                        <div style={{position:'absolute', 
                                            display: game.isGameOver ? (game.winner !== competitor._id && competitor.selected ? 'block' : 'none') : 'none'}}>
                                            <img className="emoji-image" src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', 
                                            display: game.isGameOver ? (game.winner === competitor._id && competitor.selected ? 'block' : 'none') : 'none'}}>
                                            <img className="emoji-image" src={money} alt=""/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item xs>
                                              <Typography style={{fontSize:'2rem', color: competitor.color}}>
                                                {competitor.score}
                                                {
                                                    !competitor.score && competitor.score !== 0 &&
                                                    <div style={{height: '30px'}}>
                                                    </div>
                                                }
                                              </Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography style={{ cursor: 'pointer', fontSize:'3.2rem', color: competitor.color }}>
                                                {competitor.shortLocation}
                                              </Typography>
                                            </Grid>
                                            <Grid item>
                                              <Typography style={{ cursor: 'pointer', fontSize: '20px' }}>
                                                {competitor.name}
                                              </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{position:'absolute', fontSize: '20px', right: '8px', top: '8px',
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
                    false &&
                    <div>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={this.handleChange(game._id)}
                              value="checkedG"
                              classes={{
                                root: classes.checkBox,
                                checked: classes.checked,
                              }}
                            />
                          }
                          label="Tie"
                        />
                    </div>
                }
                <div className={classes.startDateTime}>
                    {game.startDateTimeDisplay} {game.isGameOver && <span style={{marginLeft:'12px'}}>Final</span>}{!game.isGameOver && hasGameStarted(game.startDateTime) && <span className='fast-flash' style={{color: 'darkorange', marginLeft:'12px'}}>in progress</span>}
                </div>
            </div>
        );
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  handleMakePick: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Game);