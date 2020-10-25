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

const week62020 = `<div>
<i>The NFL bounce back is real.  Teams that lose who furiously focus on getting better eventually start winning.</i>
<br />
<br />
Ravens vs Eagles 30 28
<br />
(186 receiving yds, 182 rushing yds) vs (213 receiving yds, 194 rushing yds, 1 to)
<br />
<br />
Deep ball from Wentz dropped.  Great balanced drive by Ravens.  Ravens d closing pocket fast.  Jackson is fast.  Poor execution by Eagles.  Great Sanders run.  Jackson throwing darts.  Eagles fight in 4th to score tds.  Eagles nearly tie game but 2 point conversion run stopped.
<br />
<br />
Washington vs Giants 19 20
<br />
(280 receiving yds, 86 rushing yds, 2 to) vs (112 receiving yds, 132 rushing yds, 1 to)
<br />
<br />
Alex Smith starts for Washington.  Jones throws a beauty to Slayton.  New end zone celebrations seem to be running into the tunnel a la Bo.  Giants d aggressive.  Houdini fake hand off by Jones for long qb run.  Jones thinks quick to get rid of ball.  Kyle Allen in for Smith.  Sweet throw and catch td from Allen to Thomas.  Bananas interception catch back of end zone by Washington.  Awesome throw and catch from Allen with less than a minute.  Washington lose attempting 2 point conversion for win.
<br />
<br />
Texans vs Titans 36 42
<br />
(335 receiving yds, 92 rushing yds) vs (364 receiving yds, 263 rushing yds, 2 to)
<br />
<br />
Slow start for Texans.  Texans convert 4th and goal.  Tannehill dealing dimes for smart scoring drives.  Watson and Texans d play with urgency to take lead.  Watson to Cobb td a beauty.  Titans retake lead on long run by Henry.  Texans take lead with deep shot by Watson.  Titans payday td drive with less than 2 minutes sends it to OT.  Strong Titans running seals win.
<br />
<br />
Lions vs Jaguars 34 16
<br />
(223 receiving yds, 180 rushing yds, 1 to) vs (243 receiving yds, 44 rushing yds, 2 to)
<br />
<br />
Lions d closing pocket fast.  Minshew underhand throw creative.  Lions pounding the rock well with Peterson and Swift.  Jags offense stalls.  Stafford throwing dimes, nickels and quarters.  Sweet defense line interception by Jags.  Galloday Moss’s somebody.  Minshew juke for td run respectable.
<br />
<br />
Bears vs Panthers 23 16
<br />
(198 receiving yds, 63 rushing yds, 1 to) vs (216 receiving yds, 112 rushing yds, 3 to)
<br />
<br />
Mean Bears d sack for near safety on Bridgewater.  D line celebration exquisite.  Pick on next throw sets up nice td throw by Foles.  Both offenses show balance.  Panthers d getting to Foles.  Bridgewater drops it in a bucket for Moore.  Strong Bears d hold.
<br />
<br />
Falcons vs Vikings 40 23
<br />
(371 receiving yds, 99 rushing yds, 1 to) vs (343 receiving yds, 32 rushing yds, 3 to)
<br />
<br />
Falcons d hyped to get pick off first pass to setup td.  Wild Falcons fumble after big run.  Falcons d stout to stop 4th and goal line.  Mattison hurdle super.  Solid Falcon play calling.  Cousins throwing picks like Halloween candy.  Jefferson td dance unique.  Matt Ryan making good decisions.  Vikings onside kicks are horrible.
<br />
<br />
Broncos vs Patriots 18 12
<br />
(189 receiving yds, 135 rushing yds, 2 to) vs (195 receiving yds, 117 rushing yds, 3 to)
<br />
<br />
Superman sack on Cam blindside.  Both defenses playing well.  Lots of field goals.  Poor blocking by Patriots.  Broncos run game solid.  Patriots d getting to Lock.  Lots of turnovers.  Cam holding ball too long.
<br />
<br />
Browns vs Steelers 7 38
<br />
(165 receiving yds, 75 rushing yds, 2 to) vs (168 receiving yds, 129 rushing yds)
<br />
<br />
Steelers d pick 6.  Steelers d closing pocket fast.  Claypool on a roll with good hands.  Balanced Steeler offensive attack.  Mayfield holding ball too long.  Big Ben in form with throws.  It was over by the half.  Browns play calling could have been more balanced to offset rush.
<br />
<br />
Bengals vs Colts 27 31
<br />
(313 receiving yds, 98 rushing yds, 1 to) vs (371 receiving yds, 59 rushing yds, 2 to)
<br />
<br />
Burrow smart in pocket.  Bengals secondary locking down.  Bengals run game strong.  Sweet deep throw by Rivers sets up td.  Colts play calling improves.  Pascal jump td catch athletically delightful.  Burrow delivers dime from end zone.  Doyle td catch impressive to take lead.  Bates interception electric.  Blackmon interception seals win for Colts.
<br />
<br />
Jets vs Dolphins 0 24
<br />
(186 receiving yds, 115 rushing yds, 1 to) vs (200 receiving yds, 110 rushing yds, 2 to)
<br />
<br />
Fitzy blocking for back is what men do.  Dolphins play smart and hard.  Williams td dance fun.  Both defenses closing pocket fast.  Dirty hit on Fitzy.  Left hand shovel pass from Fitz is for gamers.  Jets run game solid.  Bad Jets play calling.  May interception took concentration.
<br />
<br />
Packers vs Buccaneers 10 38
<br />
(160 receiving yds, 94 rushing yds, 2 to) vs (166 receiving yds, 158 rushing yds)
<br />
<br />
Packers offense starts well balanced and well oiled.  Bucs pick 6 td.  Another Bucs pick sets up td.  Bucs offense sharpening.  Gronk td spike alert.  Bucs d getting to Rodgers.  Sequenced Bucs d line celebration sack on Rodgers creative.
<br />
<br />
Rams vs 49ers 16 24
<br />
(198 receiving yds, 113 rushing yds, 1 to) vs (268 receiving yds, 122 rushing yds)
<br />
<br />
49ers offense starts solid with td drives.  Big holes for Rams runners.  Great td catch by Woods.  Jimmy G making good decisions.  Rams offense stalls.  Goff throws end zone interception.  Fabulous td catch by Reynolds.  Samuel runs hard for first down to seal win for 49ers.
<br />
<br />
Chiefs vs Bills 26 17
<br />
(225 receiving yds, 245 rushing yds, 1 to) vs (122 receiving yds, 84 rushing yds, 1 to)
<br />
<br />
Great td throws from Mahomes to Kelce.  Allen runs too keep drive alive for td.  Well balanced Chiefs offense.  Diggs wide open catch at end of half could have been taken to house.  Both defenses keeping game close.  Chiefs Williams td run celebration super.  Edwards-Helaire running well.  Bills Beasley fight for td.  One handed pick by Chiefs Sorenson seals win.
<br />
<br />
Cardinals vs Cowboys 38 10
<br />
(188 receiving yds, 261 rushing yds, 1 to) vs (266 receiving yds, 97 rushing yds, 4 to)
<br />
<br />
Murray running is a problem for Cowboys d.  Arizona d aggressive.  Zeke fumbles.  Big sack on Dalton.  Murray throws to wide open Kirk 80 yard td.  Cardinals Lamb interception celebration intelligent.  Cowboys turnovers hurt them.  Drake runs 69 yard td.
<br />
<br />
Bye teams
<br />
<br />
Raiders aw
<br />
Saints ns
<br />
Chargers aw
<br />
Seahawks nw
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
Giants ne
<br />
Lions nn
<br />
Bears nn
<br />
Broncos aw
<br />
Patriots ae
<br />
Steelers an
<br />
Dolphins ae
<br />
Buccaneers ns
<br />
49ers nw
<br />
Chiefs aw
<br />
Cardinals nw
<br />
<br />
Tier 2
<br />
<br />
Washington ne
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Texans as
<br />
Titans as
<br />
Falcons ns
<br />
Steelers * an
<br />
Buccaneers * ns
<br />
Cardinals * nw
<br />
<br />
Tier 2
<br />
<br />
Ravens an
<br />
Lions * nn
<br />
Colts as
<br />
<br />
Division rankings (based on top defense & offense)
<br />
<br />
1. NFC West 4
<br />
2. NFC South 4
<br />
3. AFC West 4
<br />
4. NFC North 3
<br />
5. AFC South 3
<br />
6. AFC North 3
<br />
7. AFC East 2
<br />
8. NFC East 2
<br />
<br />
<i>Updated all week until all games are analyzed.</i>
</div>`;

