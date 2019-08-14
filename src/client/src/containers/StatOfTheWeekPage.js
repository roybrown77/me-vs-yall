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
    title: 'FROM ASHY TO CLASSY',
    content: `The Chicago Bears and Houston Texans finished dead last in their division in 2017 but won their divisional crown in 2018.  Could 
              it be the Jets, Bengals, Jaguars, Raiders, Giants, Lions, Bucs or Cardinals turn to do the same in 2019?`,
    leagueName: 'NFL',
    date: 'August 14, 2019',
    author: 'Roy B.'
  },
  {
    title: '1 GAME PER WEEK SEPARATES BAD FROM GOOD',
    content: `There are about 26 weeks in an NBA season (6 months) with 3 games played per week.  Bad teams win 1 while good teams win 2 
              per week.  This season the Bucks are only losing three times a month while Bulls, Knicks, Cavs and Suns are winning 2-3 a month.`,
    leagueName: 'NBA',
    date: 'February 19, 2019',
    author: 'Roy B.'
  },
  {
    title: 'DEEP PLAYOFF EXPERIENCE',
    content: `Head coaches that won the NBA Finals since 1980 (39 years) are Phil Jackson 11 (Bulls/Lakers), Pat Riley 5 (Lakers/Heat), 
              Gregg Popovich 5 (Spurs), Steve Kerr 3 (Warriors), K.C. Jones 2 (Celtics), Rudy Tomjanovich 2 (Rockets), Chuck Daly 2 (Pistons), 
              Erik Spoelstra 2 (Heat), Doc Rivers 1 (Celtics), Larry Brown 1 (Pistons), Tyronn Lue 1 (Cavaliers), Rick Carlisle 1 (Mavericks), 
              Billy Cunningham 1 (76ers), Bill Fitch 1 (Celtics) and Paul Westhead 1 (Lakers).  What's in common?  Most had prior experience going 
              deep into playoffs as a player and/or coach.`,
    leagueName: 'NBA',
    date: 'February 12, 2019',
    author: 'Roy B.'
  },
  {
    title: 'R.E.S.P.E.C.T.',
    content: `What team was 1-15 in 1990, got blown out in their first 2 Super Bowls and head coach was 5-11 in his first season?  The 
              New England Patriots.  Since then they have appeared in 9 Super Bowls in 17 years, won 5 of them and have been to the last 3. 
              They will face the same team (Rams) on the same day (February 3, 2019) they won their first (February 3, 2002).  Brady is 
              the NFL Jordan.`,
    leagueName: 'NFL',
    date: 'February 2, 2019',
    author: 'Roy B.'
  },
  {
    title: 'SCHOOL TIES',
    content: `Sean McVay will be head coaching the Los Angeles Rams in Super Bowl 53 in Atlanta, Georgia.  He also won a state championship 
              in Georgia for the catholic prep school Marist War Eagles (Brookhaven, GA) as a quarterback and defensive back.  NBA analyst 
              Ernie Johnson Jr. and golf legend Bobby Jones also attended Marist.  The Rams QB Jared Goff also played for a catholic 
              prep school with a similar name.  The Marin Wildcats (Kentfield, California).  NFL Hall of Famer Dan Fouts also attended Marin.`,
    leagueName: 'NFL',
    date: 'January 23, 2019',
    author: 'Roy B.'
  },
  {
    title: 'RAMS vs CHIEFS SUPER BOWL IS POSSIBLE',
    content: `Patriots haven't won a road playoff game in 12 years and 3-5 on the road this season.  Chiefs are 7-1 at home.  Rams 
              are 6-2 on the road.  One of the Rams road losses was to the Saints 45-35 where Goff threw for 391 yards and 3 touchdowns.`,
    leagueName: 'NFL',
    date: 'January 16, 2019',
    author: 'Roy B.'
  },
  {
    title: 'HEY YOUNG WORLD EXCEPT FOR OLD SAINT NICK',
    content: `During the Wild Card weekend, every team that won had head coaches that were hired more recently than the coaches they beat. 
              Except the Eagles.  Frank Reich (2018 Colts), Anthony Lynn (2017 Chargers) and Jason Garrett (2011 Cowboys) won.  Doug Pederson 
              (2016 Eagles) was hired 2 years earlier than Matt Nagy (2018 Bears).  It could be Nick Foles and those Jesus candles.`,
    leagueName: 'NFL',
    date: 'January 8, 2019',
    author: 'Roy B.'
  },
  {
    title: 'SUPER BOWL WINNERS ARE LIKE THE WU-TANG GZA SONG...COLD WORLD',
    content: `17 of the last 20 Super Bowls were won by teams in cities with at least 15 inches of snowfall per year.  This 
              year's wintry playoff group includes the Kansas City Chiefs, New England Patriots, Indianapolis Colts, Baltimore Ravens, 
              Chicago Bears and defending champs Philadelphia Eagles.  New Orleans Saints and Seattle Seahawks are also in the the playoffs 
              and 2 of the 3 in last 20 years without much snowfall to win it.`,
    leagueName: 'NFL',
    date: 'December 31, 2018',
    author: 'Roy B.'
  },
  {
    title: 'BAD PANTHERS',
    content: `After starting the season with 6 wins and 2 losses, Cam Newton and the Carolina Panthers have lost 7 games in a row.  4 were 
              on the road while 3 were at home.  They also gave up 20+ points in 6 of them.`,
    leagueName: 'NFL',
    date: 'December 26, 2018',
    author: 'Roy B.'
  },
  {
    title: 'HOLDING DEFENSES',
    content: `3 teams have held opponents to an average less than 15 points per game for the last 4 games.  Colts (12.8), 
              Saints (12.8) and Titans (14.3).  All have won their last 3 out of 4 games.`,
    leagueName: 'NFL',
    date: 'December 18, 2018',
    author: 'Roy B.'
  },
  {
    title: 'VIKINGS AND REDSKINS ARE COUSINS',
    content: `Kirk Cousins played for the Washington Redskins last year and currently with the Minnesota Vikings.  As with the 
              Redskins, Cousins is on track to throw around 4000 yards, 27 tds, 13 ints and sacked 40 times while losing at least 
              half the Vikings games.`,
    leagueName: 'NFL',
    date: 'December 12, 2018',
    author: 'Roy B.'
  },
  {
    title: 'WHY INTERCEPT',
    content: `Giants, Bears, Texans, Broncos and Bills defense have averaged over 1.7 interceptions in past 4 weeks.  Giants lead 
              with 2 per game.`,
    leagueName: 'NFL',
    date: 'December 5, 2018',
    author: 'Roy B.'
  },
  {
    title: 'HOME AND ROAD: ONE WIN LOSS WONDERS',
    content: `Raiders, Giants and Cardinals have 1 home win.  Dolphins, Jets, Browns, Jags, Raiders, Lions, Panthers, Falcons, Bucs and 
              Cardinals have 1 road win.  Dolphins, Texans, Titans, Cowboys, Bears, Saints and Panthers have 1 home loss.  Steelers, 
              Chargers and Rams have 1 road loss.`,
    leagueName: 'NFL',
    date: 'November 29, 2018',
    author: 'Roy B.'
  },
  {
    title: 'NFC WEST RUSH',
    content: `The top 3 league leaders in team rushing yards are all from the NFC West.  Seahawks (1543), Rams (1524) and 49ers (1336).`,
    leagueName: 'NFL',
    date: 'November 21, 2018',
    author: 'Ryan P.'
  },
  {
    title: 'HOME AND ROAD',
    content: `The Browns, Raiders, Packers and 49ers have not won any road games. 
              The Saints and Steelers are undefeated on the road.  The Patriots, 
              Chiefs, Packers, Panthers and Rams are undefeated at home.  The Giants 
              only 2 wins are on the road while they have not won any home games.`,
    leagueName: 'NFL',
    date: 'November 13, 2018',
    author: 'Roy B.'
  },
  {
    title: 'NFC AFC SOUTH STREAKING',
    content: `NFC South reps New Orleans Saints, Carolina Panthers and Atlanta Falcons have a combined win streak of 11 games.  
              The second leading set of divisional teams with that long a win streak are Houston Texans, Tennessee Titans, and 
              Indianapolis Colts from the AFC South with 9.  Impressive since Watson (Texans), Mariota (Titans) and Luck (Colts) were  
              all battling injuries last year.`,
    leagueName: 'NFL',
    date: 'November 7, 2018',
    author: 'Roy B.'
  },
  {
    title: 'BENGALS AND RAVENS D',
    content: `Cincinnati Bengals defense have allowed the most total points (237) while Baltimore Ravens have  
              allowed the 5th fewest (137).  Bengals have a better record at 5-3 while Ravens are 4-4.`,
    leagueName: 'NFL',
    date: 'October 30, 2018',
    author: 'Roy B.'
  },
  {
    title: 'SUPER BOWL QBR',
    content: `For the last 3 Super Bowls, the teams with QBs in top 4 QBR (quarterback rating) played in it.
              The current top 3 in the AFC with winning records are Chargers (Rivers), Chiefs (Mahomes) and Patriots (Brady).  
              The current top 3 in the NFC with winning records are Saints (Brees), Rams (Goff) and Eagles (Wentz).  Bucs (Fitzpatrick) and 
              Falcons (Ryan) are in top 3 if you exclude winning records.  You could blame their defense.`,
    leagueName: 'NFL',
    date: 'October 23, 2018',
    author: 'Roy B.'
  },
  {
    title: 'RUSHING Gs',
    content: `Running backs Todd Gurley II (Rams) and Melvin Gordon (Chargers) have scored 70 and 58 points respectively.  
              They are the only players in the top 10 total points that are NOT placekickers.  Gurley is #1 on that list.  
              Keep in mind this also means the coaching staff/players on these teams are prepared enough to march down 
              the field and consistently score in the red zone.`,
    leagueName: 'NFL',
    date: 'October 16, 2018',
    author: 'Roy B.'
  },
  {
    title: 'BIG SACK ATTACK',
    content: `10 players have at least 5 sacks after 5 weeks.  Leaders include brothers 
              J.J. Watt (Texans) and T.J. Watt (Steelers) with 6.  All have a 
              chance to break the record of 22.5 set by Michael Strahan (Giants).`,
    leagueName: 'NFL',
    date: 'October 10, 2018',
    author: 'Roy B.'
  },
  {
    title: 'GIVE THE KID SOME CRED',
    content: 'Patrick Mahomes and the Kansas City Chiefs are undefeated at 4-0 which includes 3 road wins.',
    leagueName: 'NFL',
    date: 'October 3, 2018',
    author: 'Roy B.'
  },
  {
    title: 'HOME FIELD ADVANTAGE IS REAL',
    content: '16 out of 32 teams have not won on the road after 3 weeks.',
    leagueName: 'NFL',
    date: 'September 25, 2018',
    author: 'Roy B.'
  }
];

function StatOfTheWeekPage () {
     return (
            <div>
                <PageContainer>
                  <div style ={{paddingTop: '12px'}}>
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
                          <div style={styles.container}>
                            <Typography align={'left'} style={styles.contentTitle}>
                              {stat.title}
                            </Typography>
                            <br/>
                            <Typography align={'left'} style={styles.content}>
                              {stat.content}
                            </Typography>
                            <br/>
                            <Typography align={'left'}>
                              - {stat.author}
                            </Typography>
                            <Divider style={{
                              margin: '12px 0',
                              height: '10px',
                              backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
                            }} />
                            <Typography>
                              {stat.leagueName} {stat.date}
                            </Typography>
                          </div>
                        </div>
                    ))}
                  </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;
