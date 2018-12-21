const countries = [
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

const nflTeams = [
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

const ncaaTeams = [{
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9430",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida Atlantic",
    "shortLocation": "FAU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9436",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "TCU",
    "shortLocation": "TCU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9439",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Clemson",
    "shortLocation": "CLEM"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab943f",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Appalachian State",
    "shortLocation": "APP"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9442",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Auburn",
    "shortLocation": "AUB"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9448",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oklahoma",
    "shortLocation": "OKLA"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab944b",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Ohio State",
    "shortLocation": "OSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab944e",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Texas",
    "shortLocation": "TEX"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9451",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Maryland",
    "shortLocation": "MD"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9454",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Georgia",
    "shortLocation": "UGA",
    "color": "#BA0C2F"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9457",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Washington",
    "shortLocation": "WASH"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab945a",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Penn State",
    "shortLocation": "PSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab945d",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UNLV",
    "shortLocation": "UNLV"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9460",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "USC",
    "shortLocation": "USC"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9463",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Boise State",
    "shortLocation": "BSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9466",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Mississippi State",
    "shortLocation": "MSST"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9469",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Notre Dame",
    "shortLocation": "ND"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9471",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Bowling Green",
    "shortLocation": "BGSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9472",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Miami",
    "shortLocation": "MIAMI"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9475",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Tennessee",
    "shortLocation": "TENN"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9478",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "West Virginia",
    "shortLocation": "WVU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab947b",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Troy",
    "shortLocation": "TROY"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab947e",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oregon",
    "shortLocation": "ORE"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9481",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida State",
    "shortLocation": "FSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9484",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Michigan",
    "shortLocation": "MICH"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9487",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Louisville",
    "shortLocation": "LOU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab948a",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Alabama",
    "shortLocation": "ALA",
    "color": "#9E1B32"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab948d",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "LSU",
    "shortLocation": "LSU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9490",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Virginia Tech",
    "shortLocation": "VT"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020b",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "William & Mary",
    "shortLocation": "W&M"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020f",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Portland State",
    "shortLocation": "PRST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80226",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "North Dakota",
    "shortLocation": "UND"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8022a",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Youngstown State",
    "shortLocation": "YSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab940a",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UCF",
    "shortLocation": "UCF",
    "color": "#BA9B37"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab940b",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UConn",
    "shortLocation": "UCONN",
    "color": "#000E2F"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9416",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Utah State",
    "shortLocation": "USU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9417",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Michigan State",
    "shortLocation": "MSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9421",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Stanford",
    "shortLocation": "STAN"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9423",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Western Kentucky",
    "shortLocation": "WKU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9425",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "San Diego State",
    "shortLocation": "SDSU"
}, {
    "colors": [],
    "_id": "5b84a2879a4c08bca6ab9426",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Wisconsin",
    "shortLocation": "WIS"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab942d",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Oregon State",
    "shortLocation": "ORST"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9445",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Austin Peay",
    "shortLocation": "PEAY"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab9433",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Southern",
    "shortLocation": "SOU"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab946c",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Stephen F. Austin",
    "shortLocation": "SFA"
}, {
    "colors": [],
    "_id": "5b84a2889a4c08bca6ab943c",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Furman",
    "shortLocation": "FUR"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801ed",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "New Mexico",
    "shortLocation": "UNM"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801ee",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "SMU",
    "shortLocation": "SMU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801f9",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Western Michigan",
    "shortLocation": "WMU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d801fc",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Kansas State",
    "shortLocation": "KSU"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8020c",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "UCLA",
    "shortLocation": "UCLA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80214",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Arkansas State",
    "shortLocation": "ARKST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8021c",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "South Carolina",
    "shortLocation": "SC"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80220",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Rutgers",
    "shortLocation": "RUTG"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8022d",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "South Carolina State",
    "shortLocation": "SCST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80230",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Ball State",
    "shortLocation": "BALL"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80235",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Savannah State",
    "shortLocation": "SAV"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8023a",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Texas A&M",
    "shortLocation": "TA&M"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80244",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Kentucky",
    "shortLocation": "UK"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80248",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Alabama State",
    "shortLocation": "ALST"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8024d",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Southeastern Louisiana",
    "shortLocation": "SELA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d8024e",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Pittsburgh",
    "shortLocation": "PITT"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80251",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Florida",
    "shortLocation": "FLA"
}, {
    "colors": [],
    "_id": "5b9060e59a4c08bca6d80260",
    "leagueId": "59723313734d1d6202a85f15",
    "location": "Arizona State",
    "shortLocation": "ASU"
}];

const eplTeams = [
    {
        "color": "#132257",
        "_id": "5b9060e59a4c08bca6d80500",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Tottenham",
        "shortLocation": "TOT",
        "name": "Spurs"
    },
    {
        "color": "#00B2A9",
        "_id": "5b9060e59a4c08bca6d80501",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Liverpool",
        "shortLocation": "LIV",
        "name": "The Reds"
    },
    {
        "color": "#B50E12",
        "_id": "5b9060e59a4c08bca6d80502",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "AFC Bournemouth",
        "shortLocation": "BOU",
        "name": "The Cherries"
    },
    {
        "color": "#FDBE11",
        "_id": "5b9060e59a4c08bca6d80503",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Leicester City",
        "shortLocation": "LEI",
        "name": "The Foxes"
    },
    {
        "color": "#034694",
        "_id": "5b9060e59a4c08bca6d80504",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Chelsea",
        "shortLocation": "CHE",
        "name": "The Blues"
    },
    {
        "color": "#005995",
        "_id": "5b9060e59a4c08bca6d80505",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Cardiff City",
        "shortLocation": "CAR",
        "name": "The Bluebirds"
    },
    {
        "color": "#0E63AD",
        "_id": "5b9060e59a4c08bca6d80506",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Huddersfield Town",
        "shortLocation": "HUD",
        "name": "The Terriers"
    },
    {
        "color": "#1B458F",
        "_id": "5b9060e59a4c08bca6d80507",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Crystal Palace",
        "shortLocation": "CRY",
        "name": "The Eagles"
    },
    {
        "color": "#1C2C5B",
        "_id": "5b9060e59a4c08bca6d80508",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Manchester City",
        "shortLocation": "MNC",
        "name": "Citizens"
    },
    {
        "color": "#CC0000",
        "_id": "5b9060e59a4c08bca6d80509",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Fulham",
        "shortLocation": "FUL",
        "name": "The Cottagers"
    },
    {
        "color": "#41B6E6",
        "_id": "5b9060e59a4c08bca6d8050a",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Newcastle United",
        "shortLocation": "NEW",
        "name": "The Magpies"
    },
    {
        "color": "#DB0007",
        "_id": "5b9060e59a4c08bca6d8050b",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Arsenal",
        "shortLocation": "ARS",
        "name": "The Gunners"
    },
    {
        "color": "#FBEE23",
        "_id": "5b9060e59a4c08bca6d8050c",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Watford",
        "shortLocation": "WAT",
        "name": "The Hornets"
    },
    {
        "color": "#DA291C",
        "_id": "5b9060e59a4c08bca6d8050d",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Manchester United",
        "shortLocation": "MAN",
        "name": "Red Devils"
    },
    {
        "color": "#FDB913",
        "_id": "5b9060e59a4c08bca6d8050e",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Wolverhampton",
        "shortLocation": "WOL",
        "name": "Wanderers"
    },
    {
        "color": "#6C1D45",
        "_id": "5b9060e59a4c08bca6d8050f",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Burnley",
        "shortLocation": "BUR",
        "name": "The Clarets"
    },
    {
        "color": "#003399",
        "_id": "5b9060e59a4c08bca6d80510",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Everton",
        "shortLocation": "EVE",
        "name": "The Blues"
    },
    {
        "color": "#7A263A",
        "_id": "5b9060e59a4c08bca6d80511",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "West Ham United",
        "shortLocation": "WHU",
        "name": "The Hammers"
    },
    {
        "color": "#D71920",
        "_id": "5b9060e59a4c08bca6d80512",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Southampton",
        "shortLocation": "SOU",
        "name": "The Saints"
    },
    {
        "color": "#0057B8",
        "_id": "5b9060e59a4c08bca6d80513",
        "leagueId": "59723313734d1d6202a85f17",
        "location": "Brighton & Hove Albion",
        "shortLocation": "BHA",
        "name": "The Seagulls"
    }
];

const nbaTeams = [
    {
        "color": "#007A33",
        "_id": "5b9060e59a4c08bca6d80700",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Boston",
        "shortLocation": "BOS",
        "name": "Celtics"
    },
    {
        "color": "#F58426",
        "_id": "5b9060e59a4c08bca6d80701",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "New York",
        "shortLocation": "NY",
        "name": "Knicks"
    },
    {
        "color": "#C4C9CC",
        "_id": "5b9060e59a4c08bca6d80702",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Brooklyn",
        "shortLocation": "BKN",
        "name": "Nets"
    },
    {
        "color": "#CE1141",
        "_id": "5b9060e59a4c08bca6d80703",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Toronto",
        "shortLocation": "TOR",
        "name": "Raptors"
    },
    {
        "color": "#006BB6",
        "_id": "5b9060e59a4c08bca6d80704",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Philadelphia",
        "shortLocation": "PHI",
        "name": "76ers"
    },
    {
        "color": "#00471B",
        "_id": "5b9060e59a4c08bca6d80705",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Milwaukee",
        "shortLocation": "MIL",
        "name": "Bucks"
    },
    {
        "color": "#FDBB30",
        "_id": "5b9060e59a4c08bca6d80706",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Indiana",
        "shortLocation": "IND",
        "name": "Pacers"
    },
    {
        "color": "#006BB6",
        "_id": "5b9060e59a4c08bca6d80707",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Detroit",
        "shortLocation": "DET",
        "name": "Pistons"
    },
    {
        "color": "#6F263D",
        "_id": "5b9060e59a4c08bca6d80708",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Cleveland",
        "shortLocation": "CLE",
        "name": "Cavaliers"
    },
    {
        "color": "#CE1141",
        "_id": "5b9060e59a4c08bca6d80709",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Chicago",
        "shortLocation": "CHI",
        "name": "Bulls"
    },
    {
        "color": "#1D1160",
        "_id": "5b9060e59a4c08bca6d80710",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Charlotte",
        "shortLocation": "CHA",
        "name": "Hornets"
    },
    {
        "color": "#0077C0",
        "_id": "5b9060e59a4c08bca6d80711",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Orlando",
        "shortLocation": "ORL",
        "name": "Magic"
    },
    {
        "color": "#98002E",
        "_id": "5b9060e59a4c08bca6d80712",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Miami",
        "shortLocation": "MIA",
        "name": "Heat"
    },
    {
        "color": "#E31837",
        "_id": "5b9060e59a4c08bca6d80713",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Washington",
        "shortLocation": "WSH",
        "name": "Wizards"
    },
    {
        "color": "#E03A3E",
        "_id": "5b9060e59a4c08bca6d80714",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Atlanta",
        "shortLocation": "ATL",
        "name": "Hawks"
    },
    {
        "color": "#0E2240",
        "_id": "5b9060e59a4c08bca6d80715",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Denver",
        "shortLocation": "DEN",
        "name": "Nuggets"
    },
    {
        "color": "#007AC1",
        "_id": "5b9060e59a4c08bca6d80716",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Oklahoma City",
        "shortLocation": "OKC",
        "name": "Thunder"
    },
    {
        "color": "#E03A3E",
        "_id": "5b9060e59a4c08bca6d80717",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Portland",
        "shortLocation": "POR",
        "name": "Trail Blazers"
    },
    {
        "color": "#0C2340",
        "_id": "5b9060e59a4c08bca6d80718",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Minnesota",
        "shortLocation": "MIN",
        "name": "Timberwolves"
    },
    {
        "color": "#B50E12",
        "_id": "5b9060e59a4c08bca6d80719",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Utah",
        "shortLocation": "UTAH",
        "name": "Jazz"
    },
    {
        "color": "#006BB6",
        "_id": "5b9060e59a4c08bca6d80720",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Golden State",
        "shortLocation": "GS",
        "name": "Warriors"
    },
    {
        "color": "#552583",
        "_id": "5b9060e59a4c08bca6d80721",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Los Angeles",
        "shortLocation": "LAL",
        "name": "Lakers"
    },
    {
        "color": "#C8102E",
        "_id": "5b9060e59a4c08bca6d80722",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Los Angeles",
        "shortLocation": "LAC",
        "name": "Clippers"
    },
    {
        "color": "#5A2D81",
        "_id": "5b9060e59a4c08bca6d80723",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Sacramento",
        "shortLocation": "SAC",
        "name": "Kings"
    },
    {
        "color": "#1D1160",
        "_id": "5b9060e59a4c08bca6d80724",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Phoenix",
        "shortLocation": "PHX",
        "name": "Suns"
    },
    {
        "color": "#00538C",
        "_id": "5b9060e59a4c08bca6d80725",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Dallas",
        "shortLocation": "DAL",
        "name": "Mavericks"
    },
    {
        "color": "#12173F",
        "_id": "5b9060e59a4c08bca6d80726",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Memphis",
        "shortLocation": "MEM",
        "name": "Grizzlies"
    },
    {
        "color": "#CE1141",
        "_id": "5b9060e59a4c08bca6d80727",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "Houston",
        "shortLocation": "HOU",
        "name": "Rockets"
    },
    {
        "color": "#EF426F",
        "_id": "5b9060e59a4c08bca6d80728",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "San Antonio",
        "shortLocation": "SA",
        "name": "Spurs"
    },
    {
        "color": "#0C2340",
        "_id": "5b9060e59a4c08bca6d80729",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "New Orleans",
        "shortLocation": "NO",
        "name": "Pelicans"
    }
]

module.exports = {
    nbaTeams,
	nflTeams,
    eplTeams,
    ncaaTeams,
    countries
};