const week52020 = `<div>
<i>The NFL bounce back is real.  Teams that lose who furiously focus on getting better eventually start winning.</i>
<br />
<br />
Buccaneers vs Bears 19 20
<br />
(253 receiving yds, 106 rushing yds, 1 to) vs (243 receiving yds, 35 rushing yds, 1 to)
<br />
<br />
Nice Bucs pick.  Great Brady to Evans td drive.  Long drive by Bucs shows balance.  Foles executes solid drive for td.  Bears offense playing with urgency to end half with another td.  Jones runs well.  Bears defense closing pocket faster second half.  Bucs defense getting to Foles.  Lots of field goals.  Foles touch impressive on final winning field goal drive.  Bears d hold.
<br />
<br />
Jaguars vs Texans 14 30
<br />
(301 receiving yds, 75 rushing yds, 2 to) vs (359 receiving yds, 129 rushing yds, 2 to)
<br />
<br />
Watson runs to keep drive alive for field goal.  Great second drive td by Minshew.  Watson carves defense for second drive td.  Good vision by Minshew.  2 missed field goals in a row by Jags kicker.  Wild Jags fumble in red zone 4th and 1.  Texans defense makes key stop.  Texans seal deal with missed tackle td.
<br />
<br />
Eagles vs Steelers 29 38
<br />
(276 receiving yds, 94 rushing yds, 2 to) vs (239 receiving yds, 136 rushing yds, 1 to)
<br />
<br />
Steelers d closing pocket fast.  Eagles d coming hard.  Big Ben as cool as cucumber in pocket.  Great Steeler play calling.  Eagles Sanders monster run.  Conner is a good back.  Eagles play calling could be better.  Ray Ray almost scored on big end around run.  Nice td touches from Wentz.  Fulgham a monster.  Eagles fight back to nearly win but Steelers d hold and field goal missed.  Claypool td dances not great.
<br />
<br />
Cardinals vs Jets 30 10
<br />
(380 receiving yds, 127 rushing yds, 1 to) vs (195 receiving yds, 123 rushing yds)
<br />
<br />
Murray fleet of foot early.  Great td run by Edmonds.  Flacco starts for Jets.  Flacco with a rare run.  Jets offense stalls.  Jets d bat ball for interception.  Murray accurate.  Nice deep ball by Flacco sets up td.  Balanced Cardinals offense.
<br />
<br />
Rams vs Washington 30 10
<br />
(309 receiving yds, 129 rushing yds, 1 to) vs (111 receiving yds, 38 rushing yds)
<br />
<br />
Well oiled Rams offense very creative.  Antonio Gibson good.  Kyle Allen runs one in.  Rams d close the pocket fast.  Now you see me now you don’t fast.  Allen knocked out game.  Alex Smith in but sacked soon.  Washington d bring heat to Goff.  Cupp & Akers are fast.  Washington needs better play calling against aggressive Rams d.
<br />
<br />
Raiders vs Chiefs 40 32
<br />
(347 receiving yds, 144 rushing yds, 1 to) vs (340 receiving yds, 80 rushing yds, 1 to)
<br />
<br />
Missle thrown to Hill by Mahomes called back due to penalty.  Raidahs came to play with deep shot execution.  Raiders closing pocket but Mahomes dissects.  Mahomes jump shot end zone dance exquisite.  Raiders run game great.  Fun game to watch with all the scoring.  Raiders d gets to Mahomes with sack and key interception to set up td.  Raiders 4th and 1 conversion at Chiefs 44 shows guts to get first down and end game without giving it back to Mahomes.
<br />
<br />
Panthers vs Falcons 23 16
<br />
(313 receiving yds, 124 rushing yds) vs (226 receiving yds, 166 rushing yds, 1 to)
<br />
<br />
Great Falcons first drive.  Bridgewater very sharp in pocket with pressure.  Davis moves pile with strong running.  Great Panther play calling.  Gurley runs great.  Ryan off target and throws pick in end zone.
<br />
<br />
Bengals vs Ravens 3 27
<br />
(183 receiving yds, 70 rushing yds, 3 to) vs (180 receiving yds, 161 rushing yds, 1 to)
<br />
<br />
Ravens d closing pocket fast.  Great hands by Andrews.  Burrow holding ball too long.  Poor pass rush blocking by Bengals.  Ravens offense stalls.
<br />
<br />
Dolphins vs 49ers 43 17
<br />
(350 receiving yds, 94 rushing yds) vs (171 receiving yds, 131 rushing yds, 3 to)
<br />
<br />
Fitzy launching balls deep early.  Dolphins d pressuring Jimmy G.  Balanced Miami offense.  49ers backs running well.  Fitzy very sharp throws.  Miami receivers getting behind 49ers secondary for big plays.  Jimmy making poor throws.  Beathard in for Jimmy.
<br />
<br />
Giants vs Cowboys 34 37
<br />
(222 receiving yds, 89 rushing yds, 1 to) vs (288 receiving yds, 126 rushing yds, 2 to)
<br />
<br />
Giants d getting to Dak.  Creative play calling from Giants.  Zeke running well.  Good Cowboys drive.  Cowboys d sack fumble for td.  Fake field goal results in Giants td that’s brought back due to violation.  Dak making great throws.  Dak td with a Philly Special from Zeke.  Dalton in for Dak due to injured foot.  Cowboys d pressure Jones.  Giants fight with good balanced drive to take lead.  Incredible catch by Gallup sets up game winning field goal by Cowboys.  Pray for Dak.
<br />
<br />
Colts vs Browns 23 32
<br />
(243 receiving yds, 68 rushing yds, 2 to) vs (265 receiving yds, 124 rushing yds, 2 to)
<br />
<br />
Browns offense spreading ball well for very confident first drive.  Colts super on 4th and goal td on first drive.  Good hands by Browns receivers.  Browns d getting to Rivers.  Browns runway td dance exceptional.  Colts Rogers kick return td.  Browns offense stalls until they start running ball again.
<br />
<br />
Vikings vs Seahawks 26 27
<br />
(347 receiving yds, 144 rushing yds, 1 to) vs (340 receiving yds, 80 rushing yds, 1 to)
<br />
<br />
Cook runs well for td.  Vikings d aggressive.  Wilson holding ball too long stalls offense.  Vikings lead 13-0 at half.  Great touch by Wilson for first td.  Great throw by Wilson for second td.  One handed interception by Seattle.  Carson rolls on Vikings d for thunderous td run.  Vikings fight back to take lead.  Seattle stops Vikings 4th and inches in red zone.  Wilson leads drive with less than 2 minutes to end with Metcalf td.
<br />
<br />
Chargers vs Saints 27 30
<br />
(264 receiving yds, 111 rushing yds) vs (325 receiving yds, 95 rushing yds, 1 to)
<br />
<br />
Great balanced Charger play calling.  Nice td throw by Herbert and catch by Allen.  Saints d getting to Herbert.  Great play action deep ball by Herbert to setup td.  Saints offense stalls.  Sanders and Kamara do heavy lifting for Saints.  Wide, wide, wide open Mike Williams scores td.  Crazy sweet catch by Kamara sets up qb td run by Hill to tie it.  Mike Williams Moss’s the whole Saints secondary but field goal to win doinks off bottom bar out.  Saints d hold to win game in OT.
<br />
<br />
Bills vs Titans 16 42
<br />
(285 receiving yds, 95 rushing yds, 3 to) vs (195 receiving yds, 139 rushing yds)
<br />
<br />
Titans d look 100% Fresh with pressure.  Balanced attack by Titans.  Bills offense stalls.  They may need more running and play action.  Spectacular td run finger roll by Tannehill.  Allen can throw lasers.  Henry is a man pounding the rock.
<br />
<br />
Bye teams
<br />
<br />
Broncos aw
<br />
Lions nn
<br />
Packers nn
<br />
Patriots ae
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
Bears nn
<br />
Texans as
<br />
Cardinals nw
<br />
Rams nw
<br />
Panthers ns
<br />
Ravens an
<br />
Dolphins ae
<br />
Titans as
<br />
<br />
Tier 2
<br />
<br />
Buccaneers ns
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Steelers an
<br />
Raiders aw
<br />
Chiefs aw
<br />
Dolphins * ae
<br />
Titans * as
<br />
<br />
Tier 2
<br />
<br />
Texans * as
<br />
Eagles ne
<br />
Cardinals * nw
<br />
Rams * nw
<br />
Giants ne
<br />
Cowboys ne
<br />
Browns as
<br />
Saints ns
<br />
<br />
Division rankings (based on top defense & offense)
<br />
<br />
1. NFC West 4
<br />
2. NFC South 3
<br />
3. AFC South 3
<br />
4. NFC East 3
<br />
5. AFC West 2
<br />
6. AFC North 2
<br />
7. AFC East 2
<br />
8. NFC North 1
</div>`;

