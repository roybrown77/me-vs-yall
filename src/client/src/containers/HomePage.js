import React from 'react';
import { Route } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import VideoGame from '@material-ui/icons/VideogameAssetTwoTone';
import DirectionsRun from '@material-ui/icons/DirectionsRunTwoTone';
import Rowing from '@material-ui/icons/RowingTwoTone';
import LocalAtm from '@material-ui/icons/LocalAtmTwoTone';
import AccessibleForward from '@material-ui/icons/AccessibleForwardTwoTone';
import DirectionsBike from '@material-ui/icons/DirectionsBikeTwoTone';
import Pool from '@material-ui/icons/PoolTwoTone';

import christmas from '../styles/images/christmas_tree.png';
import football from '../styles/images/football2.png';
import soccer from '../styles/images/soccer2.png';
import tennis from '../styles/images/tennis.png';
import basketball from '../styles/images/basketball.png';
import baseball from '../styles/images/baseball.png';

const styles = {
  container: {
    margin: '8px 16px'
  },
  title: {
    color: '#000000', 
    fontSize: '2rem', 
    width: '100%', 
    fontStyle: 'italic',
    fontWeight: '700'
  },
  subTitle: {
    color: '#000000', 
    fontSize: '1rem', 
    width: '100%', 
    padding: '8px 0',
    fontWeight: '500'
  },
  buttonContainer: {
    padding: '8px 0'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black',
    borderRadius: '8px'
  },
  ballsContainer: {
    position:'relative', 
    padding: '8px 0'
  }
};

function HomePage(props) {
  return (
    <div className="fade-in" style={styles.container}>
      <div style={styles.title}>
        Me vs Yall
      </div>
      <div style={styles.subTitle}>
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
      <div style={styles.ballsContainer}>
        <div style={{top: '35%', left: '27%', position: 'absolute'}}>
          <img className="emoji-image" src={football} alt=""/>
        </div>
        <div style={{top: '35%', left: '37%', position: 'absolute'}}>
          <img className="emoji-image" src={soccer} alt=""/>
        </div>
        <div style={{top: '35%', left: '47%', position: 'absolute'}}>
          <img className="emoji-image" src={basketball} alt=""/>
        </div>
        <div style={{top: '35%', left: '57%', position: 'absolute'}}>
          <img className="emoji-image" src={baseball} alt=""/>
        </div>
        <div style={{top: '35%', left: '67%', position: 'absolute'}}>
          <img className="emoji-image" src={tennis} alt=""/>
        </div>
      </div>
      <div>
        <div style={{top: '50%', left: '60%', position: 'absolute'}}>
          <DirectionsRun style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '60%', left: '75%', position: 'absolute'}}>
          <DirectionsBike style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div className="fast-flash" style={{top: '50%', left: '5%', position: 'absolute'}}>
          <DirectionsRun style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '60%', left: '45%', position: 'absolute'}}>
          <LocalAtm style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '80%', left: '75%', position: 'absolute'}}>
          <img className="emoji-image" src={christmas} alt=""/>
        </div>
        <div style={{top: '70%', left: '60%', position: 'absolute'}}>
          <VideoGame style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '80%', left: '45%', position: 'absolute'}}>
          <Pool style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '70%', left: '30%', position: 'absolute'}}>
          <Rowing style={{color: '#000000', fontSize: 70}}/>
        </div>
        <div style={{top: '90%', left: '60%', position: 'absolute'}}>
          <AccessibleForward style={{color: '#000000', fontSize: 70}}/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;