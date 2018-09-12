const mvyCountries = [
    {
        _id: "19823783734d1d04a1b39020",
        location: 'Russia',
        shortLocation: 'RUS',
        colors: ['#FFFFFF', '#0039A6', '#D52B1E']
    },
    {
        _id: "19823783734d1d04a1b39021",
        location: 'Saudi Arabia',
        shortLocation: 'KSA',
        colors: ['#006C35', '#FFFFFF']
    },
    {
        _id: "19823783734d1d04a1b39022",
        location: 'Egypt',
        shortLocation: 'EGY',
        colors: ['#CE1126', '#FFFFFF', '#000000', '#C09300']
    },
    {
        _id: "19823783734d1d04a1b39023",
        location: 'Uruguay',
        shortLocation: 'URU',
        colors: ['#FCD116', '#FFFFFF', '#0038A8']
    },
    {
        _id: "19823783734d1d04a1b39024",
        location: 'Morocco',
        shortLocation: 'MAR',
        colors: ['#C1272D', '#006233']
    },
    {
        _id: "19823783734d1d04a1b39025",
        location: 'IRAN',
        shortLocation: 'IRN',
        colors: ['#239F40', '#FFFFFF', '#DA0000']
    },
    {
        _id: "19823783734d1d04a1b39026",
        location: 'Mexico',
        shortLocation: 'MXO',
        colors: ['#006847', '#FFFFFF', '#CE1126']
    },
    {
        _id: "19823783734d1d04a1b39027",
        location: 'Portugal',
        shortLocation: 'POR',
        colors: ['#006600', '#FF0000', '#FFFF00']
    },
    {
        _id: "19823783734d1d04a1b39028",
        location: 'Spain',
        shortLocation: 'ESP',
        colors: ['#C60B1E', '#FFC400']
    },
    {
        _id: "19823783734d1d04a1b39029",
        location: 'France',
        shortLocation: 'FR',
        colors: ['#002395', '#FFFFFF', '#ED2939']
    },
    {
        _id: "19823783734d1d04a1b39030",
        location: 'Croatia',
        shortLocation: 'CRO',
        colors: ['#FF0000', '#FFFFFF', '#0093DD']
    }
];

const mvyTennisPlayers = [
    {
        _id: '19823783734d1d04a1b39030',
        firstName: 'Rafael',
        lastName: 'Nadal',
        countryId: '19823783734d1d04a1b39028'
    }
];

const mvyNflTeams = [
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
        colors: ['#002244','#C60C30','#B0B7BC'],
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
        shortLocation: "WSH",
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
        shortLocation: "JAX",
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
        shortLocation: "NYG",
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
        shortLocation: "NYJ",
        name: "Jets",
        color: "#203731",
        stadiumName: "MetLife Stadium",
        stadiumCity: "East Rutherford, NJ"
    },
    {
        _id: "19823783734d1d04a1b3901b",
        location: 'Los Angeles',
        shortLocation: "LAR",
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
        shortLocation: "LAC",
        name: "Chargers",
        color: "#2072BA",
        stadiumName: "Los Angeles Stadium",
        stadiumCity: "Inglewood, CA"
    }
  ];