const week42020 = `<div>Broncos vs Jets 37 28
<br />
(242 receiving yds, 117 rushing yds, 3 to) vs (246 receiving yds, 129 rushing yds)
<br />
<br />
Darnold keeps play alive for td run.  Jets offense not balanced.  Rypien fearless throws.  Darnold moves sticks to fight.  Broncos run strong.  Rypien throws a beauty td back of end zone.  Jets punter saves a td.  Jets pick 6 then another pick for field goal.  Rypien doesn’t move pocket.  Darnold holds ball too long at end. 
<br />
<br />
Jags vs Bengals 25 33
<br />
(340 receiving yds, 89 rushing yds, 1 to) vs (300 receiving yds, 205 rushing yds, 1 to)
<br />
<br />
Minshew throws into traffic for pick.  Burrow poised to drive ball.  Great td throw by Minshew.  Jags td dance notable.  Great Bengal play calling.  Mixon strong.  Jags bad play calling.
<br />
<br />
Browns vs Cowboys 49 38
<br />
(202 receiving yds, 307 rushing yds) vs (502 receiving yds, 85 rushing yds, 3 to)
<br />
<br />
Garrett sack sets tone for Browns.  Both offenses look good to start.  Great Browns running backs.  Browns d aggressive.  Mayfield locked in.  Cowboys don’t quit.  Great throws from Dak to lead charge.  Brilliant run & td dance by Beckham.
<br />
<br />
Saints vs Lions 35 29
<br />
(246 receiving yds, 164 rushing yds, 1 to) vs (206 receiving yds, 90 rushing yds, 1 to)
<br />
<br />
Amendola runs wild.  Nice throws from Stafford to start fast.  Saints d applying pressure.  Great Saints playing calling to comeback.  Lions don’t run the ball much.  Lions d hold.  Great catch by Hockenson. 
<br />
<br />
Chargers vs Buccaneers 31 38
<br />
(290 receiving yds, 46 rushing yds, 1 to) vs (369 receiving yds, 115 rushing yds, 1 to)
<br />
<br />
Herbert airs it out for td.  Chargers getting to Brady.  Bucs offense stalls.  Chargers fumble at end of half sets up Bucs td.  Bucs fight in second half to take lead.  Herbert interception seals win for Bucs.
<br />
<br />
Colts vs Bears 19 11
<br />
(190 receiving yds, 103 rushing yds) vs (249 receiving yds, 28 rushing yds, 1 to)
<br />
<br />
Colts great first drive.  Defenses close pocket quickly.  Play calling for both teams could be better.  Lots of field goals.
<br />
<br />
Patriots vs Chiefs 10 26
<br />
(190 receiving yds, 185 rushing yds, 4 to) vs (236 receiving yds, 94 rushing yds, 1 to)
<br />
<br />
Chiefs creative on first drive but Pats d hold.  Great running by Chiefs.  Hoyer off target on passes.  Pats d very good.  Pats use heavy run game.  Great third quarter drive by Hoyer but sack fumble in red zone.  Chiefs balanced offense leans on Pats d for tds.  Hoyer throws pick 6.  Stidham throws end zone pick.
<br />
<br />
Eagles vs 49ers 25 20
<br />
(193 receiving yds, 93 rushing yds, 1 to) vs (338 receiving yds, 116 rushing yds, 3 to)
<br />
<br />
Weird pick thrown by Wentz.   Nice td run by Wentz.  Eagles d playing fast.  Fabulous td run and hurdle by Ayuk.  Mullen throws a pick.  Great back of end zone throw by Mullen.  Mullen fumbles.  Wentz takes deep shot for td.  Mullen throws pick 6.  Mullen benched for Beathard who drives for a td.  Beathard nearly throws game winning td in end zone.
<br />
<br />
Falcons vs Packers 16 30
<br />
(285 receiving yds, 78 rushing yds) vs (327 receiving yds, 88 rushing yds)
<br />
<br />
Packers balanced offense slicing up Falcons d.  Falcons d hold 4th and goal line.  Falcons move the ball too slow being behind so much.  Jones run game great.
<br />
<br />
Cardinals vs Panthers 21 31
<br />
(133 receiving yds, 129 rushing yds, 1 to) vs (276 receiving yds, 168 rushing yds, 1 to)
<br />
<br />
Panthers d closing pocket fast.  Great playing calling and runs by Panthers.  Cardinals interception sets up td.  Gorgeous hurdle by Panther receiver.  Teddy makes great throws.  Davis runs well.  Panthers d applying pressure.  Murray runs wild for big yardage.
<br />
<br />
Vikings vs Texans 23 21
<br />
(260 receiving yds, 162 rushing yds) vs (300 receiving yds, 96 rushing yds, 1 to)
<br />
<br />
Bad Texans play calling.  Vikings have a balanced offense.  Big hit by Vikings to force fumble and sets up field goal.  Texans dropping balls.  Cook is special.  Great td drives by Texans.  Watson takes shot deep down field.  Cousins throws great running away from defenders.  Jefferson is the man.  Texans don’t run much.  Texans fight.  Incredible Texan throw and catch 4th and goal was incomplete.
<br />
<br />
Giants vs Rams 9 17
<br />
(190 receiving yds, 136 rushing yds, 1 to) vs (200 receiving yds, 58 rushing yds, 1 to)
<br />
<br />
Clinical Rams offense scores td.  Rams d closing pocket fast.  Bad Giants play calling.  Giants d hold in red zone.  Rams offense stalls.  Better Giants play calling second half.  Good Giants run.  Cupp burns Giants d for td.  Jones turns into Houdini to get away from rush.  Rams d hold with sensational red zone pick.
<br />
<br />
Seahawks vs Dolphins 31 23
<br />
(360 receiving yds, 98 rushing yds, 1 to) vs (315 receiving yds, 103 rushing yds, 2 to)
<br />
<br />
Seahawks deflect pass for pick.  Russell to Metcalf sets up td.  Seahawks d close pocket fast.  Breida runs well.  Dolphins offense stalls in red zone.  Russell extremely accurate.  Carson hurdle notable.  Seahawks d swarm in red zone.  Metcalf scrong.  Scrong means extra strong.  Fitzy runs one in.
<br />
<br />
Bills vs Raiders 30 23
<br />
(288 receiving yds, 63 rushing yds) vs (311 receiving yds, 86 rushing yds, 2 to)
<br />
<br />
Allen efficient for fast tds.  Beasley acrobatic td catch.  Carr beauty deep throw td but penalty brought it back.  Great Raider play calling and receivers.  Bills 4th and 1 at 50 shows confidence.  Great throws by Allen.  Late fumble by Waller.  Allen throws a 60+ yard pass to Diggs.  Super throw and catch by Carr and Renfroe & Agholor.  Carr strip fumble.
<br />
<br />
Ravens vs Washington 31 17
<br />
(208 receiving yds, 144 rushing yds, 2 to) vs (314 receiving yds, 69 rushing yds, 1 to)
<br />
<br />
Ravens d closes pocket fast.  Washington fumble near red zone sets up td.  Haskins poised.  Lamar breaks free for 50 yard td run.  Gibson a great football player.  Lamar extends plays until receivers are open and throws darts.  Washington needs better play calling against aggressive Ravens d.  Haskins fights.
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
Colts as
<br />
Bears nn
<br />
Chiefs aw
<br />
Packers nn
<br />
Giants ne
<br />
Rams nw
<br />
Ravens as
<br />
<br />
Tier 2
<br />
<br />
Eagles ne
<br />
Vikings nn
<br />
Panthers ns
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Broncos aw
<br />
Browns an
<br />
Cowboys ne
<br />
Saints ns
<br />
Buccaneers ns
<br />
<br />
Tier 2
<br />
<br />
Bengals as
<br />
Chargers aw
<br />
Packers * nn
<br />
Panthers ** ns
<br />
Bills ae
<br />
Ravens * as
<br />
Seahawks nw
<br />
<br />
Division rankings (based on top defense & offense)
<br />
<br />
1. AFC South
<br />
2. NFC North
<br />
3. NFC South
<br />
4. AFC West
<br />
5. NFC East
<br />
6. NFC West
<br />
7. AFC East
<br />
8. AFC North
</div>`;

