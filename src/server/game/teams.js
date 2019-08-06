const moment = require('moment-timezone');

const get = require('lodash/get');
const set = require('lodash/set');
const orderBy = require('lodash/orderBy');
const isNaN = require('lodash/isNaN');

const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const gameRepository = require('./GameRepository');
const gameWeekRepository = require('./GameWeekRepository');

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
        color: "#002244",
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
        color: "#FFCD00",
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
        "name": "Blues"
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
    },
    {
        "color": "#48494a",
        "_id": "5b9060e59a4c08bca6d80730",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "WORLD",
        "shortLocation": "WORLD",
        "name": "WORLD"
    },
    {
        "color": "#FFC20E",
        "_id": "5b9060e59a4c08bca6d80731",
        "leagueId": "59723313734d1d6202a85f19",
        "location": "USA",
        "shortLocation": "USA",
        "name": "USA"
    }
];

const mlbTeams = [
    {
        "color": "#BD3039",
        "_id": "5b9060e59a4c08bca6d80800",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Boston",
        "shortLocation": "BOS",
        "name": "Red Sox"
    },
    {
        "color": "#0C2340",
        "_id": "5b9060e59a4c08bca6d80801",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "New York",
        "shortLocation": "NYY",
        "name": "Yankees"
    },
    {
        "color": "#FC4C02",
        "_id": "5b9060e59a4c08bca6d80802",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Baltimore",
        "shortLocation": "BAL",
        "name": "Orioles"
    },
    {
        "color": "#134A8E",
        "_id": "5b9060e59a4c08bca6d80803",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Toronto",
        "shortLocation": "TOR",
        "name": "Blue Jays"
    },
    {
        "color": "#8FBCE6",
        "_id": "5b9060e59a4c08bca6d80804",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Tampa Bay",
        "shortLocation": "TB",
        "name": "Rays"
    },
    {
        "color": "#D31145",
        "_id": "5b9060e59a4c08bca6d80805",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Minnesota",
        "shortLocation": "MIN",
        "name": "Twins"
    },
    {
        "color": "#E31937",
        "_id": "5b9060e59a4c08bca6d80806",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Cleveland",
        "shortLocation": "CLE",
        "name": "Indians"
    },
    {
        "color": "#27251F",
        "_id": "5b9060e59a4c08bca6d80807",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Chicago",
        "shortLocation": "CHW",
        "name": "White Sox"
    },
    {
        "color": "#FA4616",
        "_id": "5b9060e59a4c08bca6d80808",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Detroit",
        "shortLocation": "DET",
        "name": "Tigers"
    },
    {
        "color": "#004687",
        "_id": "5b9060e59a4c08bca6d80809",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Kansas City",
        "shortLocation": "KC",
        "name": "Royals"
    },
    {
        "color": "#EB6E1F",
        "_id": "5b9060e59a4c08bca6d80810",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Houston",
        "shortLocation": "HOU",
        "name": "Astros"
    },
    {
        "color": "#C0111F",
        "_id": "5b9060e59a4c08bca6d80811",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Texas",
        "shortLocation": "TEX",
        "name": "Rangers"
    },
    {
        "color": "#003831",
        "_id": "5b9060e59a4c08bca6d80812",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Oakland",
        "shortLocation": "OAK",
        "name": "Athletics"
    },
    {
        "color": "#BA0021",
        "_id": "5b9060e59a4c08bca6d80813",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Los Angeles",
        "shortLocation": "LAA",
        "name": "Angels"
    },
    {
        "color": "#005C5C",
        "_id": "5b9060e59a4c08bca6d80814",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Seattle",
        "shortLocation": "SEA",
        "name": "Mariners"
    },
    {
        "color": "#13274F",
        "_id": "5b9060e59a4c08bca6d80815",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Atlanta",
        "shortLocation": "ATL",
        "name": "Braves"
    },
    {
        "color": "#E81828",
        "_id": "5b9060e59a4c08bca6d80816",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Philadelphia",
        "shortLocation": "PHI",
        "name": "Phillies"
    },
    {
        "color": "#AB0003",
        "_id": "5b9060e59a4c08bca6d80817",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Washington",
        "shortLocation": "WSH",
        "name": "Nationals"
    },
    {
        "color": "#FF5910",
        "_id": "5b9060e59a4c08bca6d80818",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "New York",
        "shortLocation": "NYM",
        "name": "Mets"
    },
    {
        "color": "#EF3340",
        "_id": "5b9060e59a4c08bca6d80819",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Miami",
        "shortLocation": "MIA",
        "name": "Marlins"
    },
    {
        "color": "#0E3386",
        "_id": "5b9060e59a4c08bca6d80820",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Chicago",
        "shortLocation": "CHC",
        "name": "Cubs"
    },
    {
        "color": "#0A2351",
        "_id": "5b9060e59a4c08bca6d80821",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Milwaukee",
        "shortLocation": "MIL",
        "name": "Brewers"
    },
    {
        "color": "#C41E3A",
        "_id": "5b9060e59a4c08bca6d80822",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "St. Louis",
        "shortLocation": "STL",
        "name": "Cardinals"
    },
    {
        "color": "#FDB827",
        "_id": "5b9060e59a4c08bca6d80823",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Pittsburgh",
        "shortLocation": "PIT",
        "name": "Pirates"
    },
    {
        "color": "#C6011F",
        "_id": "5b9060e59a4c08bca6d80824",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Cincinnati",
        "shortLocation": "CIN",
        "name": "Reds"
    },
    {
        "color": "#005A9C",
        "_id": "5b9060e59a4c08bca6d80825",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Los Angeles",
        "shortLocation": "LAD",
        "name": "Dodgers"
    },
    {
        "color": "#33006F",
        "_id": "5b9060e59a4c08bca6d80826",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Colorado",
        "shortLocation": "COL",
        "name": "Rockies"
    },
    {
        "color": "#A71930",
        "_id": "5b9060e59a4c08bca6d80827",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "Arizona",
        "shortLocation": "ARI",
        "name": "Diamondbacks"
    },
    {
        "color": "#473729",
        "_id": "5b9060e59a4c08bca6d80828",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "San Diego",
        "shortLocation": "SD",
        "name": "Padres"
    },
    {
        "color": "#FD5A1E",
        "_id": "5b9060e59a4c08bca6d80829",
        "leagueId": "59723313734d1d6202a85f21",
        "location": "San Francisco",
        "shortLocation": "SF",
        "name": "Giants"
    }
];

