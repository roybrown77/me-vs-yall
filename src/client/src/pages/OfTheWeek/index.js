import React, { Component } from 'react';
import ReactGA from 'react-ga';

import Divider from '@material-ui/core/Divider';
import ReactHtmlParser from 'react-html-parser';

import angry from '../../styles/images/angry.png';
import money from '../../styles/images/smile-sweat.png';

import PageContainer from '../PageContainer';

const styles = {
  titleContainer: {
    margin: '0 12px 12px 12px',
    paddingTop: '12px'
  },
  title: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '17px',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  stats: {
    marginTop: '12px',
    backgroundColor: '#ffffff'
  },
  container: {
    padding: '12px'
  },
  contentTitle: {
    color: '#767676',
    fontSize: '0.875rem'
  },
  content: {
    fontWeight: '600',
    fontSize: '1rem',
    display: 'flex'
  }
};

const temp = `<div>Bears vs Lions 27 23
<br />
<br />
Bears were up 23-13 with 4 minutes and got sloppy. Instead of running the ball on those drives while up they tried to throw, got a loss, missed fg and interception. Trubisky took shots, Bears were physical and didn’t give up. Lions may have been gassed too. It flipped like a switch.
<br />
<br />
Cardinals vs 49ers 24 20
<br />
<br />
49ers have a good d but Arizona has Deandre Hopkins and other good athletes on offense including qb who runs and throws extremely smart. 49ers play calling is elite but Jimmy G holds on to ball too long and takes bad shots down field. No true loud home field advantage does play some part in home loss. Jimmy G mentality has to improve. I like their backup Mullen mentality more.
<br />
<br />
Chargers vs Bengals 16 13
<br />
<br />
Burrow not scared but makes mistakes. No Bengals run game. Tyrod poised. Chargers run game good. Chargers bad in red zone. Bengals fast, smart d.
<br />
<br />
Browns vs Ravens 6 38
<br />
<br />
Browns made mistakes and bad play calling. Ravens offense explosive. Browns run game elite.
<br />
<br />
Eagles vs Washington 17 27
<br />
<br />
Eagles efficient on offense at start. Washington has fast weapons. Haskins smart. Washington fast d. Eagles bad play calling. Wentz holds on the ball too long.
<br />
<br />
Dolphins vs Patriots 11 21
<br />
<br />
Miami fast defense. Play option Patriots. Balanced Patriots offense. Stalled Miami offense. Strong Dolphins run game. Good Pats d.
<br />
<br />
Steelers vs Giants 26 16
<br />
<br />
Fast, smart Steelers d. Bad Giants play calling. Big Ben body coming back.
<br />
<br />
Seahawks vs Falcons 38 27
<br />
<br />
Seahawks move chains no matter what. Falcons bad on third and fourth down. Seahawks have fast physical d. Bad falcons d.
<br />
<br />
Titans vs Broncos 16 14
<br />
<br />
Fast Broncos d. Titans hold ball too long. Titans control clock with run game. Broncos good offensive weapons.
<br />
<br />
Packers vs Vikings 43 36
<br />
<br />
Packers balanced offense at times. Packers pass bit too much but good feel with receivers. Good Vikings run game. Cousins gets sacked a lot and makes mistakes. Bad Vikings play calling.
<br />
<br />
Cowboys vs Rams 17 20
<br />
<br />
Rams play action for well balanced smart offense. Cowboys offense predictable. Rams d aggressive. Elliot great. Cowboys bad on 3rd down.
<br />
<br />
Jets vs Bills 17 27
<br />
<br />
Bills qb runs a lot and holds ball a lot. Jets can’t move sticks. Both teams look slow.
<br />
<br />
Bucs vs Saints 23 40
<br />
<br />
Bucs offense on same page. Saints d good. Saints offense smart going down field and drawing penalties. Saints balanced offense. Bucs offense not balanced.
<br />
<br />
Raiders vs Panthers 34 30
<br />
<br />
Both good d with run games. Vegas passing game good. Teddy and Carr are smart but not that great til later in game. Defenses had problems with both late. Heavy dependency on MacCaffrey. Vegas well balanced diverse attack.
<br />
<br />
Texans vs Chiefs 20 34
<br />
<br />
Chiefs offense balanced attack. Texans slow start but balanced attack. Watson holds ball too long. Chiefs passing well timed. Good Chiefs run game.
<br />
<br />
Colts vs Jags 20 27
<br />
<br />
Colts and Jags heavy run that’s good. Sets up play action. Jags d stout. Rivers makes mistakes but corrects it. Minshew smart. Colts and jags similar and good. Jags run game special sets up pass.
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
Ravens
<br />
Titans
<br />
Broncos
<br />
Steelers
<br />
Patriots
<br />
<br />
Tier 2
<br />
<br />
Chiefs
<br />
Rams
<br />
Cardinals
<br />
Jags
<br />
<br />
Tier 3
<br />
<br />
Bears
<br />
Washington
<br />
Chargers
<br />
Bengals
<br />
Saints
<br />
49ers
<br />
Cowboys
<br />
<br />
Top offenses (score 30 or more well)
<br />
*** has top defense
<br />
<br />
Seahawks
<br />
Chiefs **
<br />
Ravens *
<br />
Raiders
<br />
Panthers
<br />
Packers
<br />
Saints ***
</div>`