const week32020 = `<div>Bucs vs Broncos 28 10
<br />
(297 receiving yds, 68 rushing yds) vs (229 receiving yds, 42 rushing yds, 1 to)
<br />
<br />
Aggressive Bucs defense. Brady & Co takes advantage. Driscoll unable to convert 3rd downs. Brady comfortable with receivers. Bucs run game present. Broncos defense good.
<br />
<br />
Jets vs Colts 9 36
<br />
(168 receiving yds, 109 rushing yds, 3 to) vs (234 receiving yds, 119 rushing yds)
<br />
<br />
Darnold threw into traffic for picks. Great Jets running backs. Darnold a gamer. Fantastic Colts play calling. Colts d doesn’t quit.
<br />
<br />
Rams vs Bills 32 35
<br />
(321 receiving yds, 167 rushing yds, 2 to) vs (311 receiving yds, 101 rushing yds, 2 to)
<br />
<br />
Bills d came strong and fast early. Bills run game nice. Bills converting 4th and goal shows confidence. Rams offense slow and turns ball over. Allen throws and runs well. He’s like Big Ben. Rams don’t quit to erase big lead. Rams defense gets to Allen late. Allen marches down field to win game.
<br />
<br />
Washington vs Browns 20 34
<br />
(224 receiving yds, 103 rushing yds, 5 to) vs (158 receiving yds, 158 rushing yds)
<br />
<br />
Washington offense starts fast. Washington turns ball over. Browns stick to run. Browns d hunting for picks and sacks. Great Browns play calling. Washington doesn’t quit. Browns backs Chubb and Hunt great. Baker sees the field.
<br />
<br />
Lions vs Cardinals 26 23
<br />
(270 receiving yds, 90 rushing yds) vs (270 receiving yds, 109 rushing yds, 3 to)
<br />
<br />
Hungry Lions team against fly high Cardinals team.  Stafford strong in pocket.  Murray great deep ball.  Lions score in red zone.  Not much run game from either team.  Murray threw interceptions.  Cardinals bad play calling.  Good Lions d.  Golladay returning helped Lions.  Lions field goal ended it.
<br />
<br />
Panthers vs Chargers 21 16
<br />
(235 receiving yds, 81 rushing yds) vs (330 receiving yds, 117 rushing yds, 4 to)
<br />
<br />
Teddy looks good in pocket.  Panthers getting to Herbert.  Panthers drive well but score field goals instead of tds.  Chargers good run game scores td.  Panthers have a balanced offense.  Chargers offense stalls.  Chargers fought and almost won.
<br />
<br />
Raiders vs Patriots 20 36
<br />
(261 receiving yds, 126 rushing yds, 3 to) vs (162 receiving yds, 250 rushing yds, 1 to)
<br />
<br />
Both teams start slow.  Turnovers by both teams.  Both teams run game strong.  Patriots backs very active.  Carr with great touch with receivers but have red zone issues.  Patriots pound the rock.
<br />
<br />
Texans vs Steelers 21 28
<br />
(164 receiving yds, 29 rushing yds, 1 to) vs (237 receiving yds, 169 rushing yds)
<br />
<br />
Great first drive for Texans.  Watson holds ball too long but Steelers d is good.  Steelers balanced attack.  Watson forces pass for interception.  Texans don't run the ball much.  Steelers good play calling late.  Steelers d tenacious.  Steelers run the rock to eat the clock.
<br />
<br />
Dolphins vs Jags 31 13
<br />
(160 receiving yds, 138 rushing yds) vs (275 receiving yds, 72 rushing yds, to)
<br />
<br />
Good Dolphin play calling with heavy run for 7 minute first drive.  Fitzy poised.  Jags slow on offense.  Short week sluggish?  Miami athletic receivers helping Fitzy.  Bad mistakes by Minshew.
<br />
<br />
49ers vs Giants 36 9
<br />
(343 receiving yds, 93 rushing yds) vs (179 receiving yds, 66 rushing yds, 3 to)
<br />
<br />
Giants d fast and aggressive.  49ers pressure up middle causes fumble.  Mullen poised.  49ers d coming in hot.  Great 49er play calling.  Exquisite McKinnon td dance.  Lots of field goals.  Jones doesn’t quit.  49ers got a million great running backs.
<br />
<br />
Bears vs Falcons 30 26
<br />
(316 receiving yds, 130 rushing yds, 1 to) vs (238 receiving yds, 144 rushing yds, 1 to)
<br />
<br />
Bears need better play calling on 3rd down after crossing 50 yard line.  Falcons explosive on first drive.  Bears d aggressive.  Good Falcons run game.  Trubisky scrambles for 50 yards.  Old Saint Nick replaces Trubisky but promptly throws interception in end zone.  Bears fight.  Falcons lose 26-10 lead with 8 minutes left in game.  Falcons poor defense and refusal to run ball to eat clock late while up is reminiscent.  
<br />
<br />
Cowboys vs Seahawks 31 38
<br />
(472 receiving yds, 61 rushing yds, 3 to) vs (315 receiving yds, 117 rushing yds, 1 to)
<br />
<br />
Cowboys first drive ok.  Seahawks deep ball super.  Cowboys safety due to bad kick off return.  Dak in sync with receivers.  Metcalf lost focus on td.  Seahawks defense strong.  Metcalf strong.  Cowboys great play calling.  Cowboy kicker problems.  Cowboys leading late but defense can’t hold.
<br />
<br />
Packers vs Saints 37 30
<br />
(283 receiving yds, 98 rushing yds) vs (288 receiving yds, 122 rushing yds, 1 to)
<br />
<br />
Kamara is psychic with his great running.  Saints d hold Packers to field goals.  Unreal throws by Rodgers sets up tds.  Saints pound the rock.  Saints rely on Kamara without Thomas.  Nice Packers td dance.  Packers d apply great pressure.
<br />
<br />
Titans vs Vikings 31 30
<br />
(321 receiving yds, 134 rushing yds, 1 to) vs (251 receiving yds, 226 rushing yds, 3 to)
<br />
<br />
Vikings sloppy at start but pound the rock to get td on third drive.  Titans drive for fields goals.  Tannehill throws pick in traffic in end zone.  Cousins sees the field at times.  Titans pass a lot.  Cook is great.  Fabulous td dance by Jefferson.  Titans pound rock more to setup play action and big shots down field.  Titans d hold to setup 55 yard field goal to win it after trailing most of game.
<br />
<br />
Bengals vs Eagles 23 23
<br />
(312 receiving yds, 48 rushing yds) vs (225 receiving yds, 175 rushing yds, 2 to)
<br />
<br />
Wentz holds ball too long.  Bengals struggle to drive at start.  Bengals d after Wentz.  Nice td throw by patient Burrow.  Great td throw by Wentz before half.  Bengals d fast.  Eagles offense stalls.  Eagles d hold Bengals from game winning td.  Eagles fight to tie.  Risky head first td run by Wentz.  Eagles discipline and both defense hold to tie game.
<br />
<br />
Chiefs vs Ravens 34 20
<br />
(385 receiving yds, 132 rushing yds, 1 to) vs (97 receiving yds, 158 rushing yds, 1 to)
<br />
<br />
Chiefs d hold Lamar at start.  Great Chiefs play calling to start.  Mahomes shovel pass a beauty.  Ravens kick return superb.  Kelce strong.  Mahomes nimble.  Tyreek great td grab.  Ravens offense limited compared to Chiefs.
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
Dolphins ae
<br />
49ers nw
<br />
Colts as
<br />
Panthers ns
<br />
Buccaneers ns
<br />
<br />
Tier 2
<br />
<br />
Chiefs aw
<br />
Browns an
<br />
Patriots ae
<br />
Steelers an
<br />
Chargers aw
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Bills ae
<br />
Patriots ** ae
<br />
Colts as
<br />
Seahawks nw
<br />
Packers nn
<br />
<br />
Tier 2
<br />
<br />
Chiefs ** aw
<br />
Saints ns
<br />
Cowboys ne
<br />
Vikings nn
<br />
Titans as
<br />
Browns ** an
<br />
Bears nn
<br />
<br />
Division rankings (based on top defense & offense)
<br />
<br />
1. AFC East
<br />
2. NFC South
<br />
3. NFC North
<br />
4. AFC West
<br />
5. AFC North
<br />
6. NFC West
<br />
7. AFC South
<br />
8. NFC East
</div>`;