const hasGameStarted = (dateTime) => {
    const gameStartDateTime = moment(new Date(dateTime));
    const currentDateTime = moment(new Date());
    const difference = gameStartDateTime.diff(currentDateTime,'minutes');
    return difference <= 0;
};

const getLastPlays = (playHistory = []) => {
  const newPlays = playHistory.map(x=>x.lastPlay);
  return newPlays.length >= 5 ? newPlays.slice(0,5).join('<--') : newPlays.slice(0,newPlays.length).join('<--');
};

const getPlayHistory = ({message, playHistory, lastPlay, currentTime}) => {
  if (!lastPlay || !currentTime || playHistory.find(x=>get(x,'lastPlay')===lastPlay)) {
    //console.log(`${message} getPlayHistory invalid`);
    return playHistory;
  }

  const currenTimeSplit = currentTime.split(' ');

  const currentTimeQuarter = currenTimeSplit[currenTimeSplit.length-1];
  const currentTimeQuarterNumber = parseInt(currentTimeQuarter[0]);
  const overTime = currentTimeQuarter.includes('OT') ? 
    (currentTimeQuarter.replace('OT','') === '' ? 5 : parseInt(currentTimeQuarter.replace('OT','')) + 4) : undefined;

  const currentTimeString = get(currenTimeSplit,'0','').replace(':','');
  const currenTimeNumber = parseFloat(currentTimeString);

  const lastPlaySplit = lastPlay.split(' ');
  const lastPlayCurrentTimeString = lastPlaySplit[0].replace('(','').replace(':','').replace(')','');
  const lastPlayTimeNumber = parseFloat(lastPlayCurrentTimeString);
  const lastPlayEndOfQuarter = lastPlay.toLowerCase().includes('end of');
  
  const time = lastPlayEndOfQuarter && playHistory.length > 0 ? get(playHistory,'0.time')-1 : 
  isNaN(lastPlayTimeNumber) ? currenTimeNumber : lastPlayTimeNumber;

  const quarter = lastPlayEndOfQuarter && playHistory.length > 0 ? 
  get(playHistory,'0.quarter') : (overTime || currentTimeQuarterNumber);

  if (!quarter || (!time && time !== 0) || (time > 59 && time < 100) || lastPlayEndOfQuarter) {
    console.log(`${message} getPlayHistory invalid2`);
    return playHistory;
  }

  const newPlayHistory = orderBy([
    ...playHistory,
    {
      quarter,
      time,
      lastPlay
    }
  ], ['quarter', 'time'], ['desc', 'asc']);
  
  return newPlayHistory;
};

