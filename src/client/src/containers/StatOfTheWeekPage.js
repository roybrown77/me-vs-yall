import React from 'react';

import Paper from '@material-ui/core/Paper';
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
    margin: '12px 12px 0 12px'
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
    title: 'NFC AFC SOUTH',
    content: `NFC South reps New Orleans Saints, Carolina Panthers and Atlanta Falcons have a combined win streak of 11 games.  
              The second leading set of divisional teams with that long a win streak are Houston Texans, Tennessee Titans, and 
              Indianapolis Colts from the AFC South with 9.  Impressive since Watson (Texans), Mariota (Titans) and Luck (Colts) were  
              all battling injuries last year.`,
    leagueName: 'NFL',
    date: 'November 7, 2018',
  },
  {
    title: 'BENGALS AND RAVENS',
    content: `Cincinnati Bengals defense have allowed the most total points (237) while Baltimore Ravens have  
              allowed the 5th fewest (137).  Bengals have a better record at 5-3 while Ravens are 4-4.`,
    leagueName: 'NFL',
    date: 'October 30, 2018',
  },
  {
    title: 'SUPER BOWL QBR',
    content: `For the last 3 Super Bowls, the teams with QBs in top 4 QBR (quarterback rating) played in it.
              The current top 3 in the AFC with winning records are Chargers (Rivers), Chiefs (Mahomes) and Patriots (Brady).  
              The current top 3 in the NFC with winning records are Saints (Brees), Rams (Goff) and Eagles (Wentz).  Bucs (Fitzpatrick) and 
              Falcons (Ryan) are in top 3 if you exclude winning records.  You could blame their defense.`,
    leagueName: 'NFL',
    date: 'October 23, 2018',
  },
  {
    title: 'RUSHING Gs',
    content: `Running backs Todd Gurley II (Rams) and Melvin Gordon (Chargers) have scored 70 and 58 points respectively.  
              They are the only players in the top 10 total points that are NOT placekickers.  Gurley is #1 on that list.  
              Keep in mind this also means the coaching staff/players on these teams are prepared enough to march down 
              the field and consistently score in the red zone.`,
    leagueName: 'NFL',
    date: 'October 16, 2018',
  },
  {
    title: 'BIG SACK ATTACK',
    content: `10 players have at least 5 sacks after 5 weeks.  Leaders include brothers 
              J.J. Watt (Texans) and T.J. Watt (Steelers) with 6.  All have a 
              chance to break the record of 22.5 set by Michael Strahan (Giants).`,
    leagueName: 'NFL',
    date: 'October 10, 2018',
  },
  {
    title: 'GIVE THE KID SOME CRED',
    content: 'Patrick Mahomes and the Kansas City Chiefs are undefeated at 4-0 which includes 3 road wins.',
    leagueName: 'NFL',
    date: 'October 3, 2018',
  },
  {
    title: 'HOME FIELD ADVANTAGE IS REAL',
    content: '16 out of 32 teams have not won on the road after 3 weeks.',
    leagueName: 'NFL',
    date: 'September 25, 2018',
  }
];

function StatOfTheWeekPage () {
     return (
            <div>
                <PageContainer>
                  <div style ={{padding: '12px 0'}}>
                    <div style={styles.titleContainer}>
                      <Typography component="h3" align={'left'} style={styles.title}>
                        Stat of the Week
                      </Typography>
                      <Typography align={'left'} style={styles.contentTitle}>
                        That Might Help You With Picks And In Life
                      </Typography>
                    </div>
                    {
                      stats.map(stat=>(
                        <div key={stat.title.replace(' ', '')} style={styles.stats}>
                          <Paper style={styles.container} elevation={1}>
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
                            <Typography>
                              {stat.leagueName} {stat.date}
                            </Typography>
                          </Paper>
                        </div>
                    ))}
                  </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;