const week22020 = `<div>49ers vs Jets 31 13
<br />
<br />
Mostert fast.  Jets d fast and mean.  Jets much better run offense but still stalled.  49ers good play calling.  Great 49er rbs.  Darnold a gamer.
<br />
<br />
Bills vs Dolphins 31 28
<br />
<br />
Miami d porous.  Bills throw a lot.  Allen can run.  Fitzy holds ball too long but heats up late.  Good Miami receivers.  Miami bad at goal line.  Bills barely won.
<br />
<br />
Falcons vs Cowboys 39 40
<br />
<br />
Dallas turnovers and explosive Falcons offense caused huge lead.  Cowboys don’t quit.  Well balanced Cowboys offense leads to strong play action and mobile Dak.  Cowboys good d.  Cowboys onside the best most genius common sense style I’ve ever seen with a predictable roll.
<br />
<br />
Jags vs Titans 30 33
<br />
<br />
Jags run game missing.  Titans worked on passing game.  Titans d lax.  Titans balanced attack.  Minshew has great touch under pressure.  Clowney on Titans helps d.
<br />
<br />
Patriots vs Seahawks 30 35
<br />
<br />
Seahawks utilize backs in run and short pass.  Triple option Russ very smart not afraid of deep shots.  Good Pats d.  Cam stares down receivers.  Patriots red zone problems.  Seahawks strong d.  Cam triple option effective.
<br />
<br />
Rams vs Eagles 37 19
<br />
<br />
Strong Rams defense.  Rams offense makes it look easy to do anything.  Rams look like magicians with well balanced play calling.  Eagles bad play calling at times.  Wentz kept fighting but made mistakes.
<br />
<br />
Giants vs Bears 13 17
<br />
<br />
Bears rush strong.  Bears play action effective but offense stalls.  Giants not creative to move sticks.  Bears pass a lot.  Mobile Trubisky.
<br />
<br />
Bengals vs Browns 30 35
<br />
<br />
Browns play action devastating.  Mayfield has great deep ball.  Browns great run & pass game with backs.  Burrow poised.  Browns have a lot of weapons.  Bengals don’t run the ball.  Fast Bengals d.
<br />
<br />
Packers vs Lions 42 21
<br />
<br />
Lions first drive strong.  Packers passing extremely effective.  Packers powerful run sets up play action.  Mobile Rodgers.  Stafford holds on to ball too long and play calling bad.  Lions defense aggressive.  Packers d fast.  Stafford doesn’t quit.
<br />
<br />
Panthers vs Bucs 17 31
<br />
<br />
Teddy not seeing field at start.  Balanced Bucs offense.  Bucs defense mean.  Bucs backs good.  Panthers can’t hold on to ball.  Panthers fight.  Bucs offense stalls.  Panthers could have won if not for turnovers.
<br />
<br />
Vikings vs Colts 11 28
<br />
<br />
Vikings well balanced drive to start but couldn’t punch in td.  Colts run game moves the line.  Vikings offense stall.  Cousins holding ball too long.  Colts difficulty scoring tds.
<br />
<br />
Broncos vs Steelers 21 26
<br />
<br />
Broncos like to run the ball.  Steelers d relentless.  Solid Steeler offensive weapons.  Locke hurt.  Driscoll confidence grew.  Broncos d good.
<br />
<br />
Saints vs Raiders 24 34
<br />
<br />
Saints run ball well.  Raiders d good in red zone.  Saints d tenacious. Raiders good play calling.  Kamara and Waller special.  Solid Raider receivers.  Raiders have fun in end zone.  Good Raiders kicker from 50 to close.
<br />
<br />
Washington vs Cardinals 15 30
<br />
<br />
Murray smart.  Cardinals d fast.  Lots of turnovers.  Washington problems moving sticks.  Great Cardinals receivers.
<br />
<br />
Ravens vs Texans 33 16
<br />
<br />
Lamar with accurate darts and mobile.  Ravens pressuring Watson.  Texans red zone issues.  Ravens d talented.  Watt and defense pressure and sack Jackson many times.  Texans don’t run much.  Ravens run game nice.
<br />
<br />
Chiefs vs Chargers 23 20
<br />
<br />
Herbert poised and strong (see hit on corner).  Chargers d pressuring.  Mahomes scrambles and throws well.  Chargers good play calling.  Chiefs offense stalls.  58 yard Chiefs field goal.  Mahomes experience dodged the bullet.  Chiefs kicker icy.
<br />
<br />
Top defenses (hold to 20 or less well)
<br />
<br />
Tier 1
<br />
<br />
49ers
<br />
Rams
<br />
Giants
<br />
Bears
<br />
Bucs
<br />
Colts
<br />
Cardinals
<br />
Ravens
<br />
<br />
Tier 2
<br />
<br />
Packers
<br />
Steelers
<br />
Raiders
<br />
Chiefs
<br />
Chargers
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Falcons
<br />
Cowboys
<br />
Seahawks
<br />
Rams *
<br />
Browns
<br />
Packers **
<br />
<br />
Tier 2
<br />
<br />
49ers *
<br />
Bills
<br />
Jags
<br />
Titans
<br />
Patriots
<br />
Bengals
<br />
Bucs
<br />
Raiders **
<br />
Cardinals *
<br />
Ravens *
<br />
<br />
Division rankings (based on top defense & offense)
<br />
<br />
1. NFC West
<br />
2. AFC North
<br />
3. AFC East
<br />
4. AFC West
<br />
5. AFC South
<br />
6. NFC South
<br />
7. NFC North
<br />
8. NFC East
</div>`;