const stats = [
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 2: Los Angeles Rams over Philadelphia Eagles`,
    leagueName: 'NFL',
    date: 'September 20, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 1",
    content: ReactHtmlParser(temp),
    leagueName: 'NFL',
    date: 'September 19, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 1: Detroit Lions over Chicago Bears`,
    leagueName: 'NFL',
    date: 'September 13, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "STAT OF THE WEEK: TODAY WAS A TREY DAY",
    content: `The Boston Celtics and Toronto Raptors are tied up 2 games a piece in the best of 7 playoff series.  Each 
              game has been won by the team that had the best 3 point shooting percentage.  Celtics over Raptors games 1 
              and 2 with 39% and 43% then Raptors over Celtics games 3 and 4 with 32% and 38%.`,
    leagueName: 'NBA',
    date: 'September 7, 2020',
    author: 'Roy B.'
  },
  {
    title: "STAT OF THE WEEK: THAT TEAM UP NORTH",
    content: `The Toronto Raptors are on an 8 game win streak and have won 13 of the last 14.  They are led by Fred VanVleet scoring 21.2 points and 7.8 assists in the current playoffs.`,
    leagueName: 'NBA',
    date: 'August 25, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Portland Trail Blazers over Los Angeles Lakers in Game 2`,
    leagueName: 'NBA',
    date: 'August 16, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `San Francisco 49ers over Kansas City Chiefs`,
    leagueName: 'NFL',
    date: 'February 2, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `San Francisco 49ers over Green Bay Packers`,
    leagueName: 'NFL',
    date: 'January 18, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Kansas City Chiefs over Houston Texans`,
    leagueName: 'NFL',
    date: 'January 10, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Seattle Seahawks over Philadelphia Eagles`,
    leagueName: 'NFL',
    date: 'January 5, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Tennessee Titans over Houston Texans`,
    leagueName: 'NFL',
    date: 'December 14, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Tampa Bay Buccaneers over Indianapolis Colts`,
    leagueName: 'NFL',
    date: 'December 8, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Denver Broncos over Los Angeles Chargers`,
    leagueName: 'NFL',
    date: 'December 1, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "STAT OF THE WEEK: WHAT'S WRONG WITH THE ATLANTA HAWKS?",
    content: `The Atlanta Hawks are on a 7 game losing streak.  They haven't won since November 12th.  That was 2 weeks ago.`,
    leagueName: 'NBA',
    date: 'November 27, 2019',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `San Francisco 49ers over Green Bay Packers`,
    leagueName: 'NFL',
    date: 'November 23, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Houston Texans over Baltimore Ravens`,
    leagueName: 'NFL',
    date: 'November 17, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Tennessee Titans over Kansas City Chiefs`,
    leagueName: 'NFL',
    date: 'November 7, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "STAT OF THE WEEK: LIGHTNING COLTS",
    content: `Jacoby Brissett and the Indianapolis Colts have won 3 straight games.  It's one of the toughest 3 game stretches teams have faced in the league.`,
    leagueName: 'NFL',
    date: 'October 31, 2019',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Miami Dolphins over New York Jets`,
    leagueName: 'NFL',
    date: 'October 31, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Philadelphia Eagles over Buffalo Bills`,
    leagueName: 'NFL',
    date: 'October 27, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "STAT OF THE WEEK: NFC WEST ROAD GAMES",
    content: `The NFC West (49ers, Seahawks, Rams and Cardinals) have a combined record of 9 wins and 2 losses on the road.`,
    leagueName: 'NFL',
    date: 'October 24, 2019',
    author: 'Roy B.'
  },
  {
    title: "STAT OF THE WEEK: WE DON'T HAVE TO KICK IT",
    content: `Who are the only top 10 scoring players that are not field goal kickers?  Panther's running back Christian McCaffrey (54) at #4 and Packer's running back Aaron Jones (48) at #10.`,
    leagueName: 'NFL',
    date: 'October 17, 2019',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Denver Broncos over Kansas City Chiefs`,
    leagueName: 'NFL',
    date: 'October 17, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Seattle Seahawks over Cleveland Browns`,
    leagueName: 'NFL',
    date: 'October 10, 2019',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: 'STAT OF THE WEEK: UNDEFEATED',
    content: `Patriots and 49ers are currently undefeated.  Bills, Chiefs, Packers, Panthers and Seahawks are also perfect on the road while Saints 
              and Vikings are untouchable at home.`,
    leagueName: 'NFL',
    date: 'October 9, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: 85 REVENGE',
    content: `After 4 games, the Chicago Bears have 17 sacks with a 3-1 record.  That's about a sack per quarter.  The only team with more sacks 
              and wins are the New England Patriots with 18 sacks and a record of 4-0.  A rematch of the 1985 Super Bowl would be epic with Mack vs Brady.`,
    leagueName: 'NFL',
    date: 'October 3, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: SUPER BOWL VS NFC NORTH',
    content: `Since 1967, only the Buffalo Bills have been to the Super Bowl 4 times in a row.  The New England Patriots could do it in 2019 after 
              facing the NFC South (2016 Falcons), NFC East (2017 Eagles) and NFC West (2018 Rams).  Will it be against the NFC North (Bears, Packers, 
              Vikings or Lions)?  It's also a division they've never beaten in the SB.`,
    leagueName: 'NFL',
    date: 'August 28, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: NO DROPS',
    content: `The Houston Texans wide receiver DeAndre Hopkins didn't drop one pass in 2018 to set a record.  He ended with 115 catches and 11 tds.`,
    leagueName: 'NFL',
    date: 'August 21, 2019',
    author: 'Ryan P.'
  },
  {
    title: 'STAT OF THE WEEK: FROM ASHY TO CLASSY',
    content: `The Chicago Bears and Houston Texans finished dead last in their division in 2017 but won their divisional crown in 2018.  Could 
              it be the Jets, Bengals, Jaguars, Raiders, Giants, Lions, Bucs or Cardinals turn to do the same in 2019?`,
    leagueName: 'NFL',
    date: 'August 14, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: 1 GAME PER WEEK SEPARATES BAD FROM GOOD',
    content: `There are about 26 weeks in an NBA season (6 months) with 3 games played per week.  Bad teams win 1 while good teams win 2 
              per week.  This season the Bucks are only losing three times a month while Bulls, Knicks, Cavs and Suns are winning 2-3 a month.`,
    leagueName: 'NBA',
    date: 'February 19, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: DEEP PLAYOFF EXPERIENCE',
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
    title: 'STAT OF THE WEEK: R.E.S.P.E.C.T.',
    content: `What team was 1-15 in 1990, got blown out in their first 2 Super Bowls and head coach was 5-11 in his first season?  The 
              New England Patriots.  Since then they have appeared in 9 Super Bowls in 17 years, won 5 of them and have been to the last 3. 
              They will face the same team (Rams) on the same day (February 3, 2019) they won their first (February 3, 2002).  Brady is 
              the NFL Jordan.`,
    leagueName: 'NFL',
    date: 'February 2, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: SCHOOL TIES',
    content: `Sean McVay will be head coaching the Los Angeles Rams in Super Bowl 53 in Atlanta, Georgia.  He also won a state championship 
              in Georgia for the catholic prep school Marist War Eagles (Brookhaven, GA) as a quarterback and defensive back.  NBA analyst 
              Ernie Johnson Jr. and golf legend Bobby Jones also attended Marist.  The Rams QB Jared Goff also played for a catholic 
              prep school with a similar name.  The Marin Wildcats (Kentfield, California).  NFL Hall of Famer Dan Fouts also attended Marin.`,
    leagueName: 'NFL',
    date: 'January 23, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: RAMS vs CHIEFS SUPER BOWL IS POSSIBLE',
    content: `Patriots haven't won a road playoff game in 12 years and 3-5 on the road this season.  Chiefs are 7-1 at home.  Rams 
              are 6-2 on the road.  One of the Rams road losses was to the Saints 45-35 where Goff threw for 391 yards and 3 touchdowns.`,
    leagueName: 'NFL',
    date: 'January 16, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: HEY YOUNG WORLD EXCEPT FOR OLD SAINT NICK',
    content: `During the Wild Card weekend, every team that won had head coaches that were hired more recently than the coaches they beat. 
              Except the Eagles.  Frank Reich (2018 Colts), Anthony Lynn (2017 Chargers) and Jason Garrett (2011 Cowboys) won.  Doug Pederson 
              (2016 Eagles) was hired 2 years earlier than Matt Nagy (2018 Bears).  It could be Nick Foles and those Jesus candles.`,
    leagueName: 'NFL',
    date: 'January 8, 2019',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: SUPER BOWL WINNERS ARE LIKE THE WU-TANG GZA SONG...COLD WORLD',
    content: `17 of the last 20 Super Bowls were won by teams in cities with at least 15 inches of snowfall per year.  This 
              year's wintry playoff group includes the Kansas City Chiefs, New England Patriots, Indianapolis Colts, Baltimore Ravens, 
              Chicago Bears and defending champs Philadelphia Eagles.  New Orleans Saints and Seattle Seahawks are also in the the playoffs 
              and 2 of the 3 in last 20 years without much snowfall to win it.`,
    leagueName: 'NFL',
    date: 'December 31, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: BAD PANTHERS',
    content: `After starting the season with 6 wins and 2 losses, Cam Newton and the Carolina Panthers have lost 7 games in a row.  4 were 
              on the road while 3 were at home.  They also gave up 20+ points in 6 of them.`,
    leagueName: 'NFL',
    date: 'December 26, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: HOLDING DEFENSES',
    content: `3 teams have held opponents to an average less than 15 points per game for the last 4 games.  Colts (12.8), 
              Saints (12.8) and Titans (14.3).  All have won their last 3 out of 4 games.`,
    leagueName: 'NFL',
    date: 'December 18, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: VIKINGS AND REDSKINS ARE COUSINS',
    content: `Kirk Cousins played for the Washington Redskins last year and currently with the Minnesota Vikings.  As with the 
              Redskins, Cousins is on track to throw around 4000 yards, 27 tds, 13 ints and sacked 40 times while losing at least 
              half the Vikings games.`,
    leagueName: 'NFL',
    date: 'December 12, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: WHY INTERCEPT',
    content: `Giants, Bears, Texans, Broncos and Bills defense have averaged over 1.7 interceptions in past 4 weeks.  Giants lead 
              with 2 per game.`,
    leagueName: 'NFL',
    date: 'December 5, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: HOME AND ROAD: ONE WIN LOSS WONDERS',
    content: `Raiders, Giants and Cardinals have 1 home win.  Dolphins, Jets, Browns, Jags, Raiders, Lions, Panthers, Falcons, Bucs and 
              Cardinals have 1 road win.  Dolphins, Texans, Titans, Cowboys, Bears, Saints and Panthers have 1 home loss.  Steelers, 
              Chargers and Rams have 1 road loss.`,
    leagueName: 'NFL',
    date: 'November 29, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: NFC WEST RUSH',
    content: `The top 3 league leaders in team rushing yards are all from the NFC West.  Seahawks (1543), Rams (1524) and 49ers (1336).`,
    leagueName: 'NFL',
    date: 'November 21, 2018',
    author: 'Ryan P.'
  },
  {
    title: 'STAT OF THE WEEK: HOME AND ROAD',
    content: `The Browns, Raiders, Packers and 49ers have not won any road games. 
              The Saints and Steelers are undefeated on the road.  The Patriots, 
              Chiefs, Packers, Panthers and Rams are undefeated at home.  The Giants 
              only 2 wins are on the road while they have not won any home games.`,
    leagueName: 'NFL',
    date: 'November 13, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: NFC AFC SOUTH STREAKING',
    content: `NFC South reps New Orleans Saints, Carolina Panthers and Atlanta Falcons have a combined win streak of 11 games.  
              The second leading set of divisional teams with that long a win streak are Houston Texans, Tennessee Titans, and 
              Indianapolis Colts from the AFC South with 9.  Impressive since Watson (Texans), Mariota (Titans) and Luck (Colts) were  
              all battling injuries last year.`,
    leagueName: 'NFL',
    date: 'November 7, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: BENGALS AND RAVENS D',
    content: `Cincinnati Bengals defense have allowed the most total points (237) while Baltimore Ravens have  
              allowed the 5th fewest (137).  Bengals have a better record at 5-3 while Ravens are 4-4.`,
    leagueName: 'NFL',
    date: 'October 30, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: SUPER BOWL QBR',
    content: `For the last 3 Super Bowls, the teams with QBs in top 4 QBR (quarterback rating) played in it.
              The current top 3 in the AFC with winning records are Chargers (Rivers), Chiefs (Mahomes) and Patriots (Brady).  
              The current top 3 in the NFC with winning records are Saints (Brees), Rams (Goff) and Eagles (Wentz).  Bucs (Fitzpatrick) and 
              Falcons (Ryan) are in top 3 if you exclude winning records.  You could blame their defense.`,
    leagueName: 'NFL',
    date: 'October 23, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: RUSHING Gs',
    content: `Running backs Todd Gurley II (Rams) and Melvin Gordon (Chargers) have scored 70 and 58 points respectively.  
              They are the only players in the top 10 total points that are NOT placekickers.  Gurley is #1 on that list.  
              Keep in mind this also means the coaching staff/players on these teams are prepared enough to march down 
              the field and consistently score in the red zone.`,
    leagueName: 'NFL',
    date: 'October 16, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: BIG SACK ATTACK',
    content: `10 players have at least 5 sacks after 5 weeks.  Leaders include brothers 
              J.J. Watt (Texans) and T.J. Watt (Steelers) with 6.  All have a 
              chance to break the record of 22.5 set by Michael Strahan (Giants).`,
    leagueName: 'NFL',
    date: 'October 10, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: GIVE THE KID SOME CRED',
    content: 'Patrick Mahomes and the Kansas City Chiefs are undefeated at 4-0 which includes 3 road wins.',
    leagueName: 'NFL',
    date: 'October 3, 2018',
    author: 'Roy B.'
  },
  {
    title: 'STAT OF THE WEEK: HOME FIELD ADVANTAGE IS REAL',
    content: '16 out of 32 teams have not won on the road after 3 weeks.',
    leagueName: 'NFL',
    date: 'September 25, 2018',
    author: 'Roy B.'
  }
];