const createWeek = async ({message, url, leagueId, year, day=6}) => {
  console.log(`${message} creating week`);

  const currentWeekDay = moment(moment().startOf('day').format()).weekday();

  console.log(`${message} createWeek currentWeekDay: ${currentWeekDay}`);

  if (currentWeekDay === day) {
    const gameExistSearch = {
        leagueId: mongoose.Types.ObjectId(leagueId),
        year: year,
        startDateTime: {
          $gte: moment().add(0, 'days').startOf('day').format(),
          $lte: moment().add(6, 'days').endOf('day').format(),
        }
    };

    const games = await gameRepository.find(gameExistSearch);

    if (games.length === 0) {
        console.log(`${message} createWeek games don't exist.`);
        return;
    }

    const gameWeekFind = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year
    };

    const gameWeeks = await gameWeekRepository.find(gameWeekFind);
    
    const lastGame = gameWeeks.length > 0 ? gameWeeks[gameWeeks.length-1] : {};

    const diff = moment(lastGame.endDateTime).diff(moment());

    console.log(`${message} diff: ${diff}`);

    if (gameWeeks.length > 0 && diff > 0) {
        console.log(`${message} createWeek game week already exists: ${JSON.stringify(gameWeeks)}`);
        return;
    }

    let weekName;

    if (url) {
      let browser;
      let page;
    
      try {
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector('#events');

        let CURRENTWEEK_SELECTOR = 'div.display-desktop > div.dropdown-type-week > button';

        weekName = await page.evaluate((sel) => {
            return document.querySelector(sel).innerText;
          }, CURRENTWEEK_SELECTOR);

        await page.close();
        await browser.close();
      } catch(err) {
        if (!!page) {
          await page.close();
        }

        if (!!browser) {
          await browser.close();
        }

        console.log(`${message} browser error: ${JSON.stringify(err.message)}`);
      }
    }

    const gameWeek = {
      leagueId: mongoose.Types.ObjectId(leagueId),
      year: year,
      description: (weekName || '').toLowerCase().includes('pro bowl') ? undefined : weekName,
      beginDateTime: moment(lastGame.beginDateTime ? lastGame.beginDateTime : new Date()).add(0, 'days').startOf('day').format(),
      endDateTime: moment(lastGame.endDateTime ? lastGame.endDateTime : new Date()).add(6, 'days').endOf('day').format()
    };

    gameWeekRepository.create(gameWeek, function (err, gameWeekCreated) {
        if (err) {
            console.log(`${message} createWeek there was a problem adding week to the database:  ${err.message}`);
        } else {
            console.log(`${message} createWeek success creating week: ${gameWeekCreated._id}`);
        }
    });
  }
};

const getGames = async ({
    message,
    url,
    root,
    nameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    recordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p',
    startDateTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-score > div.sb-content > table > thead > tr.sb-linescore > th.date-time',
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p',
    away='away',
    home='home'
}) => {
  let games = [];
  
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //headless: false
    });

    page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector('#events');

    let listLength = 0;
    
    listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);

    console.log(`${message} getGames listLength: ${listLength}`);

    if (listLength === 0) {
      await page.close();
      await browser.close();
      return [];
    }

    for (let i = 1; i <= listLength; i++) {
      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,away));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, nameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, recordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,home));

      const startDateTime = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('data-date');
      }, startDateTimeSelector.replace("INDEX", i));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      if (!startDateTime) {
        console.log(`${message} getGames no startDateTime`);
      } else {
        games.push({
            startDateTime: startDateTime,
            spread: {
             team: spread.replace('Line: ','').split(' ')[0],
             amount: parseFloat(spread.replace('Line: ','').split(' ')[1]),
             spreadDateTime: moment().toISOString()
            },
            awayTeam: awayTeam,
            awayRecord: awayRecord,
            homeTeam: homeTeam,
            homeRecord: homeRecord
        });
      }
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (page) {
      await page.close();
    }

    if (browser) {
      await browser.close();
    }

    console.log(`${message} getGames browser error: ${err.message}`);
  }

  return games;
};

