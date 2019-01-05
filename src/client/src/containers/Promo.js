import React from 'react';

import Grid from '@material-ui/core/Grid';

import nfl from '../styles/images/nfl.png';
import nba from '../styles/images/nba.png';
import premier from '../styles/images/premier.png';

const styles = {
  title: {
    color: '#f4f7f6', 
    backgroundColor: '#000000',
    fontSize: '3rem', 
    fontStyle: 'italic',
    fontWeight: '700',
    margin: '.5em auto',
    padding: '8px',
    width: '50%'
  },
  promo: {
    color:'darkgreen', 
    fontSize: '4em'
  },
  list: {
    margin: '2em 1em',
    textAlign: 'left',
    fontSize: '2em'
  },
  item: {
    margin: '16px 0'
  },
  logoContainer: {
    marginTop: '2em',
    bottom: '1em'
  }
};

function PromoPage () {
  return (
      <div className="fade-in home-page-container">
        <div style={styles.title}>
          Me vs Yall
        </div>
        {
          false &&
          <div>
            w w w . m e v s y a l l . c o m
          </div>
        }
        {
          false &&
          <div style={styles.promo}>
            $2 off your purchase
          </div>
        }
        {
          true &&
          <div style={styles.list}>
            <div style={styles.item}>
              1.  Go to mevsyall.com and select sport
            </div>
            <div style={styles.item}>
              2.  Tap Log in to Play and enter gmail
            </div>
            <div style={styles.item}>
              3.  Tap on team you believe will win first game
            </div>
            {
              false &&
              <div style={styles.item}>
                4.  Show your name on Leaders page to get $2 off purchase
              </div>
            }
            {
              true &&
              <div style={styles.item}>
                4.  View name on Leaders page
              </div>
            }
            <div style={{...styles.item, marginTop: '2em'}}>
              Complete picking all teams, follow when game starts and enjoy the app!
            </div>
            <div style={styles.item}>
              @mevsyallsports
            </div>
            <Grid style={styles.logoContainer} item xs={12} container spacing={8} justify="center">
              <Grid item xs={4}>
                <img src={nfl} alt=""/>
              </Grid>
              <Grid item xs={5}>
                <img src={premier} alt=""/>
              </Grid>
              <Grid item xs={3}>
                <img src={nba} alt=""/>
              </Grid>
            </Grid>
          </div>
        }
      </div>
    );
}

export default PromoPage;