class OfTheWeek extends Component {
  componentDidMount() {
      ReactGA.ga('send', 'pageview', '/oftheweek');
      window.scrollTo(0, 0);
  }
  
  render() {
    return (
      <div>
        <PageContainer>
          <div style={{textAlign: 'left', lineHeight: '1.5', letterSpacing: '0.01071em', color: 'rgba(0, 0, 0, 0.87)'}}>
            <div style={styles.titleContainer}>
              <div component="h3" style={styles.title}>
                #$%@ of the Week
              </div>
              <div style={styles.contentTitle}>
                That Might Help You With Picks And In Life
              </div>
            </div>
            {
              stats.map((stat,index)=>(
                <div key={index} style={styles.stats}>
                  <div style={styles.container}>
                    <div style={styles.contentTitle}>
                      {stat.title}
                    </div>
                    <br/>
                    <div style={styles.content}>
                      <div style={{margin:'auto 0'}}>{stat.content}</div>
                      {!stat.lockOfTheWeek ? null : stat.correct ? <div style={{paddingLeft:'8px'}}><img style={{width:'40px'}} src={money} alt=""/></div> : <div style={{paddingLeft:'8px'}}><img style={{width:'40px'}} src={angry} alt=""/></div> }
                    </div>
                    <br/>
                    <div style={{fontSize: '0.875rem'}}>
                      - {stat.author}
                    </div>
                    <Divider style={{
                      margin: '12px 0',
                      height: '10px',
                      backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
                    }} />
                    <div style={{textAlign: 'center', fontSize: '0.875rem'}}>
                      {stat.leagueName} {stat.date}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </PageContainer>
      </div>
    );
  }
}

export default OfTheWeek;