const formatGames = ({message, games, leagueId, year, teams}) => {
    let formattedGames = [];

    for(let i=0; i<games.length;i++) {
        const game = games[i];
        const awayTeam = teams.find(x=>x.shortLocation === game.awayTeam);
        const homeTeam = teams.find(x=>x.shortLocation === game.homeTeam);
        const spreadTeam = teams.find(x=>get(x,'shortLocation','a').toLowerCase() === get(game,'spread.team','b').toLowerCase());
        
        if (!awayTeam || !homeTeam) {
            console.log(`${message} formatGames team not found: ${JSON.stringify(game)}`);
            continue;
        }

        formattedGames.push({
          leagueId: mongoose.Types.ObjectId(leagueId),
          year: year,
          startDateTime: game.startDateTime,
          spread: {
           teamId: get(spreadTeam,'_id'),
           amount: get(game,'spread.amount', 0),
           spreadDateTime: game.spread.spreadDateTime
          },
          competitors: [
            {_id: mongoose.Types.ObjectId(awayTeam._id), name: awayTeam.location + ' ' + awayTeam.name, record: get(game,'awayRecord')},
            {_id: mongoose.Types.ObjectId(homeTeam._id), name: homeTeam.location + ' ' + homeTeam.name, record: get(game,'homeRecord')}
          ]
        });
    }

  return formattedGames;
};

const createGames = ({message, games}) => {
    games.forEach(game=>{
        const gameFind = {
          leagueId: get(game,'leagueId'),
          year: get(game,'year'),
          startDateTime: {
            $gte: moment(get(game,'startDateTime')).format(),
            $lte: moment(get(game,'startDateTime')).format(),
          }
        };

        gameRepository.find(gameFind, function (err, gamesFound) {
          if ((gamesFound || []).length > 0) {
            console.log(`${message} createGames games already exists: ${JSON.stringify(game)}`);
          } else {
           gameRepository.create(game, function (err, gameCreated) {
              if (err) {
                console.log(`${message} createGames there was a problem adding game to the database:  ${err.message}`);
              } else {
               console.log(`${message} createGames success creating game: ${gameCreated._id}`);
              }
            });
          }
        });
  });
};