const week12020 = `<div>Bears vs Lions 27 23
<br />
<br />
Lions were up 23-13 with 4 minutes and got sloppy. Instead of running the ball on those drives while up they tried to throw, got a loss, missed fg and interception. Trubisky took shots, Bears were physical and didn’t give up. Lions may have been gassed too. It flipped like a switch.
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
Miami fast defense. Patriots running triple option well. Balanced Patriots offense. Stalled Miami offense. Strong Dolphins run game. Good Pats d.
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
Seahawks move chains no matter what. Falcons bad on third and fourth down. Seahawks have fast physical d. Bad Falcons d.
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
Bucs offense on same page at start. Saints d good. Saints offense smart going down field and drawing penalties. Saints balanced offense. Bucs offense not balanced.
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
Colts and Jags heavy run that’s good. Sets up play action. Jags d stout. Rivers makes mistakes but corrects it. Minshew smart. Colts and Jags similar and good. Jags run game special sets up pass.
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
Raiders
<br />
Cowboys
<br />
<br />
Top offenses (score 30 or more well)
<br />
* has top defense
<br />
<br />
Tier 1 (35+)
<br />
<br />
Saints **
<br />
Seahawks
<br />
Ravens *
<br />
Packers
<br />
Vikings
<br />
<br />
Tier 2
<br />
<br />
Raiders **
<br />
Panthers
<br />
Chiefs **
</div>`;

