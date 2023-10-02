import { useEffect } from 'react';
import ReactGA from 'react-ga';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from '../../components/PageContainer';

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
  main: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contentTitle: {
    color: '#767676',
    fontSize: '0.875rem'
  },
  content: {
    fontWeight: '600',
    fontSize: '1rem'
  }
};

const stats = [
  {
    title: 'THRILLER',
    content: `Social platform to feel the thrill of betting without risking a thing.`
  },
  {
    title: 'EVERY WEEK WORLD WIDE',
    content: `Pick winners.  Every week.  Against others around the world.  For free.`
  },
  {
    title: 'SHARK TANK',
    content: `Me vs Yall.  Home of your future Vegas sharks.`
  },
  {
    title: 'FACTS',
    content: `Me vs Yall allows you to practice betting without losing money.  If you can't win here don't bet real money over there.`
  },
  {
    title: 'MATH STUDENTS',
    content: `Pick games are an engaging way to teach students about math, probability and money.`
  },
  {
    title: 'LEADERS',
    content: `As scores change, leaders will move around depending on team picked.  Builds drama.`
  },
  {
    title: 'PICKS',
    content: `You can view another person's picks by tapping their name on Leaders page after game starts.  You can also change your pick until game starts.`
  },
  {
    title: 'NFL',
    content: `Home teams (team on right) win more than away teams.`
  },
  {
    title: `FILM DON'T LIE`,
    content: `Watching a team's last game will give you more insight than just stats and highlights.  You can watch 15 minute versions of games on youtube.com.`
  },
  {
    title: 'NBA',
    content: `It's easier to make picks daily since teams can be streaky.  It's a challenging league to pick winners so study well.`
  },
  {
    title: 'PREMIER LEAGUE',
    content: `Games are normally on NBCSN, NBC, Telemundo and BBC online radio early mornings Eastern Standard Time since their played in England.`
  },
  {
    title: 'SPREAD',
    content: `The negative number in upper right corner is the Westgate or Caesars Las Vegas SuperBook spread.  It's what they think that team will win 
              by so the casino doesn't lose money.  This number can change all week as they adjust due to too many bets on one team, injuries, cold weather, 
              road record, coaching/player experience and other factors.`
  },
  {
    title: 'BET EXAMPLE',
    content: `Patriots vs Cowboys with -3 next to Cowboys means Cowboys would need to win by more than 3 points for you to win money if you select Cowboys 
              (the favorite).  If you select Patriots (the underdog), you can win if Cowboys win by less than 3 points, game ties or Patriots win.  Patriots 
              +3 is the same as Cowboys -3.  If Cowboys win by exactly 3 points normally casinos call this a push back where money is refunded.  These standards always confuses folks initially including me.  Plus sign means Patriots will give up 3 points and minus 
              sign means Cowboys will take 3 points.`
  },
  {
    title: 'IN VEGAS',
    content: `When you tap your name on Leaders page, you will see 'in Vegas you would have won: $'.  This is the amount you would win if you had bet 
              $110 on each game and there was a $100 payout.`
  },
  {
    title: 'vs Spread',
    content: `When you tap 'vs Spread' it shows results against the Vegas spread.`
  },
  {
    title: 'THE CONNECT',
    content: `If picks don't work, check your internet connection.  This is required to save your selection.`
  },
  {
    title: 'TAP TO VIEW PRIZE AND RULES',
    content: `If you don't see 'tap to view prize and rules' then there is no prize for that sport that week.`
  },
  {
    title: 'PRIZE POCKETS',
    content: `Weekly prize amounts depend on what's in our pockets at the time.  Prizes will be sent promptly.`
  },
  {
    title: 'NO GAME NO PROBLEM',
    content: `Follow each play on Scores page when you can't watch it.`
  },
  {
    title: 'FRIENDS AND FAMILY',
    content: `Beating friends and family on this app will make you even happier.  Invite them.  :D`
  },
  {
    title: 'NEW FEATURES',
    content: `Sign in again or clear browser cache to get new features or if problems arise.`
  },
  {
    title: 'TAGS',
    content: `#football #soccer #basketball #boxing #mma #bmx #skate #surf #nfl #premierleague #nba #ufc #premierboxingchampions #xgames #mackandbeezie #lockoftheweek #statoftheweek #oftheweek #mevsyall #mevsyallengineering #sports #fun #crazy #facts #prizes #fans #love #vegas #showmethemoney #litty #merch #thatway #art #picks #free`
  }
];

const About = () => {
  useEffect(() => {
      ReactGA.ga('send', 'pageview', '/about');
      window.scrollTo(0, 0);
  },[]);

  return (
    <div>
        <PageContainer>
          <div style={styles.titleContainer}>
            <Typography component="h3" align={'left'} style={styles.title}>
              About
            </Typography>
            <Typography align={'left'} style={styles.contentTitle}>
              Not The Rib Plate Special But Still Nutritious
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
        </PageContainer>
    </div>
  );
};

export default About;