const getScores = async ({
    message,
    url,
    root,
    gameNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.sb-notes > p',
    spreadSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div > section.sb-detail > div.stat > div',
    namePregameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.pregame > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    liveRecordSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.HOMEAWAY > div.sb-meta > div > p',
    liveQuarterSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td:nth-of-type(SCORE_NUMBER)',
    liveTotalSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    liveNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    livePlaySelector = 'div#events > article:nth-of-type(INDEX) > div > div > div:nth-child(2) > section > div > div.sb-meta > p',
    liveCurrentTimeSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.live > div > table > thead > tr > th.date-time',
    finalNameSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td > div.sb-meta > h2 > a > span.sb-team-abbrev',
    finalGameOverSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > thead > tr > th.date-time',
    finalScoreSelector = 'div#events > article:nth-of-type(INDEX) > div > div > section.final > div.sb-content > table > tbody#teams > tr.HOMEAWAY > td.total > span',
    possesionSelector = 'div#events > article:nth-of-type(INDEX) > div > div > div.main-container > div.game-details.footer.soccer.live > div > div > div.team.team-TEAMTYPE > div > ul',
    away='away',
    home='home'
}) => {
  let scores = [];
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //headless: false
    });

    page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector('#events');

    let listLength = 0;
    listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, root);
    
    console.log(`${message} listLength: ${listLength}`);

    if (listLength === 0) {
      isUpdateNbaScoresRunning = false;
      console.log(`${message} no games found`);
      await page.close();
      await browser.close();
      return;
    }

    for (let i = 1; i <= listLength; i++) {
      const currentTime = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, liveCurrentTimeSelector.replace("INDEX", i));

      const lastPlay = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, livePlaySelector.replace("INDEX", i));

      const gameOverText = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, finalGameOverSelector.replace("INDEX", i));

      const awayTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayTeamPregame = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, namePregameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayInProgressName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",away));

      const awayRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveRecordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,away));

      const homeTeam = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, finalNameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeTeamPregame = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, namePregameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeInProgressScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, liveTotalSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeInProgressName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, liveNameSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeScore = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, finalScoreSelector.replace("INDEX", i).replace("HOMEAWAY",home));

      const homeRecord = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, liveRecordSelector.replace("INDEX", i).replace(/HOMEAWAY/g,home));

      const spread = await page.evaluate((sel) => {
        return document.querySelector(sel) ? document.querySelector(sel).innerText : 'Line: 0';
      }, spreadSelector.replace("INDEX", i));

      const gameName = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, gameNameSelector.replace("INDEX", i));

      const possessionAway = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, possesionSelector.replace("INDEX", i).replace("TEAMTYPE",away));

      const possessionHome = await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        return element ? element.innerText : null;
      }, possesionSelector.replace("INDEX", i).replace("TEAMTYPE",home));

      scores.push({
        spread: {
         team: spread.replace('Line: ','').split(' ')[0],
         amount: parseFloat(spread.replace('Line: ','').split(' ')[1]),
         spreadDateTime: moment().toISOString()
        },
        gameOverText: gameOverText,
        awayTeam: awayTeam,
        awayTeamPregame: awayTeamPregame,
        awayTeamInProgress: awayInProgressName,
        awayInProgressScore: parseInt(awayInProgressScore),
        awayScore: parseInt(awayScore),
        awayRecord: awayRecord,
        homeTeam: homeTeam,
        homeTeamPregame: homeTeamPregame,
        homeTeamInProgress: homeInProgressName,
        homeInProgressScore: parseInt(homeInProgressScore),
        homeScore: parseInt(homeScore),
        homeRecord: homeRecord,
        lastPlay: (lastPlay || '').trim(),
        currentTime: currentTime,
        gameName: gameName,
        possessionAway: (possessionAway || '').trim().replace(/,\s*$/, ''),
        possessionHome: (possessionHome || '').trim().replace(/,\s*$/, '')
      });
    }

    await page.close();
    await browser.close();
  } catch(err) {
    if (!!page) {
      await page.close();
    }

    if (!!browser) {
      await browser.close();
    }
    console.log(`${message} browser error: ${err.message}`);
  }

  return scores;
};

