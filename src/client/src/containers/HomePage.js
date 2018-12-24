import React from 'react';
import { Route } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import christmas from '../styles/images/christmas_tree.png';
import football from '../styles/images/football2.png';
import soccer from '../styles/images/soccer2.png';
import tennis from '../styles/images/tennis.png';
import basketball from '../styles/images/basketball.png';
import baseball from '../styles/images/baseball.png';

const styles = {
  title: {
    color: '#f4f7f6', 
    backgroundColor: '#000000',
    fontSize: '2rem', 
    fontStyle: 'italic',
    fontWeight: '700',
    margin: '16px auto',
    padding: '8px',
    width: '50%'
  },
  subTitle: {
    color: '#000000', 
    fontSize: '1rem', 
    padding: '8px',
    fontWeight: '500',
    margin: '16px 0'
  },
  buttonContainer: {
    padding: '0 8px',
    margin: '16px 0'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black',
    borderRadius: '8px',
    height: '100px'
  },
  ballsContainer: {
    position:'relative', 
    height: '24px'
  },
  emojiContainer: {
    height: '70px',
    position:'relative',
    margin: '40px 0'
  },
  inProgress: {
    width:'12px', 
    height: '12px', 
    position: 'absolute',
    right: '4px',
    bottom: '4px'
  }
};

function HomePage(props) {
  return (
    <div className="fade-in home-page-container">
      <div style={styles.title}>
        Me vs Yall
      </div>
      <div style={styles.subTitle}>
        follow games when u can't watch it and pick winners for cash.  it's free.
      </div>
      <div style={styles.buttonContainer}>
        <Grid container spacing={8}>
          <Grid item xs={6}>
            <Route render={({ history }) => (
                <Button 
                    variant="outlined" 
                    style={{...styles.button, color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                    National Football League
                    {
                      false &&
                      <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#D50A0A'}}></div>
                    }
                </Button>
            )}/>
          </Grid>
          <Grid item xs={6}>
            <Route render={({ history }) => (
                <Button 
                    variant="outlined" 
                    style={{...styles.button, color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                    Premier League Football
                    {
                      false &&
                      <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#3D195B'}}></div>
                    }
                </Button>
            )}/>
          </Grid>
          <Grid item xs={6} style={{margin:'auto'}}>
            <Route render={({ history }) => (
                <Button 
                    variant="outlined" 
                    style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba') }}>
                    National Basketball Association
                    {
                      false &&
                      <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#17408B'}}></div>
                    }
                </Button>
            )}/>
          </Grid>
        </Grid>
      </div>
      <div style={styles.ballsContainer}>
        <div style={{top: '35%', left: '27%', position: 'absolute'}}>
          <img src={football} alt=""/>
        </div>
        <div style={{top: '35%', left: '37%', position: 'absolute'}}>
          <img src={soccer} alt=""/>
        </div>
        <div style={{top: '35%', left: '47%', position: 'absolute'}}>
          <img src={basketball} alt=""/>
        </div>
        <div style={{top: '35%', left: '57%', position: 'absolute'}}>
          <img src={baseball} alt=""/>
        </div>
        <div style={{top: '35%', left: '67%', position: 'absolute'}}>
          <img src={tennis} alt=""/>
        </div>
      </div>
      <div style={styles.emojiContainer}>
        <div style={{left: '77%', position: 'absolute'}}>
          <img src={christmas} alt=""/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;