const espnNflTeams = [
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

const espnMlbTeams = [
    {
        id: '8',
        name: 'Colorado Rockies',
        mvyId: '19823783734d1d04a1b3a002'
    },
    {
        id: '27',
        name: 'Milwaukee Brewers',
        mvyId: '19823783734d1d04a1b3a001'
    }
];

const mvyMlbTeams = [
    {
        _id: "19823783734d1d04a1b3a001",
        location: 'Milwaukee',
        shortLocation: "MIL",
        name: "Brewers"
    },
    {
        _id: "19823783734d1d04a1b3a002",
        location: 'Colorado',
        shortLocation: "CO",
        name: "Rockies"
    }
];

const ncaafTeams = [{
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9430",
    "externalId": "2226",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida Atlantic",
    "shortLocation": "FAU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9436",
    "externalId": "2628",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "TCU",
    "shortLocation": "TCU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9439",
    "externalId": "228",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Clemson",
    "shortLocation": "CLEM"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab943f",
    "externalId": "2026",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Appalachian State",
    "shortLocation": "APP"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9442",
    "externalId": "2",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Auburn",
    "shortLocation": "AUB"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9448",
    "externalId": "201",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oklahoma",
    "shortLocation": "OKLA"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab944b",
    "externalId": "194",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Ohio State",
    "shortLocation": "OSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab944e",
    "externalId": "251",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Texas",
    "shortLocation": "TEX"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9451",
    "externalId": "120",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Maryland",
    "shortLocation": "MD"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9454",
    "externalId": "61",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Georgia",
    "shortLocation": "UGA",
    "color": "#BA0C2F"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9457",
    "externalId": "264",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Washington",
    "shortLocation": "WASH"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab945a",
    "externalId": "213",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Penn State",
    "shortLocation": "PSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab945d",
    "externalId": "2439",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UNLV",
    "shortLocation": "UNLV"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9460",
    "externalId": "30",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "USC",
    "shortLocation": "USC"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9463",
    "externalId": "68",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Boise State",
    "shortLocation": "BSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9466",
    "externalId": "344",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Mississippi State",
    "shortLocation": "MSST"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9469",
    "externalId": "87",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Notre Dame",
    "shortLocation": "ND"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9471",
    "externalId": "189",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Bowling Green",
    "shortLocation": "BGSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9472",
    "externalId": "2390",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Miami",
    "shortLocation": "MIAMI"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9475",
    "externalId": "2633",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Tennessee",
    "shortLocation": "TENN"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9478",
    "externalId": "277",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "West Virginia",
    "shortLocation": "WVU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab947b",
    "externalId": "2653",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Troy",
    "shortLocation": "TROY"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab947e",
    "externalId": "2483",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oregon",
    "shortLocation": "ORE"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9481",
    "externalId": "52",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida State",
    "shortLocation": "FSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9484",
    "externalId": "130",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Michigan",
    "shortLocation": "MICH"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9487",
    "externalId": "97",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Louisville",
    "shortLocation": "LOU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab948a",
    "externalId": "333",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Alabama",
    "shortLocation": "ALA",
    "color": "#9E1B32"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab948d",
    "externalId": "99",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "LSU",
    "shortLocation": "LSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9490",
    "externalId": "259",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Virginia Tech",
    "shortLocation": "VT"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020b",
    "externalId": "2729",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "William & Mary",
    "shortLocation": "W&M"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020f",
    "externalId": "2502",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Portland State",
    "shortLocation": "PRST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80226",
    "externalId": "155",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "North Dakota",
    "shortLocation": "UND"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8022a",
    "externalId": "2754",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Youngstown State",
    "shortLocation": "YSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab940a",
    "externalId": "2116",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UCF",
    "shortLocation": "UCF",
    "color": "#BA9B37"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab940b",
    "externalId": "41",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UConn",
    "shortLocation": "UCONN",
    "color": "#000E2F"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9416",
    "externalId": "328",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Utah State",
    "shortLocation": "USU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9417",
    "externalId": "127",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Michigan State",
    "shortLocation": "MSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9421",
    "externalId": "24",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Stanford",
    "shortLocation": "STAN"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9423",
    "externalId": "98",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Western Kentucky",
    "shortLocation": "WKU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9425",
    "externalId": "21",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "San Diego State",
    "shortLocation": "SDSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9426",
    "externalId": "275",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Wisconsin",
    "shortLocation": "WIS"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab942d",
    "externalId": "204",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oregon State",
    "shortLocation": "ORST"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9445",
    "externalId": "2046",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Austin Peay",
    "shortLocation": "PEAY"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9433",
    "externalId": "2582",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Southern",
    "shortLocation": "SOU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab946c",
    "externalId": "2617",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Stephen F. Austin",
    "shortLocation": "SFA"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab943c",
    "externalId": "231",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Furman",
    "shortLocation": "FUR"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801ed",
    "externalId": "167",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "New Mexico",
    "shortLocation": "UNM"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801ee",
    "externalId": "2567",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "SMU",
    "shortLocation": "SMU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801f9",
    "externalId": "2711",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Western Michigan",
    "shortLocation": "WMU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801fc",
    "externalId": "2306",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Kansas State",
    "shortLocation": "KSU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020c",
    "externalId": "26",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UCLA",
    "shortLocation": "UCLA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80214",
    "externalId": "2032",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Arkansas State",
    "shortLocation": "ARKST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8021c",
    "externalId": "2579",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "South Carolina",
    "shortLocation": "SC"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80220",
    "externalId": "164",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Rutgers",
    "shortLocation": "RUTG"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8022d",
    "externalId": "2569",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "South Carolina State",
    "shortLocation": "SCST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80230",
    "externalId": "2050",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Ball State",
    "shortLocation": "BALL"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80235",
    "externalId": "2542",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Savannah State",
    "shortLocation": "SAV"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8023a",
    "externalId": "245",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Texas A&M",
    "shortLocation": "TA&M"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80244",
    "externalId": "96",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Kentucky",
    "shortLocation": "UK"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80248",
    "externalId": "2011",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Alabama State",
    "shortLocation": "ALST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8024d",
    "externalId": "2545",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Southeastern Louisiana",
    "shortLocation": "SELA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8024e",
    "externalId": "221",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Pittsburgh",
    "shortLocation": "PITT"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80251",
    "externalId": "57",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida",
    "shortLocation": "FLA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80260",
    "externalId": "9",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Arizona State",
    "shortLocation": "ASU"
}];

const eplTeams = [
    {
        "color": "#132257",
        "_id": "5b9060e59a4c08bca6d80500",
        "externalId": "364",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Tottenham",
        "shortLocation": "TOT",
        "name": "Spurs"
    },
    {
        "color": "#00B2A9",
        "_id": "5b9060e59a4c08bca6d80501",
        "externalId": "367",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Liverpool",
        "shortLocation": "LIV",
        "name": "The Reds"
    },
    {
        "color": "#B50E12",
        "_id": "5b9060e59a4c08bca6d80502",
        "externalId": "375",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "AFC Bournemouth",
        "shortLocation": "BOU",
        "name": "The Cherries"
    },
    {
        "color": "#FDBE11",
        "_id": "5b9060e59a4c08bca6d80503",
        "externalId": "349",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Leicester City",
        "shortLocation": "LEI",
        "name": "The Foxes"
    },
    {
        "color": "#034694",
        "_id": "5b9060e59a4c08bca6d80504",
        "externalId": "347",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Chelsea",
        "shortLocation": "CHE",
        "name": "The Blues"
    },
    {
        "color": "#005995",
        "_id": "5b9060e59a4c08bca6d80505",
        "externalId": "363",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Cardiff City",
        "shortLocation": "CAR",
        "name": "The Bluebirds"
    },
    {
        "color": "#0E63AD",
        "_id": "5b9060e59a4c08bca6d80506",
        "externalId": "384",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Huddersfield Town",
        "shortLocation": "HUD",
        "name": "The Terriers"
    },
    {
        "color": "#1B458F",
        "_id": "5b9060e59a4c08bca6d80507",
        "externalId": "355",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Crystal Palace",
        "shortLocation": "CRY",
        "name": "The Eagles"
    },
    {
        "color": "#1C2C5B",
        "_id": "5b9060e59a4c08bca6d80508",
        "externalId": "370",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Manchester City",
        "shortLocation": "MNC",
        "name": "Citizens"
    },
    {
        "color": "#CC0000",
        "_id": "5b9060e59a4c08bca6d80509",
        "externalId": "382",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Fulham",
        "shortLocation": "FUL",
        "name": "The Cottagers"
    },
    {
        "color": "#41B6E6",
        "_id": "5b9060e59a4c08bca6d8050a",
        "externalId": "359",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Newcastle United",
        "shortLocation": "NEW",
        "name": "The Magpies"
    },
    {
        "color": "#DB0007",
        "_id": "5b9060e59a4c08bca6d8050b",
        "externalId": "361",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Arsenal",
        "shortLocation": "ARS",
        "name": "The Gunners"
    },
    {
        "color": "#FBEE23",
        "_id": "5b9060e59a4c08bca6d8050c",
        "externalId": "360",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Watford",
        "shortLocation": "WAT",
        "name": "The Hornets"
    },
    {
        "color": "#DA291C",
        "_id": "5b9060e59a4c08bca6d8050d",
        "externalId": "395",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Manchester United",
        "shortLocation": "MAN",
        "name": "Red Devils"
    },
    {
        "color": "#FDB913",
        "_id": "5b9060e59a4c08bca6d8050e",
        "externalId": "379",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Wolverhampton",
        "shortLocation": "WOL",
        "name": "Wanderers"
    },
    {
        "color": "#6C1D45",
        "_id": "5b9060e59a4c08bca6d8050f",
        "externalId": "380",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Burnley",
        "shortLocation": "BUR",
        "name": "The Clarets"
    },
    {
        "color": "#003399",
        "_id": "5b9060e59a4c08bca6d80510",
        "externalId": "371",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Everton",
        "shortLocation": "EVE",
        "name": "The Blues"
    },
    {
        "color": "#7A263A",
        "_id": "5b9060e59a4c08bca6d80511",
        "externalId": "368",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "West Ham United",
        "shortLocation": "WHU",
        "name": "The Hammers"
    },
    {
        "color": "#D71920",
        "_id": "5b9060e59a4c08bca6d80512",
        "externalId": "331",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Southampton",
        "shortLocation": "SOU",
        "name": "The Saints"
    },
    {
        "color": "#0057B8",
        "_id": "5b9060e59a4c08bca6d80513",
        "externalId": "376",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Brighton & Hove Albion",
        "shortLocation": "BHA",
        "name": "The Seagulls"
    }
];

module.exports = {
	mvyNflTeams,
    espnNflTeams,
    mvyMlbTeams,
    espnMlbTeams,
    mvyCountries,
    ncaafTeams,
    eplTeams
};