const updateGames = ({message, leagueId, games, scores, teams}) => {
    const multiplePreGames = [];
    const multipleFinalGames = [];

    games.forEach(game=>{
        const awayTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.0._id','').toString());
        const awayShortLocation = get(awayTeam,'shortLocation');
        const homeTeam = teams.find(x=>get(x,'_id','').toString() === get(game,'competitors.1._id','').toString());
        const homeShortLocation = get(homeTeam,'shortLocation');

        let preGameScore = scores.findIndex(x=>x.awayTeamPregame === awayShortLocation && x.homeTeamPregame === homeShortLocation);

        //console.log(`${message} preGameScore: ${JSON.stringify(preGameScore)}`);

        const inProgressScore = scores.findIndex(x=>x.awayTeamInProgress === awayShortLocation && x.homeTeamInProgress === homeShortLocation);

        //console.log(`${message} inProgressScore: ${JSON.stringify(inProgressScore)}`);

        let finalScore = scores.findIndex(x=>x.awayTeam === awayShortLocation && x.homeTeam === homeShortLocation);

        //console.log(`${message} finalScore: ${JSON.stringify(finalScore)}`);

        const scoreIndex = preGameScore > -1 ? preGameScore : inProgressScore > -1 ? inProgressScore : finalScore;

        console.log(`${message} scoreIndex: ${scoreIndex}`);

        const score = scores[scoreIndex];

        console.log(`${message} score: ${JSON.stringify(score)}`);

        const spreadTeam = teams.find(x=>x.shortLocation.toLowerCase() === get(score,'spread.team','').toLowerCase());

        //console.log(`${message} spreadTeam: ${JSON.stringify(spreadTeam)}`);

        const playHistory = get(game,'playHistory',[]);
        const newPlayHistory = getPlayHistory({message: 'updateNbaGames', playHistory, lastPlay: get(score,'lastPlay'), currentTime: get(score,'currentTime')});
        const isOverOneHour = moment().diff(moment(game.startDateTime),'hours') > 1;
        const isGameOver = ((get(score,'gameOverText') !== null && get(score,'gameOverText') !== 'HT' && isOverOneHour) || 
        (get(score,'gameName') || '').toLowerCase().includes('makeup')) && 
        !(leagueId !== '59723313734d1d6202a85f17' && (get(score,'awayScore') || 0) === 0 && (get(score,'homeScore') || 0) === 0);

        const currentTimeFormatted = get(newPlayHistory,'0.time',0) > 99 ? 
          (get(newPlayHistory,'0.time')/100).toFixed(2).toString().replace('.',':') : get(newPlayHistory,'0.time');
        
        const currentTime = get(score,'currentTime');
        const currenTimeSplit = (currentTime || '').split(' ');
        const quarter = currenTimeSplit[currenTimeSplit.length-1];
        const endQuarter = get(newPlayHistory,'0.lastPlay','').toLowerCase().includes('end of');
        const shouldSetCurrentTime = (quarter && quarter !== 'Halftime' && !endQuarter) && currentTimeFormatted !== null;
        const lastPlays = leagueId === '59723313734d1d6202a85f17' ? (get(score,'isGameOver',false) ? undefined : get(score,'awayTeam') + ': ' + get(score,'possessionAway') + ' ' + 
          get(score,'homeTeam') + ': ' + get(score,'possessionHome')) : getLastPlays(newPlayHistory);

        const updatedGame = {
          competitors: [...get(game,'competitors',[])],
          isGameOver: isGameOver,
          playHistory: newPlayHistory,
          lastPlay: lastPlays,
          possession: get(score,'possession'),
          currentTime: leagueId === '59723313734d1d6202a85f21' ? get(score,'currentTime') : 
          shouldSetCurrentTime && currentTimeFormatted ? currentTimeFormatted + " - " + quarter : quarter,
          gameName: get(score,'gameName','')
        };

        set(updatedGame,'spread', !get(spreadTeam,'_id') ? get(game,'spread') : {
          teamId: get(spreadTeam,'_id'),
          amount: get(score,'spread.amount', 0),
          spreadDateTime: get(score,'spread.spreadDateTime')
        });

        set(updatedGame,'competitors.0.score', isGameOver ? ((get(score,'awayScore') || 0) <= (get(game,'competitors.0.score') || 0) ? get(game,'competitors.0.score') : get(score,'awayScore'))
            : ((get(score,'awayInProgressScore') || 0) <= (get(game,'competitors.0.score') || 0) ? get(game,'competitors.0.score') : get(score,'awayInProgressScore')));

        set(updatedGame,'competitors.1.score', isGameOver ? ((get(score,'homeScore') || 0) <= (get(game,'competitors.1.score') || 0) ? get(game,'competitors.1.score') : get(score,'homeScore'))
            : ((get(score,'homeInProgressScore') || 0) <= (get(game,'competitors.1.score') || 0) ? get(game,'competitors.1.score') : get(score,'homeInProgressScore')));
        

        if (isGameOver) {
          set(updatedGame,'competitors.0.finalRecord',get(updatedGame,'competitors.0.record'));
          set(updatedGame,'competitors.1.finalRecord',get(updatedGame,'competitors.1.record'));
        }

        console.log(`${message} score updated: ${JSON.stringify(updatedGame)}`);

        scores = [
            ...scores.slice(0,scoreIndex),
            ...scores.slice(scoreIndex+1)
        ];

        gameRepository.findByIdAndUpdate(mongoose.Types.ObjectId(game._id.toString()), updatedGame, {}, x=>()=>{});
    });
};

module.exports = {
    nbaTeams,
	nflTeams,
    eplTeams,
    ncaaTeams,
    mlbTeams,
    countries,
    hasGameStarted,
    getLastPlays,
    getPlayHistory,
    createWeek,
    getGames,
    formatGames,
    createGames,
    getScores,
    updateGames
};