const stats = [
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 7: Cleveland Browns over Cincinnati Bengals`,
    leagueName: 'NFL',
    date: 'October 25, 2020',
    author: 'Mack & Beezie'
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 6",
    content: ReactHtmlParser(week62020),
    leagueName: 'NFL',
    date: 'October 20, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 6: Green Bay Packers over Tampa Bay Buccaneers`,
    leagueName: 'NFL',
    date: 'October 18, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 5",
    content: ReactHtmlParser(week52020),
    leagueName: 'NFL',
    date: 'October 12, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 5: Houston Texans over Jacksonville Jaguars`,
    leagueName: 'NFL',
    date: 'October 11, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 4",
    content: ReactHtmlParser(week42020),
    leagueName: 'NFL',
    date: 'October 7, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 4: Arizona Cardinals over Carolina Panthers`,
    leagueName: 'NFL',
    date: 'October 4, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: false
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 3",
    content: ReactHtmlParser(week32020),
    leagueName: 'NFL',
    date: 'September 30, 2020',
    author: 'Roy B.'
  },
  {
    title: "MACK & BEEZIE'S NOT SO SURE BUT BUT WE'RE FEELING IT LOCK OF THE WEEK",
    content: `Week 3: Cleveland Browns over Washington Washington`,
    leagueName: 'NFL',
    date: 'September 27, 2020',
    author: 'Mack & Beezie',
    lockOfTheWeek: true,
    correct: true
  },
  {
    title: "FAST ANALYSIS OF THE WEEK: NFL WEEK 2",
    content: ReactHtmlParser(week22020),
    leagueName: 'NFL',
    date: 'September 26, 2020',
    author: 'Roy B.'
  },
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
    content: ReactHtmlParser(week12020),
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
    title: 'STAT OF THE WEEK: VIKINGS AND WASHINGTON ARE COUSINS',
    content: `Kirk Cousins played for the Washington Washington last year and currently with the Minnesota Vikings.  As with the 
              Washington, Cousins is on track to throw around 4000 yards, 27 tds, 13 ints and sacked 40 times while losing at least 
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
