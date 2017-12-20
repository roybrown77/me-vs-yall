const getTeams = () => { return [
    {
        _id: "19823783734d1d04a1b39001",
        location: 'Kansas City',
        shortLocation: "KC",
        name: "Chiefs",
        color: "#CA2430",
        stadiumName: "Arrowhead Stadium",
        stadiumCity: "Kansas City, MO"
    },
    {
        _id: "19823783734d1d04a1b39002",
        location: 'New England',
        shortLocation: "NE",
        name: "Patriots",
        color: "#0A2342",
        stadiumName: "Gillette Stadium",
        stadiumCity: "Foxborough, MA"
    },
    {
        _id: "19823783734d1d04a1b39003",
        location: 'Atlanta',
        shortLocation: "ATL",
        name: "Falcons",
        color: "#A71930",
        stadiumName: "Mercedes-Benz Stadium",
        stadiumCity: "Atlanta, GA"
    },
    {
        _id: "19823783734d1d04a1b39004",
        location: 'Chicago',
        shortLocation: "CHI",
        name: "Bears",
        color: "#00143F",
        stadiumName: "Soldier Field",
        stadiumCity: "Chicago, IL"
    },
    {
        _id: "19823783734d1d04a1b39005",
        location: 'Arizona',
        shortLocation: "ARI",
        name: "Cardinals",
        color: "#97233F",
        stadiumName: "University of Phoenix Stadium",
        stadiumCity: "Glendale, AZ"
    },
    {
        _id: "19823783734d1d04a1b39006",
        location: 'Dallas',
        shortLocation: "DAL",
        name: "Cowboys",
        color: "#0C264C",
        stadiumName: "AT&T Stadium",
        stadiumCity: "Arlington, TX"
    },
    {
        _id: "19823783734d1d04a1b39007",
        location: 'Houston',
        shortLocation: "HOU",
        name: "Texans",
        color: "#00143F",
        stadiumName: "NRG Stadium",
        stadiumCity: "Houston, TX"
    },
    {
        _id: "19823783734d1d04a1b39008",
        location: 'Carolina',
        shortLocation: "CAR",
        name: "Panthers",
        color: "#0085CA",
        stadiumName: "Bank of America Stadium",
        stadiumCity: "Charlotte, NC"
    },
    {
        _id: "19823783734d1d04a1b39009",
        location: 'Miami',
        shortLocation: "MIA",
        name: "Dolphins",
        color: "#0091A0",
        stadiumName: "Hard Rock Stadium",
        stadiumCity: "Miami, FL"
    },
    {
        _id: "19823783734d1d04a1b3900a",
        location: 'Minnesota',
        shortLocation: "MIN",
        name: "Vikings",
        color: "#4F2E84",
        stadiumName: "U.S. Bank Stadium",
        stadiumCity: "Minneapolis, MN"
    },
    {
        _id: "19823783734d1d04a1b3900b",
        location: 'Buffalo',
        shortLocation: "BUF",
        name: "Bills",
        color: "#00338D",
        stadiumName: "New Era Field",
        stadiumCity: "Buffalo, NY"
    },
    {
        _id: "19823783734d1d04a1b3900c",
        location: 'Washington',
        shortLocation: "WAS",
        name: "Redskins",
        color: "#7C1415",
        stadiumName: "FedExField",
        stadiumCity: "Landover, MD"
    },
    {
        _id: "19823783734d1d04a1b3900d",
        location: 'Baltimore',
        shortLocation: "BAL",
        name: "Ravens",
        color: "#241773",
        stadiumName: "M&T Bank Stadium",
        stadiumCity: "Baltimore, MD"
    },
    {
        _id: "19823783734d1d04a1b3900e",
        location: 'Jacksonville',
        shortLocation: "JAC",
        name: "Jaguars",
        color: "#136677",
        stadiumName: "EverBank Field",
        stadiumCity: "Jacksonville, FL"
    },
    {
        _id: "19823783734d1d04a1b3900f",
        location: 'New Orleans',
        shortLocation: "NO",
        name: "Saints",
        color: "#A08A58",
        stadiumName: "Mercedes-Benz Superdome",
        stadiumCity: "New Orleans, LA"
    },
    {
        _id: "19823783734d1d04a1b39010",
        location: 'Cleveland',
        shortLocation: "CLE",
        name: "Browns",
        color: "#FB4F14",
        stadiumName: "FirstEnergy Stadium",
        stadiumCity: "Cleveland, OH"
    },
    {
        _id: "19823783734d1d04a1b39011",
        location: 'Philadelphia',
        shortLocation: "PHI",
        name: "Eagles",
        color: "#014A53",
        stadiumName: "Lincoln Financial Field",
        stadiumCity: "Philadelphia, PA"
    },
    {
        _id: "19823783734d1d04a1b39012",
        location: 'Green Bay',
        shortLocation: "GB",
        name: "Packers",
        color: "#24423c",
        stadiumName: "Lambeau Field",
        stadiumCity: "Green Bay, WI"
    },
    {
        _id: "19823783734d1d04a1b39013",
        location: 'Denver',
        shortLocation: "DEN",
        name: "Broncos",
        color: "#FB4F14",
        stadiumName: "Sports Authority Field",
        stadiumCity: "Denver, CO"
    },
    {
        _id: "19823783734d1d04a1b39014",
        location: 'Pittsburgh',
        shortLocation: "PIT",
        name: "Steelers",
        color: "#FFC20E",
        stadiumName: "Heinz Field",
        stadiumCity: "Pittsburgh, PA"
    },
    {
        _id: "19823783734d1d04a1b39015",
        location: 'New York',
        shortLocation: "NY",
        name: "Giants",
        color: "#192E6C",
        stadiumName: "MetLife Stadium",
        stadiumCity: "East Rutherford, NJ"
    },
    {
        _id: "19823783734d1d04a1b39016",
        location: 'Tampa Bay',
        shortLocation: "TB",
        name: "Buccaneers",
        color: "#D40909",
        stadiumName: "Raymond James Stadium",
        stadiumCity: "Tampa, FL"
    },
    {
        _id: "19823783734d1d04a1b39017",
        location: 'Cincinnati',
        shortLocation: "CIN",
        name: "Bengals",
        color: "#FB4F14",
        stadiumName: "Paul Brown Stadium",
        stadiumCity: "Cincinnati, OH"
    },
    {
        _id: "19823783734d1d04a1b39018",
        location: 'San Francisco',
        shortLocation: "SF",
        name: "49ers",
        color: "#C9243F",
        stadiumName: "Levi's Stadium",
        stadiumCity: "Santa Clara, CA"
    },
    {
        _id: "19823783734d1d04a1b39019",
        location: 'Tennessee',
        shortLocation: "TEN",
        name: "Titans",
        color: "#4095D1",
        stadiumName: "Nissan Stadium",
        stadiumCity: "Nashville, TN"
    },
    {
        _id: "19823783734d1d04a1b3901a",
        location: 'New York',
        shortLocation: "NY",
        name: "Jets",
        color: "#203731",
        stadiumName: "MetLife Stadium",
        stadiumCity: "East Rutherford, NJ"
    },
    {
        _id: "19823783734d1d04a1b3901b",
        location: 'Los Angeles',
        shortLocation: "LA",
        name: "Rams",
        color: "#95774C",
        stadiumName: "Los Angeles Stadium",
        stadiumCity: "Inglewood, CA"
    },
    {
        _id: "19823783734d1d04a1b3901c",
        location: 'Oakland',
        shortLocation: "OAK",
        name: "Raiders",
        color: "#C4C9CC",
        stadiumName: "Oakland Alameda Coliseum",
        stadiumCity: "Oakland, CA"
    },
    {
        _id: "19823783734d1d04a1b3901d",
        location: 'Detroit',
        shortLocation: "DET",
        name: "Lions",
        color: "#046EB4",
        stadiumName: "Ford Field",
        stadiumCity: "Detroit, MI"
    },
    {
        _id: "19823783734d1d04a1b3901e",
        location: 'Indianapolis',
        shortLocation: "IND",
        name: "Colts",
        color: "#003D79",
        stadiumName: "Lucas Oil Stadium",
        stadiumCity: "Indianapolis, IN"
    },
    {
        _id: "19823783734d1d04a1b3901f",
        location: 'Seattle',
        shortLocation: "SEA",
        name: "Seahawks",
        color: "#7AC142",
        stadiumName: "CenturyLink Field",
        stadiumCity: "Seattle, WA"
    },
    {
        _id: "19823783734d1d04a1b39000",
        location: 'Los Angeles',
        shortLocation: "LA",
        name: "Chargers",
        color: "#2072BA",
        stadiumName: "Los Angeles Stadium",
        stadiumCity: "Inglewood, CA"
    }
  ];
}

