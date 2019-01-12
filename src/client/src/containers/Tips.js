import React from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  titleContainer: {
    margin: '0 12px 12px 12px',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  stats: {
    margin: '12px 0',
    backgroundColor: '#ffffff'
  },
  container: {
    padding: '12px'
  },
  main: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contentTitle: {
    color: '#767676'
  },
  content: {
    fontWeight: '600',
    fontSize: '1rem'
  }
};

const stats = [
  {
    title: 'FRIENDS AND FAMILY',
    content: `Beating friends and family on this app will make you even happier.  Invite them.  :D`
  },
  {
    title: 'NO GAME NO PROBLEM',
    content: `Follow each play on Scores page when u can't watch it.`
  },
  {
    title: 'SPREAD',
    content: `The negative number in upper right corner is the Westgate Las Vegas SuperBook spread.  It's what they think that team will win 
              by so the casino doesn't lose money.  This number can change all week as they adjust due to injuries, too many bets on one team 
              and other factors.  Westgate currently has the best overall record in Me vs Yall for NFL/NBA.`
  },
  {
    title: 'HOME TEAMS',
    content: `In the NFL, home teams (team on right) win more than away teams.`
  },
  {
    title: 'NBA',
    content: `It's easier to make picks daily since teams can be streaky.  It's a challenging league to pick winners so study well.`
  },
  {
    title: 'PICKS',
    content: `You can view another person's picks by tapping their name on Leaders page after game starts.  You can also change your pick until game starts.`
  },
  {
    title: 'IN VEGAS',
    content: `When you tap your name on Leaders page, you will see 'in Vegas you would have won: $'.  This is the amount you would win if you had bet 
              $110 on each game and there was a $100 payout.  For example, if I picked 2 games right (teams won by spread) and 1 game wrong 
              (team lost by less than spread) I would have won $200 and lost $110 which would show $90 (winners get back their money too).  If I picked 
              the losing team and winning team did not win by the spread I would win.`
  },
  {
    title: 'NEW FEATURES',
    content: `Log in again to get new app features.`
  },
  {
    title: 'TAGS',
    content: `#sports #football #soccer #basketball #nfl #premierleague #nba #statoftheweek #mevsyall`
  }
];

function TipsPage () {
     return (
            <div>
                <PageContainer>
                  <div style ={{paddingTop: '12px'}}>
                    <div style={styles.titleContainer}>
                      <Typography component="h3" align={'left'} style={styles.title}>
                        Tips
                      </Typography>
                      <Typography align={'left'} style={styles.contentTitle}>
                        Not the Rib Plate Special But still Nutritious
                      </Typography>
                    </div>
                    {
                      stats.map(stat=>(
                        <div key={stat.title.replace(' ', '')} style={styles.stats}>
                          <div style={styles.container}>
                            <Typography align={'left'} style={styles.contentTitle}>
                              {stat.title}
                            </Typography>
                            <br/>
                            <Typography align={'left'} style={styles.content}>
                              {stat.content}
                            </Typography>
                            <Divider style={{
                              margin: '12px 0',
                              height: '10px',
                              backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
                            }} />
                          </div>
                        </div>
                    ))}
                  </div>
                </PageContainer>
            </div>
        );
}

export default TipsPage;
