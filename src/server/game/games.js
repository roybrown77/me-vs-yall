const getGames = () => { return [
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New England Patriots",
//     "weekNo": 6,
//     "startdate": "Thursday, Sept. 7, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
  // {
  //   "awayteam": "New York Jets",
  //   "hometeam": "Buffalo Bills",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Atlanta Falcons",
  //   "hometeam": "Chicago Bears",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Baltimore Ravens",
  //   "hometeam": "Cincinnati Bengals",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Pittsburgh Steelers",
  //   "hometeam": "Cleveland Browns",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Arizona Cardinals",
  //   "hometeam": "Detroit Lions",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Jacksonville Jaguars",
  //   "hometeam": "Houston Texans",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Tampa Bay Buccaneers",
  //   "hometeam": "Miami Dolphins",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Oakland Raiders",
  //   "hometeam": "Tennessee Titans",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Philadelphia Eagles",
  //   "hometeam": "Washington Redskins",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Indianapolis Colts",
  //   "hometeam": "Los Angeles Rams",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Seattle Seahawks",
  //   "hometeam": "Green Bay Packers",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Carolina Panthers",
  //   "hometeam": "San Francisco 49ers",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "New York Giants",
  //   "hometeam": "Dallas Cowboys",
  //   "weekNo": 6,
  //   "startdate": "Sunday, Sept. 10, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "New Orleans Saints",
  //   "hometeam": "Minnesota Vikings",
  //   "weekNo": 6,
  //   "startdate": "Monday, Sept. 11, 2017",
  //   "starttime": "7:10 PM",
  //   "station": "ESPN"
  // },
  // {
  //   "awayteam": "Los Angeles Chargers",
  //   "hometeam": "Denver Broncos",
  //   "weekNo": 6,
  //   "startdate": "Monday, Sept. 11, 2017",
  //   "starttime": "10:20 PM",
  //   "station": "ESPN"
  // },
  // {
  //   "awayteam": "Houston Texans",
  //   "hometeam": "Cincinnati Bengals",
  //   "weekNo": 7,
  //   "startdate": "Thursday, Sept. 14, 2017",
  //   "starttime": "8:25 PM",
  //   "station": "NFLN"
  // },
  // {
  //   "awayteam": "Cleveland Browns",
  //   "hometeam": "Baltimore Ravens",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Buffalo Bills",
  //   "hometeam": "Carolina Panthers",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Arizona Cardinals",
  //   "hometeam": "Indianapolis Colts",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Tennessee Titans",
  //   "hometeam": "Jacksonville Jaguars",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Philadelphia Eagles",
  //   "hometeam": "Kansas City Chiefs",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "New England Patriots",
  //   "hometeam": "New Orleans Saints",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Minnesota Vikings",
  //   "hometeam": "Pittsburgh Steelers",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Chicago Bears",
  //   "hometeam": "Tampa Bay Buccaneers",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Miami Dolphins",
  //   "hometeam": "Los Angeles Chargers",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "New York Jets",
  //   "hometeam": "Oakland Raiders",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Dallas Cowboys",
  //   "hometeam": "Denver Broncos",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Washington Redskins",
  //   "hometeam": "Los Angeles Rams",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "San Francisco 49ers",
  //   "hometeam": "Seattle Seahawks",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Green Bay Packers",
  //   "hometeam": "Atlanta Falcons",
  //   "weekNo": 7,
  //   "startdate": "Sunday, Sept. 17, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "Detroit Lions",
  //   "hometeam": "New York Giants",
  //   "weekNo": 7,
  //   "startdate": "Monday, Sept. 18, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "ESPN"
  // },
  // {
  //   "awayteam": "Los Angeles Rams",
  //   "hometeam": "San Francisco 49ers",
  //   "weekNo": 8,
  //   "startdate": "Thursday, Sept. 21, 2017",
  //   "starttime": "8:25 PM",
  //   "station": "NFLN"
  // },
  // {
  //   "awayteam": "Baltimore Ravens",
  //   "hometeam": "Jacksonville Jaguars",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "9:30 AM",
  //   "station": "TBD"
  // },
  // {
  //   "awayteam": "Denver Broncos",
  //   "hometeam": "Buffalo Bills",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "New Orleans Saints",
  //   "hometeam": "Carolina Panthers",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Pittsburgh Steelers",
  //   "hometeam": "Chicago Bears",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Atlanta Falcons",
  //   "hometeam": "Detroit Lions",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Cleveland Browns",
  //   "hometeam": "Indianapolis Colts",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Tampa Bay Buccaneers",
  //   "hometeam": "Minnesota Vikings",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Houston Texans",
  //   "hometeam": "New England Patriots",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Miami Dolphins",
  //   "hometeam": "New York Jets",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "New York Giants",
  //   "hometeam": "Philadelphia Eagles",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Seattle Seahawks",
  //   "hometeam": "Tennessee Titans",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Cincinnati Bengals",
  //   "hometeam": "Green Bay Packers",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Kansas City Chiefs",
  //   "hometeam": "Los Angeles Chargers",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Oakland Raiders",
  //   "hometeam": "Washington Redskins",
  //   "weekNo": 8,
  //   "startdate": "Sunday, Sept. 24, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "Dallas Cowboys",
  //   "hometeam": "Arizona Cardinals",
  //   "weekNo": 8,
  //   "startdate": "Monday, Sept. 25, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "ESPN"
  // },
  // {
  //   "awayteam": "Chicago Bears",
  //   "hometeam": "Green Bay Packers",
  //   "weekNo": 9,
  //   "startdate": "Thursday, Sept. 28, 2017",
  //   "starttime": "8:25 PM",
  //   "station": "CBS/NFLN/Amazon"
  // },
  // {
  //   "awayteam": "New Orleans Saints",
  //   "hometeam": "Miami Dolphins",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "9:30 AM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Buffalo Bills",
  //   "hometeam": "Atlanta Falcons",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Pittsburgh Steelers",
  //   "hometeam": "Baltimore Ravens",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Cincinnati Bengals",
  //   "hometeam": "Cleveland Browns",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Los Angeles Rams",
  //   "hometeam": "Dallas Cowboys",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Tennessee Titans",
  //   "hometeam": "Houston Texans",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Detroit Lions",
  //   "hometeam": "Minnesota Vikings",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Carolina Panthers",
  //   "hometeam": "New England Patriots",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Jacksonville Jaguars",
  //   "hometeam": "New York Jets",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "San Francisco 49ers",
  //   "hometeam": "Arizona Cardinals",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Philadelphia Eagles",
  //   "hometeam": "Los Angeles Chargers",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "New York Giants",
  //   "hometeam": "Tampa Bay Buccaneers",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Oakland Raiders",
  //   "hometeam": "Denver Broncos",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Indianapolis Colts",
  //   "hometeam": "Seattle Seahawks",
  //   "weekNo": 9,
  //   "startdate": "Sunday, Oct. 1, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "Washington Redskins",
  //   "hometeam": "Kansas City Chiefs",
  //   "weekNo": 9,
  //   "startdate": "Monday, Oct. 2, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "ESPN"
  // },
  //   {
  //   "awayteam": "New England Patriots",
  //   "hometeam": "Tampa Bay Buccaneers",
  //   "weekNo": 10,
  //   "startdate": "Thursday, Oct. 5, 2017",
  //   "starttime": "8:25 PM",
  //   "station": "CBS/NFLN/Amazon"
  // },
  // {
  //   "awayteam": "Buffalo Bills",
  //   "hometeam": "Cincinnati Bengals",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "New York Jets",
  //   "hometeam": "Cleveland Browns",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Carolina Panthers",
  //   "hometeam": "Detroit Lions",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "San Francisco 49ers",
  //   "hometeam": "Indianapolis Colts",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Tennessee Titans",
  //   "hometeam": "Miami Dolphins",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Los Angeles Chargers",
  //   "hometeam": "New York Giants",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Arizona Cardinals",
  //   "hometeam": "Philadelphia Eagles",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Jacksonville Jaguars",
  //   "hometeam": "Pittsburgh Steelers",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Seattle Seahawks",
  //   "hometeam": "Los Angeles Rams",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Baltimore Ravens",
  //   "hometeam": "Oakland Raiders",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Green Bay Packers",
  //   "hometeam": "Dallas Cowboys",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Kansas City Chiefs",
  //   "hometeam": "Houston Texans",
  //   "weekNo": 10,
  //   "startdate": "Sunday, Oct. 8, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "Minnesota Vikings",
  //   "hometeam": "Chicago Bears",
  //   "weekNo": 10,
  //   "startdate": "Monday, Oct. 9, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "ESPN"
  // },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 11,
//     "startdate": "Thursday, Oct. 12, 2017",
//     "starttime": "8:25 PM",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Houston Texans",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Minnesota Vikings",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "New York Jets",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Washington Redskins",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Oakland Raiders",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Denver Broncos",
//     "weekNo": 11,
//     "startdate": "Sunday, Oct. 15, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 11,
//     "startdate": "Monday, Oct. 16, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Oakland Raiders",
//     "weekNo": 12,
//     "startdate": "Thursday, Oct. 19, 2017",
//     "starttime": "8:25 PM",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Chicago Bears",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Cleveland Browns",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Green Bay Packers",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Indianapolis Colts",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Los Angeles Rams",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Miami Dolphins",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Minnesota Vikings",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Pittsburgh Steelers",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Los Angeles Chargers",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "New York Giants",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New England Patriots",
//     "weekNo": 12,
//     "startdate": "Sunday, Oct. 22, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 12,
//     "startdate": "Monday, Oct. 23, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 13,
//     "startdate": "Thursday, Oct. 26, 2017",
//     "starttime": "8:25 PM",
//     "station": "CBS/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Cleveland Browns",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "9:30 AM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Cincinnati Bengals",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "New England Patriots",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New York Jets",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Seattle Seahawks",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Washington Redskins",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Detroit Lions",
//     "weekNo": 13,
//     "startdate": "Sunday, Oct. 29, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 13,
//     "startdate": "Monday, Oct. 30, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "New York Jets",
//     "weekNo": 14,
//     "startdate": "Thursday, Nov. 2, 2017",
//     "starttime": "8:25 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Houston Texans",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "New York Giants",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Seattle Seahawks",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Dallas Cowboys",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Miami Dolphins",
//     "weekNo": 14,
//     "startdate": "Sunday, Nov. 5, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Green Bay Packers",
//     "weekNo": 14,
//     "startdate": "Monday, Nov. 6, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 15,
//     "startdate": "Thursday, Nov. 9, 2017",
//     "starttime": "8:25 PM",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Chicago Bears",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Detroit Lions",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Indianapolis Colts",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Washington Redskins",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Los Angeles Rams",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Denver Broncos",
//     "weekNo": 15,
//     "startdate": "Sunday, Nov. 12, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 15,
//     "startdate": "Monday, Nov. 13, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
  // {
  //   "awayteam": "Tennessee Titans",
  //   "hometeam": "Pittsburgh Steelers",
  //   "weekNo": 16,
  //   "startdate": "Thursday, Nov. 16, 2017",
  //   "starttime": "8:25 PM",
  //   "station": "NBC/NFLN/Amazon"
  // },
  // {
  //   "awayteam": "Detroit Lions",
  //   "hometeam": "Chicago Bears",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Jacksonville Jaguars",
  //   "hometeam": "Cleveland Browns",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Baltimore Ravens",
  //   "hometeam": "Green Bay Packers",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Arizona Cardinals",
  //   "hometeam": "Houston Texans",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Los Angeles Rams",
  //   "hometeam": "Minnesota Vikings",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Washington Redskins",
  //   "hometeam": "New Orleans Saints",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Kansas City Chiefs",
  //   "hometeam": "New York Giants",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "1:00 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Buffalo Bills",
  //   "hometeam": "Los Angeles Chargers",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "4:05 PM",
  //   "station": "FOX"
  // },
  // {
  //   "awayteam": "Cincinnati Bengals",
  //   "hometeam": "Denver Broncos",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "New England Patriots",
  //   "hometeam": "Oakland Raiders",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "4:25 PM",
  //   "station": "CBS"
  // },
  // {
  //   "awayteam": "Philadelphia Eagles",
  //   "hometeam": "Dallas Cowboys",
  //   "weekNo": 16,
  //   "startdate": "Sunday, Nov. 19, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "NBC"
  // },
  // {
  //   "awayteam": "Atlanta Falcons",
  //   "hometeam": "Seattle Seahawks",
  //   "weekNo": 16,
  //   "startdate": "Monday, Nov. 20, 2017",
  //   "starttime": "8:30 PM",
  //   "station": "ESPN"
  // },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Detroit Lions",
//     "weekNo": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "12:30 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Dallas Cowboys",
//     "weekNo": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "4:30 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Washington Redskins",
//     "weekNo": 17,
//     "startdate": "Thursday, Nov. 23, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Cincinnati Bengals",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Indianapolis Colts",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "New England Patriots",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "New York Jets",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Los Angeles Rams",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Oakland Raiders",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Pittsburgh Steelers",
//     "weekNo": 17,
//     "startdate": "Sunday, Nov. 26, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 17,
//     "startdate": "Monday, Nov. 27, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Dallas Cowboys",
//     "weekNo": 18,
//     "startdate": "Thursday, Nov. 30, 2017",
//     "starttime": "8:25 PM",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Chicago Bears",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Green Bay Packers",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Miami Dolphins",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "New York Jets",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Los Angeles Chargers",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Oakland Raiders",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Seattle Seahawks",
//     "weekNo": 18,
//     "startdate": "Sunday, Dec. 3, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Cincinnati Bengals",
//     "weekNo": 18,
//     "startdate": "Monday, Dec. 4, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 19,
//     "startdate": "Thursday, Dec. 7, 2017",
//     "starttime": "8:25 PM",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Cincinnati Bengals",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Cleveland Browns",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Houston Texans",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "Denver Broncos",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "Los Angeles Chargers",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "Los Angeles Rams",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "New York Giants",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Pittsburgh Steelers",
//     "weekNo": 19,
//     "startdate": "Sunday, Dec. 10, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Miami Dolphins",
//     "weekNo": 19,
//     "startdate": "Monday, Dec. 11, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Indianapolis Colts",
//     "weekNo": 20,
//     "startdate": "Thursday, Dec. 14, 2017",
//     "starttime": "8:25 PM",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Detroit Lions",
//     "weekNo": 20,
//     "startdate": "Saturday, Dec. 16, 2017",
//     "starttime": "4:30 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 20,
//     "startdate": "Saturday, Dec. 16, 2017",
//     "starttime": "8:25 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Buffalo Bills",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Baltimore Ravens",
//     "hometeam": "Cleveland Browns",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Jacksonville Jaguars",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Minnesota Vikings",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Philadelphia Eagles",
//     "hometeam": "New York Giants",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Washington Redskins",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Seattle Seahawks",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:05 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New England Patriots",
//     "hometeam": "Pittsburgh Steelers",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Tennessee Titans",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Oakland Raiders",
//     "weekNo": 20,
//     "startdate": "Sunday, Dec. 17, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekNo": 20,
//     "startdate": "Monday, Dec. 18, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Indianapolis Colts",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 21,
//     "startdate": "Saturday, Dec. 23, 2017",
//     "starttime": "4:30 PM",
//     "station": "NFLN"
//   },
//   {
//     "awayteam": "Minnesota Vikings",
//     "hometeam": "Green Bay Packers",
//     "weekNo": 21,
//     "startdate": "Saturday, Dec. 23, 2017",
//     "starttime": "8:30 PM",
//     "station": "NBC"
//   },
//   {
//     "awayteam": "Tampa Bay Buccaneers",
//     "hometeam": "Carolina Panthers",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Chicago Bears",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Detroit Lions",
//     "hometeam": "Cincinnati Bengals",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Miami Dolphins",
//     "hometeam": "Kansas City Chiefs",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "New England Patriots",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Atlanta Falcons",
//     "hometeam": "New Orleans Saints",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Los Angeles Chargers",
//     "hometeam": "New York Jets",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Los Angeles Rams",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Denver Broncos",
//     "hometeam": "Washington Redskins",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "San Francisco 49ers",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:05 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New York Giants",
//     "hometeam": "Arizona Cardinals",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Seattle Seahawks",
//     "hometeam": "Dallas Cowboys",
//     "weekNo": 21,
//     "startdate": "Sunday, Dec. 24, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Pittsburgh Steelers",
//     "hometeam": "Houston Texans",
//     "weekNo": 21,
//     "startdate": "Monday, Dec. 25, 2017",
//     "starttime": "4:30 PM",
//     "station": "NBC/NFLN/Amazon"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 21,
//     "startdate": "Monday, Dec. 25, 2017",
//     "starttime": "8:30 PM",
//     "station": "ESPN"
//   },
//   {
//     "awayteam": "Carolina Panthers",
//     "hometeam": "Atlanta Falcons",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cincinnati Bengals",
//     "hometeam": "Baltimore Ravens",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Green Bay Packers",
//     "hometeam": "Detroit Lions",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Houston Texans",
//     "hometeam": "Indianapolis Colts",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Buffalo Bills",
//     "hometeam": "Miami Dolphins",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Chicago Bears",
//     "hometeam": "Minnesota Vikings",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "New York Jets",
//     "hometeam": "New England Patriots",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Washington Redskins",
//     "hometeam": "New York Giants",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Dallas Cowboys",
//     "hometeam": "Philadelphia Eagles",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Cleveland Browns",
//     "hometeam": "Pittsburgh Steelers",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "New Orleans Saints",
//     "hometeam": "Tampa Bay Buccaneers",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Jacksonville Jaguars",
//     "hometeam": "Tennessee Titans",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "1:00 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Kansas City Chiefs",
//     "hometeam": "Denver Broncos",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "Oakland Raiders",
//     "hometeam": "Los Angeles Chargers",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 PM",
//     "station": "CBS"
//   },
//   {
//     "awayteam": "San Francisco 49ers",
//     "hometeam": "Los Angeles Rams",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   },
//   {
//     "awayteam": "Arizona Cardinals",
//     "hometeam": "Seattle Seahawks",
//     "weekNo": 22,
//     "startdate": "Sunday, Dec. 31, 2017",
//     "starttime": "4:25 PM",
//     "station": "FOX"
//   }
  ];
}

module.exports = {
	getGames
};