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
import money from '../../styles/images/smile-sweat.png';
import pumpkin from '../../styles/images/pumpkin.png';

import america from '../../styles/images/america.png';
import mexico from '../../styles/images/mexico.png';
import brazil from '../../styles/images/brazil.png';
import italy from '../../styles/images/italy.png';
import iceland from '../../styles/images/iceland.png';
import sweden from '../../styles/images/sweden.png';
import russia from '../../styles/images/russia.png';
import phillipines from '../../styles/images/phillipines.png';
import bulgaria from '../../styles/images/bulgaria.png';

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

const getField = (props) => (
  <svg id="drivechart-mobile" className="mobile-svg mobile-only" height="100" version="1.1" width="372" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 372 72" style={{height:'100%',maxWidth:'500px', width:'90%', overflow: 'hidden', position: 'relative'}} preserveAspectRatio="xMinYMin">
      <rect className="field-bottom" x="185.468" y="67.814" width="1.055" height="4.043" rx="0" ry="0" fill="#2c7b3d" stroke="#000" strokeWidth="0" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}} strokeOpacity="1"></rect>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M216.127,67.814L216.086,71.857L186.523,71.857L186.523,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M247.854,67.814L247.77,71.857L216.087,71.857L216.127,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M278.514,67.814L278.389,71.857L247.77,71.857L247.854,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M311.285,67.814L311.115,71.857L278.388,71.857L278.513,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M340.898,67.814L340.689,71.857L311.116,71.857L311.285,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#9c9c9d" stroke="#000000" d="M341.955,67.814L341.744,71.857L340.689,71.857L340.899,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#2a443b" stroke="#000000" d="M371.559,67.814L371.308,71.857L341.744,71.857L341.955,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M185.467,67.814L185.468,71.857L153.794,71.857L153.751,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M153.751,67.814L153.795,71.857L123.177,71.857L123.091,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M123.091,67.814L123.176,71.857L92.548,71.857L92.421,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M92.421,67.814L92.548,71.857L61.93,71.857L61.762,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#356732" stroke="#000000" d="M61.762,67.814L61.93,71.857L31.312,71.857L31.102,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#cdcccc" stroke="#000000" d="M31.102,67.814L31.312,71.857L29.202,71.857L28.989,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-bottom" fill="#2a443b" stroke="#000000" d="M28.989,67.814L29.202,71.857L0.693,71.857L0.442,67.814Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M186.468,40.427L186.523,67.814L185.467,67.814L185.523,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M212.943,40.427L216.127,67.814L186.524,67.814L186.468,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M241.315,40.427L247.854,67.814L216.127,67.814L212.943,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M268.734,40.427L278.513,67.814L247.853,67.814L241.315,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M298.043,40.427L311.285,67.814L278.514,67.814L268.734,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M324.527,40.427L340.898,67.814L311.285,67.814L298.043,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#cdcccc" stroke="#000000" d="M325.471,40.427L341.955,67.814L340.899,67.814L324.526,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top field-home" fill={props.homeColor} stroke="#000000" d="M351.945,40.427L371.559,67.814L341.955,67.814L325.472,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M185.523,40.427L185.468,67.814L153.75,67.814L157.16,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M157.16,40.427L153.75,67.814L123.091,67.814L129.741,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M129.741,40.427L123.092,67.814L92.422,67.814L102.313,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#359f47" stroke="#000000" d="M102.313,40.427L92.421,67.814L61.762,67.814L74.894,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#39b54a" stroke="#000000" d="M74.893,40.427L61.761,67.814L31.101,67.814L47.474,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top" fill="#cdcccc" stroke="#000000" d="M47.474,40.427L31.102,67.814L28.989,67.814L45.585,40.427Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="field-top field-away" fill={props.awayColor} stroke="#000000" d="M45.584,40.427L28.989,67.814L0.441,67.814L20.055,40.427Z" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}} strokeWidth="0" strokeOpacity="1"></path>
      <defs style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}></defs>
      <text className="field-text-team" x="20" y="86.814" textAnchor="start" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'start', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.away}</tspan>
      </text>
      <text className="field-text-team" x="350" y="86.814" textAnchor="end" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#000000" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'end', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>{props.home}</tspan>
      </text>
      <text className="field-number" x="186.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>50</tspan>
      </text>
      <text className="red-zone-left" x="92.50000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
      <text className="red-zone-right" x="279.00000000000000" y="87.814" textAnchor="middle" fontFamily="BentonSans, Arial, Helvetica, sans-serif" fontSize="12px" stroke="none" fill="#333333" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', textAnchor: 'middle', fontFamily: 'BentonSans, Arial, Helvetica, sans-serif', fontSize: '12px'}} strokeWidth="1">
          <tspan dy="3.493687499999993" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'}}>20</tspan>
      </text>
      <path className="goal-post-left" fill="#818181" stroke="#000000" d="M8.294,54.432L9.304,53.236L9.304,44.868L8.294,46.064Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="6.275" y="46.064" width="2.02" height="8.367" rx="0" ry="0" fill="#2a443b" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#989898" stroke="#000000" d="M7.285,44.869L9.305,44.869L8.294,46.063L6.274,46.063Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#faed24" d="M13.726,36.307H12.018C9.207,36.307,7.765000000000001,38.137,7.765000000000001,43.909000000000006V44.55700000000001" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="10" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#f8ed40" d="M14.268,35.791H11.761000000000001C8.950000000000001,35.791,7.5070000000000014,38.620999999999995,7.5070000000000014,44.393V45.557" strokeMiterlimit="10" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M11.171,39.062L16.721,33.946L16.155,33.557L10.605,38.67Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M16.156,33.994L16.698,33.994L16.698,8.38L16.156,7.701Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="10.663" y="11.922" width="0.587" height="27.804" rx="0" ry="0" fill="#faed24" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M10.181,39.725C10.181,39.725,10.191999999999998,40.124,10.353,40.421C10.514,40.717999999999996,10.722999999999999,40.671,10.722999999999999,40.671V12.483L10.181,11.702V39.725Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#818181" stroke="#000000" d="M363.967,54.432L362.957,53.236L362.957,44.868L363.967,46.064Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="363.967" y="46.064" width="2.02" height="8.367" rx="0" ry="0" fill="#2a443b" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#989898" stroke="#000000" d="M364.977,44.869L362.957,44.869L363.967,46.063L365.987,46.063Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#faed24" d="M358.536,36.307H360.244C363.055,36.307,364.497,38.137,364.497,43.909000000000006V44.55700000000001" strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="10" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeLinecap: 'square', strokeLinejoin: 'round', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="none" stroke="#f8ed40" d="M357.994,35.791H360.50100000000003C363.31300000000005,35.791,364.75600000000003,38.620999999999995,364.75600000000003,44.393V45.557" strokeMiterlimit="10" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeMiterlimit: '10', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M361.09,39.062L355.54,33.946L356.106,33.557L361.656,38.67Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M356.105,33.994L355.564,33.994L355.564,8.38L356.105,7.701Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
      <rect className="goal-post-left" x="361.012" y="11.922" width="0.586" height="27.804" rx="0" ry="0" fill="#faed24" stroke="#000" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></rect>
      <path className="goal-post-left" fill="#f8ed40" stroke="#000000" d="M362.081,39.725C362.081,39.725,362.07,40.124,361.908,40.421C361.748,40.717999999999996,361.539,40.671,361.539,40.671V12.483L362.08099999999996,11.702V39.725Z" strokeWidth="0" strokeOpacity="1" style={{WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', strokeOpacity: 1}}></path>
  </svg>
);

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
        case 'RUSSIA':
          return russia;
        case 'PHILLIPINES':
          return phillipines;
        case 'BULGARIA':
          return bulgaria;
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
                                          <img style={{width:'40px'}} src={angry} alt=""/>
                                        </div>
                                        <div style={{position:'absolute', padding: '4px',
                                          display: game.isGameOver ? (!competitor.selected ? 'none' : (game.winner === competitor._id && pick.pickId === competitor._id) || (game.winner === '000000000000000000000000' && pick.pickId === '000000000000000000000000') ? 'block' : 'none') : 'none'}}>
                                          <img style={{width:'40px'}} src={money} alt=""/>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm container>
                                        <Grid item xs>
                                            <Grid item>
                                              <div style={{marginTop: hasGameStarted(game.startDateTime) ? '12px' : competitor.country ? '20px' : '40px'}}>
                                                {
                                                  !['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(get(game,'leagueId')) &&
                                                  <Typography style={{fontSize:'25px', color: competitor.color}}>
                                                    {hasGameStarted(game.startDateTime) ? get(competitor,'score') || 0 : undefined}
                                                  </Typography>
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
                  ['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(get(game,'leagueId')) && 
                  getField({
                    away: game.competitors[0].shortLocation, 
                    awayColor: game.competitors[0].color, 
                    home: game.competitors[1].shortLocation, 
                    homeColor: game.competitors[1].color,
                  })
                }
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
                      <span className='fast-flash' style={{color: 'deeppink', marginLeft:'12px'}}>
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
                  game.lastPlay && 
                  ['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
                  <div className={classes.lastPlay}>
                    {' Last Play: ' + game.lastPlay}
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
                              {play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                            </div>
                            <div>
                              {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                            </div>
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

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  handleMakePick: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Game);