const getEspnTeams = () => { return [
      {
        id: '26',
        name: 'Seattle Seahawks',
        mvyId: '19823783734d1d04a1b3901f'
      },
      {
        id: '22',
        name: 'Arizona Cardinals',
        mvyId: '19823783734d1d04a1b39005'
      },
      {
        id: '23',
        name: 'Pittsburgh Steelers',
        mvyId: '19823783734d1d04a1b39014'
      },
      {
        id: '10',
        name: 'Tennessee Titans',
        mvyId: '19823783734d1d04a1b39019'
      },
      {
        id: '18',
        name: 'New Orleans Saints',
        mvyId: '19823783734d1d04a1b3900f'
      },
      {
        id: '2',
        name: 'Buffalo Bills',
        mvyId: '19823783734d1d04a1b3900b'
      },
      {
        id: '3',
        name: 'Chicago Bears',
        mvyId: '19823783734d1d04a1b39004'
      },
      {
        id: '9',
        name: 'Green Bay Packers',
        mvyId: '19823783734d1d04a1b39012'
      },
      {
        id: '8',
        name: 'Detroit Lions',
        mvyId: '19823783734d1d04a1b3901d'
      },
      {
        id: '5',
        name: 'Cleveland Browns',
        mvyId: '19823783734d1d04a1b39010'
      },
      {
        id: '4',
        name: 'Cincinnati Bengals',
        mvyId: '19823783734d1d04a1b39017'
      },
      {
        id: '11',
        name: 'Indianapolis Colts',
        mvyId: '19823783734d1d04a1b3901e'
      },
      {
        id: '27',
        name: 'Tampa Bay Buccaneers',
        mvyId: '19823783734d1d04a1b39016'
      },
      {
        id: '20',
        name: 'New York Jets',
        mvyId: '19823783734d1d04a1b3901a'
      },
      {
        id: '28',
        name: 'Washington Redskins',
        mvyId: '19823783734d1d04a1b3900c'
      },
      {
        id: '16',
        name: 'Minnesota Vikings',
        mvyId: '19823783734d1d04a1b3900a'
      },
      {
        id: '30',
        name: 'Jacksonville Jaguars',
        mvyId: '19823783734d1d04a1b3900e'
      },
      {
        id: '24',
        name: 'Los Angeles Chargers',
        mvyId: '19823783734d1d04a1b39000'
      },
      {
        id: '14',
        name: 'Los Angeles Rams',
        mvyId: '19823783734d1d04a1b3901b'
      },
      {
        id: '34',
        name: 'Houston Texans',
        mvyId: '19823783734d1d04a1b39007'
      },
      {
        id: '1',
        name: 'Atlanta Falcons',
        mvyId: '19823783734d1d04a1b39003'
      },
      {
        id: '6',
        name: 'Dallas Cowboys',
        mvyId: '19823783734d1d04a1b39006'
      },
      {
        id: '7',
        name: 'Denver Broncos',
        mvyId: '19823783734d1d04a1b39013'
      },
      {
        id: '29',
        name: 'Carolina Panthers',
        mvyId: '19823783734d1d04a1b39008'
      },
      {
        id: '15',
        name: 'Miami Dolphins',
        mvyId: '19823783734d1d04a1b39009'
      },
      {
        id: '25',
        name: 'San Francisco 49ers',
        mvyId: '19823783734d1d04a1b39018'
      },
      {
        id: '33',
        name: 'Baltimore Ravens',
        mvyId: '19823783734d1d04a1b3900d'
      },
      {
        id: '13',
        name: 'Oakland Raiders',
        mvyId: '19823783734d1d04a1b3901c'
      },
      {
        id: '21',
        name: 'Philadelphia Eagles',
        mvyId: '19823783734d1d04a1b39011'
      },
      {
        id: '12',
        name: 'Kansas City Chiefs',
        mvyId: '19823783734d1d04a1b39001'
      },
      {
        id: '17',
        name: 'New England Patriots',
        mvyId: '19823783734d1d04a1b39002'
      },
      {
        id: '19',
        name: 'New York Giants',
        mvyId: '19823783734d1d04a1b39015'
      }
    ];
}

module.exports = {
	getTeams,
    getEspnTeams
};