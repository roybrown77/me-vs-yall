import React from 'react';
import { Route } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Face from '@material-ui/icons/FaceTwoTone';
import VideoGame from '@material-ui/icons/VideogameAssetTwoTone';
import DirectionsRun from '@material-ui/icons/DirectionsRunTwoTone';
import Rowing from '@material-ui/icons/RowingTwoTone';
import LocalAtm from '@material-ui/icons/LocalAtmTwoTone';
import AccessibleForward from '@material-ui/icons/AccessibleForwardTwoTone';

const styles = {
  home: {
    top: '0',
    position: 'fixed',
    zIndex: '9999',
    backgroundColor: '#f4f7f6',
    color: '#000',
    height: '100%',
    padding: '0 12px',
    font: '7rem/1 Permanent Marker'
  },
  homeTitle: {
    marginTop: '5%'
  },
  homeGo: {
    cursor: 'pointer',
  },
  homeDescription: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: '20px',
    marginTop: '32px'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black',
    borderRadius: '8px',
  },
  buttonContainer: {
    margin: '16px'
  }
};

function HomePage(props) {
  const RandomElement = Math.floor(Math.random() * 2) === 0 ? DirectionsRun : Face;
  const RandomElement4 = Math.floor(Math.random() * 2) === 0 ? Rowing : Face;
  const RandomElement5 = Math.floor(Math.random() * 2) === 0 ? AccessibleForward : Face;

  return (
    <div className="fade-in">
      <div style={{
        color: '#000000', 
        fontSize: '2rem', 
        margin: '3% 0 8px 0', 
        width: '100%', 
        fontStyle: 'italic', 
        fontWeight: '700'}}>
        Me vs Yall
      </div>
      <div style={{
        color: '#000000', 
        fontSize: '1rem', 
        padding: '8px 0', 
        width: '100%', 
        fontWeight: '700'}}>
        pick winners of sporting events and compete with others around the world
      </div>
      <div style={styles.buttonContainer}>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <Route render={({ history }) => (
                <Button 
                    variant="outlined" 
                    style={{...styles.button, color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                    National Football League
                </Button>
            )}/>
          </Grid>
          <Grid item xs={6}>
            <Route render={({ history }) => (
                <Button 
                    variant="outlined" 
                    style={{...styles.button, color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                    Premier League Football
                </Button>
            )}/>
          </Grid>
        </Grid>
      </div>
      <div style={{top: '45%', left: '60%', position: 'absolute'}}>
        <RandomElement style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div style={{top: '55%', left: '75%', position: 'absolute'}}>
        <Face style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div className="fast-flash" style={{top: '45%', left: '10%', position: 'absolute'}}>
        <Face style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div style={{top: '55%', left: '45%', position: 'absolute'}}>
        <LocalAtm style={{color: '#'+Math.floor(Math.random()*16777215).toString(16), fontSize: 70}}/>
      </div>
      <div style={{top: '75%', left: '75%', position: 'absolute'}}>
        <Face style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div style={{top: '65%', left: '60%', position: 'absolute'}}>
        <VideoGame style={{color: '#'+Math.floor(Math.random()*16777215).toString(16), fontSize: 70}}/>
      </div>
      <div style={{top: '75%', left: '45%', position: 'absolute'}}>
        <Face style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div style={{top: '65%', left: '30%', position: 'absolute'}}>
        <RandomElement4 style={{color: '#000000', fontSize: 70}}/>
      </div>
      <div style={{top: '85%', left: '60%', position: 'absolute'}}>
        <RandomElement5 style={{color: '#000000', fontSize: 70}}/>
      </div>
    </div>
  );
}

export default HomePage;
