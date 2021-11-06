const countries = [
    {
        _id: "19823783734d1d04a1b39020",
        location: 'Russia',
        shortLocation: 'RUS',
        name: "Russia",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b39021",
        location: 'Saudi Arabia',
        shortLocation: 'KSA',
        name: 'Saudi Arabia',
        country: "SAUDI ARABIA"
    },
    {
        _id: "19823783734d1d04a1b39022",
        location: 'Egypt',
        shortLocation: 'EGY',
        name: 'Egypt',
        country: "EGYPT"
    },
    {
        _id: "19823783734d1d04a1b39023",
        location: 'Uruguay',
        shortLocation: 'URU',
        name: 'Uruguay',
        country: "URUGUAY"
    },
    {
        _id: "19823783734d1d04a1b39024",
        location: 'Morocco',
        shortLocation: 'MAR',
        name: 'Morocco',
        country: "MOROCCO"
    },
    {
        _id: "19823783734d1d04a1b39025",
        location: 'Iran',
        shortLocation: 'IRN',
        name: 'Iran',
        country: "IRAN"
    },
    {
        _id: "19823783734d1d04a1b39026",
        location: 'Mexico',
        shortLocation: 'MXO',
        name: 'Mexico',
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b39027",
        location: 'Portugal',
        shortLocation: 'POR',
        name: 'Portugal',
        country: "PORTUGAL"
    },
    {
        _id: "19823783734d1d04a1b39028",
        location: 'Spain',
        shortLocation: 'ESP',
        name: 'Spain',
        country: "SPAIN"
    },
    {
        _id: "19823783734d1d04a1b39029",
        location: 'France',
        shortLocation: 'FR',
        name: 'France',
        country: "FRANCE"
    },
    {
        _id: "19823783734d1d04a1b3902a",
        location: 'Croatia',
        shortLocation: 'CRO',
        name: 'Croatia',
        country: "ENGLAND"
    }
];

const boxingCompetitors = [
    {
        _id: "19823783734d1d04a1b31001",
        location: 'Peter Quillin',
        shortLocation: "Peter",
        name: "Kid Chocolate Quillin",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31002",
        location: 'Alfredo Angulo',
        shortLocation: "Alfredo",
        name: "El Perro Angulo",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b31003",
        location: 'Anthony Joshua',
        shortLocation: "Anthony",
        name: "AJ Joshua",
        country: "ENGLAND"
    },
    {
        _id: "19823783734d1d04a1b31004",
        location: 'Andy Ruiz Jr.',
        shortLocation: "Andy",
        name: "Destroyer Ruiz",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31005",
        location: 'Errol Spence Jr.',
        shortLocation: "Errol",
        name: "The Truth Spence Jr.",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31006",
        location: 'Shawn Porter',
        shortLocation: "Shawn",
        name: "Showtime Porter",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31007",
        location: 'Anthony Dirrell',
        shortLocation: "Anthony",
        name: "The Dog Dirrell",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31008",
        location: 'David Benavidez',
        shortLocation: "David",
        name: "El Bandera Roja Benavidez",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31009",
        location: 'Mario Barrios',
        shortLocation: "Mario",
        name: "El Azteca Barrios",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3100a",
        location: 'Batyr Akhmedov',
        shortLocation: "Batyr",
        name: "Akhmedov",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b3100b",
        location: 'Sergey Kovalev',
        shortLocation: "Sergey",
        name: "Krusher Kovalev",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b3100c",
        location: 'Canelo Alvarez',
        shortLocation: "Canelo",
        name: "Alvarez",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b3100d",
        location: 'Ryan Garcia',
        shortLocation: "Ryan",
        name: "The Flash Garcia",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3100e",
        location: 'Romero Duno',
        shortLocation: "Romero",
        name: "Ruthless Duno",
        country: "PHILLIPINES"
    },
    {
        _id: "19823783734d1d04a1b3100f",
        location: 'Evan Holyfield',
        shortLocation: "Evan",
        name: "The Real Deal Holyfield",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31010",
        location: 'Nick Winstead',
        shortLocation: "Nick",
        name: "Winstead",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31011",
        location: 'Alexander Povetkin',
        shortLocation: "Alexander",
        name: "White Lion Povetkin",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b31012",
        location: 'Michael Hunter',
        shortLocation: "Michael",
        name: "The Bounty Hunter",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31013",
        location: 'Filip Hrgovic',
        shortLocation: "Filip",
        name: "EL Animal Hrgovic",
        country: "CROATIA"
    },
    {
        _id: "19823783734d1d04a1b31014",
        location: 'Eric Molina',
        shortLocation: "Eric",
        name: "Drummer Boy Molina",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31015",
        location: 'Deontay Wilder',
        shortLocation: "Deontay",
        name: "Bronze Bomber Wilder",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31016",
        location: 'Tyson Fury',
        shortLocation: "Tyson",
        name: "Gypsy King Fury",
        country: "ENGLAND"
    },
    {
        _id: "19823783734d1d04a1b31017",
        location: 'Charles Martin',
        shortLocation: "Charles",
        name: "Prince Martin",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31018",
        location: 'Gerald Washington',
        shortLocation: "Gerald",
        name: "El Gallo Negro Washington",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31019",
        location: 'Emanuel Navarrete',
        shortLocation: "Emanuel",
        name: "Vaquero Navarrete",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b3101a",
        location: 'Jeo Santisima',
        shortLocation: "Jeo",
        name: "Santino Santisima",
        country: "PHILLIPINES"
    },
    {
        _id: "19823783734d1d04a1b3101b",
        location: 'Mike Tyson',
        shortLocation: "Mike",
        name: "Iron Mike Tyson",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3101c",
        location: 'Roy Jones Jr.',
        shortLocation: "Roy",
        name: "Superman Jones Jr.",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3101d",
        location: 'Nate Robinson',
        shortLocation: "Nate",
        name: "Krypto Robinson",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3101e",
        location: 'Jake Paul',
        shortLocation: "Jake",
        name: "The Problem Child Paul",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3101f",
        location: "Vasiliy Lomachenko",
        shortLocation: "Vasiliy",
        name: "Hi-Tech Lomachenko",
        country: "UKRAINE"
    },
    {
        _id: "19823783734d1d04a1b31020",
        location: "Teofimo Lopez Jr.",
        shortLocation: "Teofimo",
        name: "El Brooklyn Lopez Jr.",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31021",
        location: "Jermall Charlo",
        shortLocation: "Jermall",
        name: "Hitman Charlo",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31022",
        location: "Sergiy Derevyanchenk",
        shortLocation: "Sergiy",
        name: "The Technician Derevyanchenk",
        country: "UKRAINE"
    },
    {
        _id: "19823783734d1d04a1b31023",
        location: "Jermell Charlo",
        shortLocation: "Jermell",
        name: "Iron Man Charlo",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31024",
        location: "Jeison Rosario",
        shortLocation: "Jeison",
        name: "Banana Man Rosario",
        country: "DOMINICAN REPUBLIC"
    },
    {
        _id: "19823783734d1d04a1b31025",
        location: "Roman Gonzalez",
        shortLocation: "Roman",
        name: "Chocolatito Gonzalez",
        country: "NICARAGUA"
    },
    {
        _id: "19823783734d1d04a1b31026",
        location: "Israel Gonzalez",
        shortLocation: "Israel",
        name: "Jiga Gonzalez",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b31027",
        location: "Gervonta Davis",
        shortLocation: "Gervonta",
        name: "Tank Davis",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31028",
        location: "Leo Santa Cruz",
        shortLocation: "Leo",
        name: "The Earthquake Santa Cruz",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b31029",
        location: "Naoya Inoue",
        shortLocation: "Naoya",
        name: "The Monster Inoue",
        country: "JAPAN"
    },
    {
        _id: "19823783734d1d04a1b3102a",
        location: "Jason Moloney",
        shortLocation: "Jason",
        name: "The Smooth One Moloney",
        country: "AUSTRALIA"
    },
    {
        _id: "19823783734d1d04a1b3102b",
        location: "Terence Crawford",
        shortLocation: "Terence",
        name: "Bud Crawford",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3102c",
        location: "Kell Brook",
        shortLocation: "Kell",
        name: "Special K Brook",
        country: "ENGLAND"
    },
    {
        _id: "19823783734d1d04a1b3102d",
        location: "Chris Colbert",
        shortLocation: "Chris",
        name: "Prime Time Colbert",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3102e",
        location: "Jaime Arboleda",
        shortLocation: "Jaime",
        name: "The Smooth One Arboleda",
        country: "PANAMA"
    },
    {
        _id: "19823783734d1d04a1b3102f",
        location: "Oleksandr Usyk",
        shortLocation: "Oleksandr",
        name: "The Cat Usyk",
        country: "UKRAINE"
    },
    {
        _id: "19823783734d1d04a1b31030",
        location: "Shakur Stevenson",
        shortLocation: "Shakur",
        name: "Sugar Stevenson",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31031",
        location: "Jamel Herring",
        shortLocation: "Jamel",
        name: "Semper Fi Herring",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b31032",
        location: "Caleb Plant",
        shortLocation: "Caleb",
        name: "Sweethands Plant",
        country: "USA"
    }
];

const ufcCompetitors = [
    {
        _id: "19823783734d1d04a1b32001",
        location: 'Yair Rodriguez',
        shortLocation: "Yair",
        name: "El Pantera Rodriguez",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b32002",
        location: 'Jeremy Stephens',
        shortLocation: "Jeremy",
        name: "Lil' Heathen Stephens",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32003",
        location: 'Carla Esparza',
        shortLocation: "Carla",
        name: "Cookie Monster Esparza",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b32004",
        location: 'Alexa Grasso',
        shortLocation: "Alexa",
        name: "Grasso",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32005",
        location: 'Gunnar Nelson',
        shortLocation: "Gunnar",
        name: "Gunni Nelson",
        country: "ICELAND"
    },
    {
        _id: "19823783734d1d04a1b32006",
        location: 'Gilbert Burns',
        shortLocation: "Gilbert",
        name: "Durinho Burns",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32007",
        location: 'Mark Madsen',
        shortLocation: "Mark",
        name: "Mad Dog Madsen",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32008",
        location: 'Danilo Belluardo',
        shortLocation: "Danilo",
        name: "Caterpillar Belluardo",
        country: "ITALY"
    },
    {
        _id: "19823783734d1d04a1b32009",
        location: 'Jack Hermansson',
        shortLocation: "Jack",
        name: "The Joker Hermansson",
        country: "SWEDEN"
    },
    {
        _id: "19823783734d1d04a1b3200a",
        location: 'Jared Cannonier',
        shortLocation: "Jared",
        name: "The Killa Gorilla Cannonier",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3200b",
        location: 'Katlyn Chookagian',
        shortLocation: "Katlyn",
        name: "Blonde Fighter Chookagian",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3200c",
        location: 'Jennifer Maia',
        shortLocation: "Jennifer",
        name: "Maia",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b3200d",
        location: 'Corey Anderson',
        shortLocation: "Corey",
        name: "Overtime Anderson",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3200e",
        location: 'Johnny Walker',
        shortLocation: "Johnny",
        name: "Walker",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b3200f",
        location: 'Derrick Lewis',
        shortLocation: "Derrick",
        name: "The Black Beast Lewis",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32010",
        location: 'Blagoy Ivanov',
        shortLocation: "Blagoy",
        name: "Baga Ivanov",
        country: "BULGARIA"
    },
    {
        _id: "19823783734d1d04a1b32011",
        location: 'Jorge Masvidal',
        shortLocation: "Jorge",
        name: "Gamebred Masvidal",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32012",
        location: 'Nate Diaz',
        shortLocation: "Nate",
        name: "The Stockton Slugger Diaz",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32013",
        location: 'Stefan Struve',
        shortLocation: "Stefan",
        name: "Skyscraper Struve",
        country: "NETHERLANDS"
    },
    {
        _id: "19823783734d1d04a1b32014",
        location: 'Ben Rothwell',
        shortLocation: "Ben",
        name: "Big Ben Rothwell",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32015",
        location: 'Marina Rodriguez',
        shortLocation: "Marina",
        name: "Rodriguez",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32016",
        location: 'Cynthia Calvillo',
        shortLocation: "Cynthia",
        name: "Calvillo",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32017",
        location: 'Alistair Overeem',
        shortLocation: "Alistair",
        name: "The Reem Overeem",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32018",
        location: 'Jairzinho Rozenstruik',
        shortLocation: "Jairzinho",
        name: "Bigi Boy Rozenstruik",
        country: "SURINAME"
    },
    {
        _id: "19823783734d1d04a1b32019",
        location: 'Israel Adesanya',
        shortLocation: "Israel",
        name: "The Last Stylebender Adesanya",
        country: "NIGERIA"
    },
    {
        _id: "19823783734d1d04a1b3201f",
        location: 'Paulo Costa',
        shortLocation: "Paulo",
        name: "Borrachinha Costa",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32020",
        location: 'Dominick Reyes',
        shortLocation: "Dominick",
        name: "The Devastator Reyes",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32021",
        location: 'Jan Blachowicz',
        shortLocation: "Jan",
        name: "Prince of Cieszyn Błachowicz",
        country: "POLAND"
    },
    {
        _id: "19823783734d1d04a1b32022",
        location: 'Holly Holm',
        shortLocation: "Holly",
        name: "The Preacher's Daughter Holm",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32023",
        location: 'Irene Aldana',
        shortLocation: "Irene",
        name: "Aldana",
        country: "MEXICO"
    },
    {
        _id: "19823783734d1d04a1b32024",
        location: 'Marlon Moraes',
        shortLocation: "Marlon",
        name: "Magic Moraes",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32025",
        location: 'Cory Sandhagen',
        shortLocation: "Cory",
        name: "The Sandman Sandhagen",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32026",
        location: 'Brian Ortega',
        shortLocation: "Brian",
        name: "T-City Ortega",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32027",
        location: 'Chan Sung Jung',
        shortLocation: "Chan",
        name: "The Korean Zombie Jung",
        country: "SOUTH KOREA"
    },
    {
        _id: "19823783734d1d04a1b32028",
        location: 'Khabib Nurmagomedov',
        shortLocation: "Khabib",
        name: "The Eagle Nurmagomedov",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b32029",
        location: 'Justin Gaethje',
        shortLocation: "Justin",
        name: "The Highlight Gaethje",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3202a",
        location: 'Uriah Hall',
        shortLocation: "Uriah",
        name: "Prime Time Hall",
        country: "JAMAICA"
    },
    {
        _id: "19823783734d1d04a1b3202b",
        location: 'Anderson Silva',
        shortLocation: "Anderson",
        name: "The Spider Silva",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b3202c",
        location: 'Thiago Santos',
        shortLocation: "Thiago",
        name: "Marreta Santos",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b3202d",
        location: 'Glover Teixeira',
        shortLocation: "Glover",
        name: "Teixeira",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b3202e",
        location: 'Islam Makhachev',
        shortLocation: "Islam",
        name: "Makhachev",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b3202f",
        location: 'Rafael dos Anjos',
        shortLocation: "Rafael",
        name: "Anjos",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32030",
        location: 'Robert Whittaker',
        shortLocation: "Robert",
        name: "Bobby Knuckles Whittaker",
        country: "AUSTRALIA"
    },
    {
        _id: "19823783734d1d04a1b32031",
        location: 'Deiveson Figueiredo',
        shortLocation: "Deiveson",
        name: "Deus da Guerra Figueiredo",
        country: "BRAZIL"
    },
    {
        _id: "19823783734d1d04a1b32032",
        location: 'Alex Perez',
        shortLocation: "Alex",
        name: "Perez",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32033",
        location: 'Valentina Shevchenko',
        shortLocation: "Valentina",
        name: "Shevchenko",
        country: "RUSSIA"
    },
    {
        _id: "19823783734d1d04a1b32034",
        location: 'Nick Diaz',
        shortLocation: "Nick",
        name: "It's just Nick Diaz",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32035",
        location: 'Robbie Lawler',
        shortLocation: "Robbie",
        name: "Ruthless Lawler",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b32036",
        location: 'Kamaru Usman',
        shortLocation: "Kamaru",
        name: "The Nigerian Nightmare Usman",
        country: "NIGERIA"
    },
    {
        _id: "19823783734d1d04a1b32037",
        location: 'Colby Covington',
        shortLocation: "Colby",
        name: "Chaos Covington",
        country: "USA"
    }
];

const nba2kCompetitors = [
    {
        _id: "19823783734d1d04a1b34001",
        location: 'Domantas Sabonis',
        shortLocation: "Domantas",
        name: "Sabonis - IND Pacers",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34002",
        location: 'Montrezl Harrell',
        shortLocation: "Montrezl",
        name: "Harrell - LA Clippers",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34003",
        location: 'Rui Hachimura',
        shortLocation: "Rui",
        name: "Hachimura - WSH Wizards",
        country: "JAPAN"
    },
    {
        _id: "19823783734d1d04a1b34004",
        location: 'Donovan Mitchell',
        shortLocation: "Donovan",
        name: "Mitchell - UTAH Jazz",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34005",
        location: 'Michael Porter Jr.',
        shortLocation: "Michael",
        name: "Porter Jr. - DEN Nuggets",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34006",
        location: 'Devin Booker',
        shortLocation: "Devin",
        name: "Booker - PHX Suns",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34007",
        location: 'DeMarcus Cousins',
        shortLocation: "DeMarcus",
        name: "Cousins - Mobile, Alabama",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34008",
        location: 'Andre Drummond',
        shortLocation: "Andre",
        name: "Drummond - CLE Cavaliers",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b34009",
        location: 'Derrick Jones Jr.',
        shortLocation: "Derrick",
        name: "Jones Jr. - MIA Heat",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3400a",
        location: 'Trae Young',
        shortLocation: "Trae",
        name: "Young - ATL Hawks",
        country: "USA"
    },
    {
        _id: "19823783734d1d04a1b3400b",
        location: 'Deandre Ayton',
        shortLocation: "Deandre",
        name: "Ayton - PHX Suns",
        country: "BAHAMAS"
    },
    {
        _id: "19823783734d1d04a1b3400c",
        location: 'Patrick Beverley',
        shortLocation: "Patrick",
        name: "Beverley - LA Clippers",
        country: "USA"
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
        name: "Football Team",
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
        location: 'Las Vegas',
        shortLocation: "LV",
        name: "Raiders",
        color: "#C4C9CC"
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

const ncaaTeams = [
    {
        _id: "5b84a2889a4c08bca6ab9000",
        leagueId: "59723313734d1d6202a85f15",
        location: "Florida Atlantic",
        shortLocation: "FAU",
        name: "Owls",
        color: '#003366',
    },
    {
        _id: "5b84a2889a4c08bca6ab9001",
        leagueId: "59723313734d1d6202a85f15",
        location: "Texas Christian",
        shortLocation: "TCU",
        name: "Horned Frogs",
        color: '#4D1979',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9002",
        leagueId: "59723313734d1d6202a85f15",
        location: "Clemson",
        shortLocation: "CLEM",
        name: "Tigers",
        color: '#F56600',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9003",
        leagueId: "59723313734d1d6202a85f15",
        location: "Appalachian State",
        shortLocation: "APP",
        name: "Mountaineers",
        color: '#FFCC00',
    },
    {
        _id: "5b84a2889a4c08bca6ab9004",
        leagueId: "59723313734d1d6202a85f15",
        location: "Auburn",
        shortLocation: "AUB",
        name: "Tigers",
        color: '#E87722',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9005",
        leagueId: "59723313734d1d6202a85f15",
        location: "Oklahoma",
        shortLocation: "OU",
        name: "Sooners",
        color: '#841617',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9006",
        leagueId: "59723313734d1d6202a85f15",
        location: "Ohio State",
        shortLocation: "OSU",
        name: "Buckeyes",
        color: '#BB0000',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9007",
        leagueId: "59723313734d1d6202a85f15",
        location: "Texas",
        shortLocation: "TEX",
        name: "Longhorns",
        color: '#BF5700',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9008",
        leagueId: "59723313734d1d6202a85f15",
        location: "Maryland",
        shortLocation: "MD",
        name: "Terrapins",
        color: '#E03A3E',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9009",
        leagueId: "59723313734d1d6202a85f15",
        location: "Georgia",
        shortLocation: "UGA",
        name: "Bulldogs",
        color: '#BA0C2F',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab900a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Washington",
        shortLocation: "WASH",
        name: "Huskies",
        color: '#4B2E83',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab900b",
        leagueId: "59723313734d1d6202a85f15",
        location: "Penn State",
        shortLocation: "PSU",
        name: "Nittany Lions",
        color: '#041E42',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab900c",
        leagueId: "59723313734d1d6202a85f15",
        location: "UNLV",
        shortLocation: "UNLV",
        name: "Rebels",
        color: '#CF0A2C',
    },
    {
        _id: "5b84a2889a4c08bca6ab900d",
        leagueId: "59723313734d1d6202a85f15",
        location: "USC",
        shortLocation: "USC",
        name: "Trojans",
        color: '#990000',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab900e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Boise State",
        shortLocation: "BSU",
        name: "Broncos",
        color: '#D64309',
    },
    {
        _id: "5b84a2889a4c08bca6ab900f",
        leagueId: "59723313734d1d6202a85f15",
        location: "Mississippi State",
        shortLocation: "MSST",
        name: "Bulldogs",
        color: '#660000',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9010",
        leagueId: "59723313734d1d6202a85f15",
        location: "Notre Dame",
        shortLocation: "ND",
        name: "Fighting Irish",
        color: '#AE9142',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9011",
        leagueId: "59723313734d1d6202a85f15",
        location: "Bowling Green",
        shortLocation: "BGSU",
        name: "Falcons",
        color: '#FE5000',
    },
    {
        _id: "5b84a2889a4c08bca6ab9012",
        leagueId: "59723313734d1d6202a85f15",
        location: "Miami",
        shortLocation: "MIAMI",
        name: "Hurricanes",
        color: '#F47321',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9013",
        leagueId: "59723313734d1d6202a85f15",
        location: "Tennessee",
        shortLocation: "TENN",
        name: "Volunteers",
        color: '#FF8200',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9014",
        leagueId: "59723313734d1d6202a85f15",
        location: "West Virginia",
        shortLocation: "WVU",
        name: "Mountaineers",
        color: '#002855',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9015",
        leagueId: "59723313734d1d6202a85f15",
        location: "Troy",
        shortLocation: "TROY",
        name: "Trojans",
        color: '#9E0531',
    },
    {
        _id: "5b84a2889a4c08bca6ab9016",
        leagueId: "59723313734d1d6202a85f15",
        location: "Oregon",
        shortLocation: "ORE",
        name: "Ducks",
        color: '#154733',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9017",
        leagueId: "59723313734d1d6202a85f15",
        location: "Florida State",
        shortLocation: "FSU",
        name: "Seminoles",
        color: '#782F40',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9018",
        leagueId: "59723313734d1d6202a85f15",
        location: "Michigan",
        shortLocation: "MICH",
        name: "Wolverines",
        color: '#FFCB05',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9019",
        leagueId: "59723313734d1d6202a85f15",
        location: "Louisville",
        shortLocation: "LOU",
        name: "Cardinals",
        color: '#AD0000',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab901a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Alabama",
        shortLocation: "ALA",
        name: "Crimson Tide",
        color: "#9E1B32",
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab901b",
        leagueId: "59723313734d1d6202a85f15",
        location: "LSU",
        shortLocation: "LSU",
        name: "Tigers",
        color: '#461D7C',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab901c",
        leagueId: "59723313734d1d6202a85f15",
        location: "Virginia Tech",
        shortLocation: "VT",
        name: "Hokies",
        color: '#630031',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab901d",
        leagueId: "59723313734d1d6202a85f15",
        location: "William & Mary",
        shortLocation: "W&M",
        alternateName: "W&am;M",
        name: "Tribe",
        color: '#115740',
    },
    {
        _id: "5b84a2889a4c08bca6ab901e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Portland State",
        shortLocation: "PRST",
        name: "Vikings",
        color: '#154734',
    },
    {
        _id: "5b84a2889a4c08bca6ab901f",
        leagueId: "59723313734d1d6202a85f15",
        location: "North Dakota",
        shortLocation: "UND",
        name: "Fighting Hawks",
        color: '#009A44',
    },
    {
        _id: "5b84a2889a4c08bca6ab9020",
        leagueId: "59723313734d1d6202a85f15",
        location: "Youngstown State",
        shortLocation: "YSU",
        name: "Penguins",
        color: '#C8102E',
    },
    {
        _id: "5b84a2889a4c08bca6ab9021",
        leagueId: "59723313734d1d6202a85f15",
        location: "UCF",
        shortLocation: "UCF",
        name: 'Knights',
        color: "#AE9142"
    },
    {
        _id: "5b84a2889a4c08bca6ab9022",
        leagueId: "59723313734d1d6202a85f15",
        location: "UConn",
        shortLocation: "CONN",
        name: "Huskies",
        color: "#000E2F"
    },
    {
        _id: "5b84a2889a4c08bca6ab9023",
        leagueId: "59723313734d1d6202a85f15",
        location: "Utah",
        shortLocation: "UTAH",
        name: "Utes",
        color: '#CC0000',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9024",
        leagueId: "59723313734d1d6202a85f15",
        location: "Michigan State",
        shortLocation: "MSU",
        name: 'Spartans',
        color: '#18453B',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9025",
        leagueId: "59723313734d1d6202a85f15",
        location: "Stanford",
        shortLocation: "STAN",
        name: "Cardinal",
        color: '#8C1515',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9026",
        leagueId: "59723313734d1d6202a85f15",
        location: "Western Kentucky",
        shortLocation: "WKU",
        name: "Hilltoppers",
        color: '#C60C30',
    },
    {
        _id: "5b84a2889a4c08bca6ab9027",
        leagueId: "59723313734d1d6202a85f15",
        location: "San Diego State",
        shortLocation: "SDSU",
        name: "Aztecs",
        color: '#A6192E',
    },
    {
        _id: "5b84a2889a4c08bca6ab9028",
        leagueId: "59723313734d1d6202a85f15",
        location: "Wisconsin",
        shortLocation: "WISC",
        name: "Badgers",
        color: '#C5050C',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9029",
        leagueId: "59723313734d1d6202a85f15",
        location: "Oregon State",
        shortLocation: "ORST",
        name: "Beavers",
        color: '#DC4405',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab902a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Austin Peay",
        shortLocation: "PEAY",
        name: "Governors",
        color: '#ba0c2f',
    },
    {
        _id: "5b84a2889a4c08bca6ab902c",
        leagueId: "59723313734d1d6202a85f15",
        location: "Stephen F. Austin",
        shortLocation: "SFA",
        name: "Lumberjacks",
        color: '#5f259f',
    },
    {
        _id: "5b84a2889a4c08bca6ab902d",
        leagueId: "59723313734d1d6202a85f15",
        location: "Furman",
        shortLocation: "FUR",
        name: "Paladins",
        color: '#201547',
    },
    {
        _id: "5b84a2889a4c08bca6ab902e",
        leagueId: "59723313734d1d6202a85f15",
        location: "New Mexico",
        shortLocation: "UNM",
        name: "Lobos",
        color: '#BA0C2F',
    },
    {
        _id: "5b84a2889a4c08bca6ab902f",
        leagueId: "59723313734d1d6202a85f15",
        location: "SMU",
        shortLocation: "SMU",
        name: "Mustangs",
        color: '#0033A0',
    },
    {
        _id: "5b84a2889a4c08bca6ab9030",
        leagueId: "59723313734d1d6202a85f15",
        location: "Western Michigan",
        shortLocation: "WMU",
        name: "Broncos",
        color: '#6C4023',
    },
    {
        _id: "5b84a2889a4c08bca6ab9031",
        leagueId: "59723313734d1d6202a85f15",
        location: "Kansas State",
        shortLocation: "KSU",
        name: "Wildcats",
        color: '#512888',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9032",
        leagueId: "59723313734d1d6202a85f15",
        location: "UCLA",
        shortLocation: "UCLA",
        name: "Bruins",
        color: '#2D68C4',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9033",
        leagueId: "59723313734d1d6202a85f15",
        location: "Arkansas State",
        shortLocation: "ARST",
        name: "Red Wolves",
        color: '#CC092F'
    },
    {
        _id: "5b84a2889a4c08bca6ab9034",
        leagueId: "59723313734d1d6202a85f15",
        location: "South Carolina",
        shortLocation: "SC",
        name: "Gamecocks",
        color: '#73000A',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9035",
        leagueId: "59723313734d1d6202a85f15",
        location: "Rutgers",
        shortLocation: "RUTG",
        name: "Scarlet Knights",
        color: '#CC0033',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9036",
        leagueId: "59723313734d1d6202a85f15",
        location: "South Carolina State",
        shortLocation: "SCST",
        name: "Bulldogs",
        color: '#041E42',
    },
    {
        _id: "5b84a2889a4c08bca6ab9037",
        leagueId: "59723313734d1d6202a85f15",
        location: "Ball State",
        shortLocation: "BALL",
        name: "Cardinals",
        color: '#BA0C2F',
    },
    {
        _id: "5b84a2889a4c08bca6ab9038",
        leagueId: "59723313734d1d6202a85f15",
        location: "Savannah State",
        shortLocation: "SAV",
        name: "Tigers",
        color: '#ff5b00',
    },
    {
        _id: "5b84a2889a4c08bca6ab9039",
        leagueId: "59723313734d1d6202a85f15",
        location: "Texas A M",
        shortLocation: "TA&M",
        alternateName: "TA&amp;M",
        name: "Aggies",
        color: '#500000',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9040",
        leagueId: "59723313734d1d6202a85f15",
        location: "Kentucky",
        shortLocation: "UK",
        name: "Wildcats",
        color: '#0033A0',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9041",
        leagueId: "59723313734d1d6202a85f15",
        location: "Alabama State",
        shortLocation: "ALST",
        name: "Hornets",
        color: '#d4ac2a'
    },
    {
        _id: "5b84a2889a4c08bca6ab9042",
        leagueId: "59723313734d1d6202a85f15",
        location: "Southeastern Louisiana",
        shortLocation: "SELA",
        name: "Lions",
        color: '#AE9142'
    },
    {
        _id: "5b84a2889a4c08bca6ab9043",
        leagueId: "59723313734d1d6202a85f15",
        location: "Pittsburgh",
        shortLocation: "PITT",
        name: "Panthers",
        color: '#003594',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9044",
        leagueId: "59723313734d1d6202a85f15",
        location: "Florida",
        shortLocation: "FLA",
        name: "Gators",
        color: '#0021A5',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9045",
        leagueId: "59723313734d1d6202a85f15",
        location: "Arizona State",
        shortLocation: "ASU",
        name: "Sun Devils",
        color: '#8C1D40',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9046",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Washington State',
        shortLocation: "WSU",
        name: "Cougars",
        color: "#981E32",
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9047",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Houston',
        shortLocation: "HOU",
        name: "Cougars",
        color: '#C8102E'
    },
    {
        _id: "5b84a2889a4c08bca6ab9048",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Indiana',
        shortLocation: "IU",
        name: "Hoosiers",
        color: '#990000',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9049",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Temple',
        shortLocation: "TEM",
        name: "Owls",
        color: '#9D2235',
    },
    {
        _id: "5b84a2889a4c08bca6ab904a",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Brigham Young',
        shortLocation: "BYU",
        name: "Cougars",
        color: '#002E5D'
    },
    {
        _id: "5b84a2889a4c08bca6ab904b",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Iowa',
        shortLocation: "IOWA",
        name: "Hawkeyes",
        color: '#FFCD00',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab904c",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Iowa State',
        shortLocation: "ISU",
        name: "Cyclones",
        color: '#C8102E',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab904d",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Idaho State',
        shortLocation: "IDST",
        name: "Bengals",
        color: '#FF671F'
    },
    {
        _id: "5b84a2889a4c08bca6ab904e",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Kent State',
        shortLocation: "KENT",
        name: "Golden Flashes",
        color: '#002664'
    },
    {
        _id: "5b84a2889a4c08bca6ab904f",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Lamar',
        shortLocation: "LAM",
        name: "Cardinals",
        color: '#990000'
    },
    {
        _id: "5b84a2889a4c08bca6ab9050",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Syracuse',
        shortLocation: "SYR",
        name: "Orange",
        color: '#D44500',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9051",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Northwestern',
        shortLocation: "NW",
        name: "Wildcats",
        color: '#4E2A84',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9052",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Hawaii',
        shortLocation: "HAW",
        name: "Warriors",
        color: '#024731'
    },
    {
        _id: "5b84a2889a4c08bca6ab9053",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Virginia',
        shortLocation: "UVA",
        name: "Cavaliers",
        color: '#F84C1E',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9054",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Rice',
        shortLocation: "RICE",
        name: "Owls",
        color: '#00205B'
    },
    {
        _id: "5b84a2889a4c08bca6ab9055",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Montana',
        shortLocation: "MONT",
        name: "Grizzlies",
        color: '#660033'
    },
    {
        _id: "5b84a2889a4c08bca6ab9056",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Air Force',
        shortLocation: "AFA",
        name: "Falcons",
        color: '#003087'
    },
    {
        _id: "5b84a2889a4c08bca6ab9057",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Southern Mississippi',
        shortLocation: "USM",
        name: "Eagles",
        color: '#FFAB00'
    },
    {
        _id: "5b84a2889a4c08bca6ab9058",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Vanderbilt',
        shortLocation: "VAN",
        name: "Commodores",
        color: '#866D4B',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9059",
        leagueId: "59723313734d1d6202a85f15",
        location: 'California',
        shortLocation: "CAL",
        name: "Golden Bears",
        color: '#003262',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab905a",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Ole Miss',
        shortLocation: "MISS",
        name: "Rebels",
        color: '#CE1126',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab905b",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Miami (OH)',
        shortLocation: "M-OH",
        name: "Redhawks",
        color: '#B61E2E'
    },
    {
        _id: "5b84a2889a4c08bca6ab905c",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Old Dominion',
        shortLocation: "ODU",
        name: "Monarchs",
        color: '#003057'
    },
    {
        _id: "5b84a2889a4c08bca6ab905d",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Charlotte',
        shortLocation: "CLT",
        name: "49ers",
        color: '#046A38'
    },
    {
        _id: "5b84a2889a4c08bca6ab905e",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Oklahoma State',
        shortLocation: "OKST",
        name: "Cowboys",
        color: '#FF7300',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab905f",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Colorado',
        shortLocation: "COLO",
        name: "Buffaloes",
        color: '#CFB87C',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab9060",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Texas Tech',
        shortLocation: "TTU",
        name: "Red Raiders",
        color: '#CC0000',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9061",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Middle Tennessee State',
        shortLocation: "MTSU",
        name: "Blue Raiders",
        color: '#0066CC'
    },
    {
        _id: "5b84a2889a4c08bca6ab9062",
        leagueId: "59723313734d1d6202a85f15",
        location: 'North Carolina',
        shortLocation: "UNC",
        name: "Tar Heels",
        color: '#7BAFD4',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9063",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Towson',
        shortLocation: "TOW",
        name: "Tigers",
        color: '#FFCB05'
    },
    {
        _id: "5b84a2889a4c08bca6ab9064",
        leagueId: "59723313734d1d6202a85f15",
        location: 'Nebraska',
        shortLocation: "NEB",
        name: "Cornhuskers",
        color: '#E41C38',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9065",
        leagueId: "59723313734d1d6202a85f15",
        location: "Arkansas",
        shortLocation: "ARK",
        name: "Razorbacks",
        color: '#9D2235',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9066",
        leagueId: "59723313734d1d6202a85f15",
        location: "Utah State",
        shortLocation: "USU",
        name: "Aggies",
        color: '#0F2439'
    },
    {
        _id: "5b84a2889a4c08bca6ab9067",
        leagueId: "59723313734d1d6202a85f15",
        location: "Kansas",
        shortLocation: "KU",
        name: "Jayhawks",
        color: '#0051BA',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab9068",
        leagueId: "59723313734d1d6202a85f15",
        location: "Purdue",
        shortLocation: "PUR",
        name: "Boilermakers",
        color: '#CEB888',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9069",
        leagueId: "59723313734d1d6202a85f15",
        location: "Tulsa",
        shortLocation: "TLSA",
        name: "Golden Hurricane",
        color: '#F5002E'
    },
    {
        _id: "5b84a2889a4c08bca6ab906a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Cincinnati",
        shortLocation: "CIN",
        name: "Bearcats",
        color: '#E00122'
    },
    {
        _id: "5b84a2889a4c08bca6ab906b",
        leagueId: "59723313734d1d6202a85f15",
        location: "Illinois",
        shortLocation: "ILL",
        name: "Fighting Illini",
        color: '#E84A27',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab906c",
        leagueId: "59723313734d1d6202a85f15",
        location: "Memphis",
        shortLocation: "MEM",
        name: "Tigers",
        color: '#003087'
    },
    {
        _id: "5b84a2889a4c08bca6ab906d",
        leagueId: "59723313734d1d6202a85f15",
        location: "Baylor",
        shortLocation: "BAY",
        name: "Bears",
        color: '#003015',
        conference: 'big12'
    },
    {
        _id: "5b84a2889a4c08bca6ab906e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Wake Forest",
        shortLocation: "WAKE",
        name: "Demon Deacons",
        color: '#9E7E38',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab906f",
        leagueId: "59723313734d1d6202a85f15",
        location: "Louisiana Monroe",
        shortLocation: "ULM",
        name: "Warhawks",
        color: '#800029'
    },
    {
        _id: "5b84a2889a4c08bca6ab9070",
        leagueId: "59723313734d1d6202a85f15",
        location: "Missouri",
        shortLocation: "MIZ",
        name: "Tigers",
        color: '#F1B82D',
        conference: "sec"
    },
    {
        _id: "5b84a2889a4c08bca6ab9071",
        leagueId: "59723313734d1d6202a85f15",
        location: "Boston College",
        shortLocation: "BC",
        name: "Eagles",
        color: '#98002E',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9072",
        leagueId: "59723313734d1d6202a85f15",
        location: "Minnesota",
        shortLocation: "MINN",
        name: "Golden Gophers",
        color: '#7A0019',
        conference: 'big10'
    },
    {
        _id: "5b84a2889a4c08bca6ab9073",
        leagueId: "59723313734d1d6202a85f15",
        location: "South Alabama",
        shortLocation: "USA",
        name: "Jaguars",
        color: '#00205B'
    },
    {
        _id: "5b84a2889a4c08bca6ab9074",
        leagueId: "59723313734d1d6202a85f15",
        location: "Wofford",
        shortLocation: "WOF",
        name: "Terriers",
        color: '#886E4C'
    },
    {
        _id: "5b84a2889a4c08bca6ab9075",
        leagueId: "59723313734d1d6202a85f15",
        location: "East Carolina",
        shortLocation: "ECU",
        name: "Pirates",
        color: '#592A8A'
    },
    {
        _id: "5b84a2889a4c08bca6ab9076",
        leagueId: "59723313734d1d6202a85f15",
        location: "San Jose State",
        shortLocation: "SJSU",
        name: "Spartans",
        color: '#0055A2'
    },
    {
        _id: "5b84a2889a4c08bca6ab9077",
        leagueId: "59723313734d1d6202a85f15",
        location: "NC State",
        shortLocation: "NCST",
        name: "Wolfpack",
        color: '#CC0000',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9078",
        leagueId: "59723313734d1d6202a85f15",
        location: "Duke",
        shortLocation: "DUKE",
        name: "Blue Devils",
        color: '#003087',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9079",
        leagueId: "59723313734d1d6202a85f15",
        location: "Wyoming",
        shortLocation: "WYO",
        name: "Cowboys",
        color: '#492F24'
    },
    {
        _id: "5b84a2889a4c08bca6ab907a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Arizona",
        shortLocation: "ARIZ",
        name: "Wildcats",
        color: '#CC0033',
        conference: "pac12"
    },
    {
        _id: "5b84a2889a4c08bca6ab907b",
        leagueId: "59723313734d1d6202a85f15",
        location: "Georgia State",
        shortLocation: "GAST",
        name: "Panthers",
        color: '#0039A6'
    },
    {
        _id: "5b84a2889a4c08bca6ab907c",
        leagueId: "59723313734d1d6202a85f15",
        location: "Navy",
        shortLocation: "NAVY",
        name: "Midshipmen",
        color: '#C5B783'
    },
    {
        _id: "5b84a2889a4c08bca6ab907d",
        leagueId: "59723313734d1d6202a85f15",
        location: "Western Carolina",
        shortLocation: "WCU",
        name: "Catamounts",
        color: '#592C88'
    },
    {
        _id: "5b84a2889a4c08bca6ab907e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Samford",
        shortLocation: "SAM",
        name: "Bulldogs",
        color: '#002649'
    },
    {
        _id: "5b84a2889a4c08bca6ab907f",
        leagueId: "59723313734d1d6202a85f15",
        location: "Texas State",
        shortLocation: "TXST",
        name: "Bobcats",
        color: '#501214'
    },
    {
        _id: "5b84a2889a4c08bca6ab9080",
        leagueId: "59723313734d1d6202a85f15",
        location: "Colorado State",
        shortLocation: "CSU",
        name: "Rams",
        color: '#1E4D2B'
    },
    {
        _id: "5b84a2889a4c08bca6ab9081",
        leagueId: "59723313734d1d6202a85f15",
        location: "Georgia Tech",
        shortLocation: "GT",
        name: "Yellow Jackets",
        color: '#B3A369',
        conference: "acc"
    },
    {
        _id: "5b84a2889a4c08bca6ab9082",
        leagueId: "59723313734d1d6202a85f15",
        location: "Tulane",
        shortLocation: "TULN",
        name: "Green Wave",
        color: '#006747'
    },
    {
        _id: "5b84a2889a4c08bca6ab9083",
        leagueId: "59723313734d1d6202a85f15",
        location: "Georgia Southern",
        shortLocation: "GASO",
        name: "Eagles",
        color: '#011E41'
    },
    {
        _id: "5b84a2889a4c08bca6ab9084",
        leagueId: "59723313734d1d6202a85f15",
        location: "Nevada",
        shortLocation: "NEV",
        name: "Wild Cats",
        color: '#011E41'
    },
    {
        _id: "5b84a2889a4c08bca6ab9085",
        leagueId: "59723313734d1d6202a85f15",
        location: "Evansville",
        shortLocation: "EVAN",
        name: "Purple Aces",
        color: '#52237F'
    },
    {
        _id: "5b84a2889a4c08bca6ab9086",
        leagueId: "59723313734d1d6202a85f15",
        location: "Central Arkansas",
        shortLocation: "UCA",
        name: "Bears",
        color: '#4f2d7f'
    },
    {
        _id: "5b84a2889a4c08bca6ab9087",
        leagueId: "59723313734d1d6202a85f15",
        location: "Xavier",
        shortLocation: "XAV",
        name: "Musketeers",
        color: '#0C2340'
    },
    {
        _id: "5b84a2889a4c08bca6ab9088",
        leagueId: "59723313734d1d6202a85f15",
        location: "Gonzaga",
        shortLocation: "GONZ",
        name: "Bulldogs",
        color: '#C8102E'
    },
    {
        _id: "5b84a2889a4c08bca6ab9089",
        leagueId: "59723313734d1d6202a85f15",
        location: "Denver",
        shortLocation: "DEN",
        name: "Pioneers",
        color: '#8B2332'
    },
    {
        _id: "5b84a2889a4c08bca6ab908a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Mt. St. Mary's",
        shortLocation: "MSM",
        name: "Mountaineers",
        color: '#002F6C'
    },
    {
        _id: "5b84a2889a4c08bca6ab908b",
        leagueId: "59723313734d1d6202a85f15",
        location: "Virginia Commonwealth",
        shortLocation: "VCU",
        name: "Rams",
        color: '#FFB300'
    },
    {
        _id: "5b84a2889a4c08bca6ab908c",
        leagueId: "59723313734d1d6202a85f15",
        location: "Villanova",
        shortLocation: "VILL",
        name: "Wildcats",
        color: '#00205B'
    },
    {
        _id: "5b84a2889a4c08bca6ab908d",
        leagueId: "59723313734d1d6202a85f15",
        location: "Indiana State",
        shortLocation: "INST",
        name: "Sycamores",
        color: '#0142BC'
    },
    {
        _id: "5b84a2889a4c08bca6ab908e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Houston Baptist",
        shortLocation: "HB",
        name: "Huskies",
        color: '#00529b'
    },
    {
        _id: "5b84a2889a4c08bca6ab908f",
        leagueId: "59723313734d1d6202a85f15",
        location: "South Florida",
        shortLocation: "USF",
        name: "Bulls",
        color: '#006747'
    },
    {
        _id: "5b84a2889a4c08bca6ab9090",
        leagueId: "59723313734d1d6202a85f15",
        location: "Yale",
        shortLocation: "YALE",
        name: "Bulldogs",
        color: '#00356B'
    },
    {
        _id: "5b84a2889a4c08bca6ab9091",
        leagueId: "59723313734d1d6202a85f15",
        location: "Arkansas-Pine Bluff",
        shortLocation: "UAPB",
        name: "Golden Lions",
        color: '#eeb310'
    },
    {
        _id: "5b84a2889a4c08bca6ab9092",
        leagueId: "59723313734d1d6202a85f15",
        location: "Grambling",
        shortLocation: "GRAM",
        name: "Tigers",
        color: '#ecaa00'
    },
    {
        _id: "5b84a2889a4c08bca6ab9093",
        leagueId: "59723313734d1d6202a85f15",
        location: "Eastern Michigan",
        shortLocation: "EMU",
        name: "Eagles",
        color: '#006633'
    },
    {
        _id: "5b84a2889a4c08bca6ab9094",
        leagueId: "59723313734d1d6202a85f15",
        location: "Prairie View A&M",
        shortLocation: "PV",
        name: "Panthers",
        color: '#330066'
    },
    {
        _id: "5b84a2889a4c08bca6ab9095",
        leagueId: "59723313734d1d6202a85f15",
        location: "California Baptist",
        shortLocation: "CBU",
        name: "Lancers",
        color: '#041E42'
    },
    {
        _id: "5b84a2889a4c08bca6ab9096",
        leagueId: "59723313734d1d6202a85f15",
        location: "Florida Gulf Coast",
        shortLocation: "FGCU",
        name: "Eagles",
        color: '#007749'
    },
    {
        _id: "5b84a2889a4c08bca6ab9097",
        leagueId: "59723313734d1d6202a85f15",
        location: "Dayton",
        shortLocation: "DAY",
        name: "Flyers",
        color: '#CE1141'
    },
    {
        _id: "5b84a2889a4c08bca6ab9098",
        leagueId: "59723313734d1d6202a85f15",
        location: "Morgan State",
        shortLocation: "MORG",
        name: "Bears",
        color: '#f47937'
    },
    {
        _id: "5b84a2889a4c08bca6ab9099",
        leagueId: "59723313734d1d6202a85f15",
        location: "DePaul",
        shortLocation: "DEP",
        name: "Demons",
        color: '#005EB8'
    },
    {
        _id: "5b84a2889a4c08bca6ab909a",
        leagueId: "59723313734d1d6202a85f15",
        location: "Montreat College",
        shortLocation: "MOCO",
        name: "Cavaliers",
        color: '#041E42'
    },
    {
        _id: "5b84a2889a4c08bca6ab909b",
        leagueId: "59723313734d1d6202a85f15",
        location: "UNC Asheville",
        shortLocation: "UNCA",
        name: "Bulldogs",
        color: '#003DA5'
    },
    {
        _id: "5b84a2889a4c08bca6ab909c",
        leagueId: "59723313734d1d6202a85f15",
        location: "UMass Lowell",
        shortLocation: "UML",
        name: "River Hawks",
        color: '#C8102E'
    },
    {
        _id: "5b84a2889a4c08bca6ab909d",
        leagueId: "59723313734d1d6202a85f15",
        location: "Bryant",
        shortLocation: "BRY",
        name: "Demons",
        color: '#005EB8'
    },
    {
        _id: "5b84a2889a4c08bca6ab909e",
        leagueId: "59723313734d1d6202a85f15",
        location: "Cleveland State",
        shortLocation: "CLEV",
        name: "Vikings",
        color: '#006747'
    },
    {
        _id: "5b84a2889a4c08bca6ab909f",
        leagueId: "59723313734d1d6202a85f15",
        location: "Delaware State",
        shortLocation: "DSU",
        name: "Hornets",
        color: '#EE3124'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a0",
        leagueId: "59723313734d1d6202a85f15",
        location: "Seton Hall",
        shortLocation: "HALL",
        name: "Pirates",
        color: '#004488'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a1",
        leagueId: "59723313734d1d6202a85f15",
        location: "Maine",
        shortLocation: "ME",
        name: "Black Bears",
        color: '#B0D7FF'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a2",
        leagueId: "59723313734d1d6202a85f15",
        location: "Lipscomb",
        shortLocation: "LIP",
        name: "Bisons",
        color: '#F4AA00'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a3",
        leagueId: "59723313734d1d6202a85f15",
        location: "McNeese",
        shortLocation: "MCN",
        name: "Cowboys",
        color: '#00529B'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a4",
        leagueId: "59723313734d1d6202a85f15",
        location: "Sacramento State",
        shortLocation: "SAC",
        name: "Hornets",
        color: '#043927'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a5",
        leagueId: "59723313734d1d6202a85f15",
        location: "La Salle",
        shortLocation: "LAS",
        name: "Explorers",
        color: '#003366'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a6",
        leagueId: "59723313734d1d6202a85f15",
        location: "South Dakota",
        shortLocation: "SDAK",
        name: "Coyotes",
        color: '#AD0000'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a7",
        leagueId: "59723313734d1d6202a85f15",
        location: "Monmouth",
        shortLocation: "MONM",
        name: "Hawks",
        color: '#041E42'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a8",
        leagueId: "59723313734d1d6202a85f15",
        location: "Pepperdine",
        shortLocation: "PEPP",
        name: "Waves",
        color: '#EE7624'
    },
    {
        _id: "5b84a2889a4c08bca6ab90a9",
        leagueId: "59723313734d1d6202a85f15",
        location: "UAB",
        shortLocation: "UAB",
        name: "Blazers",
        color: '#006341'
    },
    {
        _id: "5b84a2889a4c08bca6ab90aa",
        leagueId: "59723313734d1d6202a85f15",
        location: "Winthrop",
        shortLocation: "WIN",
        name: "Eagles",
        color: '#872434'
    },
    {
        _id: "5b84a2889a4c08bca6ab90ab",
        leagueId: "59723313734d1d6202a85f15",
        location: "Louisiana",
        shortLocation: "UL",
        name: "Ragin’ Cajuns",
        color: '#CE181E'
    },
    {
        _id: "5b84a2889a4c08bca6ab90ac",
        leagueId: "59723313734d1d6202a85f15",
        location: "Army",
        shortLocation: "ARMY",
        name: "Black Knights",
        color: '#D4BF91'
    },
    {
        _id: "5b84a2889a4c08bca6ab90ad",
        leagueId: "59723313734d1d6202a85f15",
        location: "Milwaukee",
        shortLocation: "MILW",
        name: "Panthers",
        color: '#FFBD00'
    },
    {
        _id: "5b84a2889a4c08bca6ab90ae",
        leagueId: "59723313734d1d6202a85f15",
        location: "Butler",
        shortLocation: "BUT",
        name: "Bulldogs",
        color: '#13294B'
    },
    {
        _id: "5b84a2889a4c08bca6ab90af",
        leagueId: "59723313734d1d6202a85f15",
        location: "Northern Iowa",
        shortLocation: "UNI",
        name: "Panthers",
        color: '#4B116F'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b0",
        leagueId: "59723313734d1d6202a85f15",
        location: "Omaha",
        shortLocation: "OMA",
        name: "Mavericks",
        color: '#D71920'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b1",
        leagueId: "59723313734d1d6202a85f15",
        location: "UNC Wilmington",
        shortLocation: "UNCW",
        name: "Seahawks",
        color: '#7AC142'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b2",
        leagueId: "59723313734d1d6202a85f15",
        location: "Mercer",
        shortLocation: "MER",
        name: "Bears",
        color: '#F76800'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b3",
        leagueId: "59723313734d1d6202a85f15",
        location: "Buffalo",
        shortLocation: "BUFF",
        name: "Bulls",
        color: '#005BBB'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b4",
        leagueId: "59723313734d1d6202a85f15",
        location: "Central Michigan",
        shortLocation: "CMU",
        name: "Chippewas",
        color: '#6A0032'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b5",
        leagueId: "59723313734d1d6202a85f15",
        location: "Liberty",
        shortLocation: "LIB",
        name: "Flames",
        color: '#990000'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b6",
        leagueId: "59723313734d1d6202a85f15",
        location: "Florida International",
        shortLocation: "FIU",
        name: "Panthers",
        color: '#B6862C'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b7",
        leagueId: "59723313734d1d6202a85f15",
        location: "Marshall",
        shortLocation: "MRSH",
        name: "Thundering Herd",
        color: '#00B140'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b8",
        leagueId: "59723313734d1d6202a85f15",
        location: "Louisiana Tech",
        shortLocation: "LAT",
        name: "Bulldogs",
        color: '#E31B23'
    },
    {
        _id: "5b84a2889a4c08bca6ab90b9",
        leagueId: "59723313734d1d6202a85f15",
        location: "Ohio",
        shortLocation: "OHIO",
        name: "Bobcats",
        color: '#00694E'
    }
];

const premierLeagueTeams = [
    {
        color: "#132257",
        _id: "5b9060e59a4c08bca6d80500",
        leagueId: "59723313734d1d6202a85f17",
        location: "Tottenham",
        shortLocation: "TOT",
        name: "Spurs"
    },
    {
        color: "#00B2A9",
        _id: "5b9060e59a4c08bca6d80501",
        leagueId: "59723313734d1d6202a85f17",
        location: "Liverpool",
        shortLocation: "LIV",
        name: "The Reds"
    },
    {
        color: "#B50E12",
        _id: "5b9060e59a4c08bca6d80502",
        leagueId: "59723313734d1d6202a85f17",
        location: "AFC Bournemouth",
        shortLocation: "BOU",
        name: "The Cherries"
    },
    {
        color: "#FDBE11",
        _id: "5b9060e59a4c08bca6d80503",
        leagueId: "59723313734d1d6202a85f17",
        location: "Leicester City",
        shortLocation: "LEI",
        name: "The Foxes"
    },
    {
        color: "#034694",
        _id: "5b9060e59a4c08bca6d80504",
        leagueId: "59723313734d1d6202a85f17",
        location: "Chelsea",
        shortLocation: "CHE",
        name: "Blues"
    },
    {
        color: "#005995",
        _id: "5b9060e59a4c08bca6d80505",
        leagueId: "59723313734d1d6202a85f17",
        location: "Cardiff City",
        shortLocation: "CAR",
        name: "The Bluebirds"
    },
    {
        color: "#0E63AD",
        _id: "5b9060e59a4c08bca6d80506",
        leagueId: "59723313734d1d6202a85f17",
        location: "Huddersfield Town",
        shortLocation: "HUD",
        name: "The Terriers"
    },
    {
        color: "#1B458F",
        _id: "5b9060e59a4c08bca6d80507",
        leagueId: "59723313734d1d6202a85f17",
        location: "Crystal Palace",
        shortLocation: "CRY",
        name: "The Eagles"
    },
    {
        color: "#1C2C5B",
        _id: "5b9060e59a4c08bca6d80508",
        leagueId: "59723313734d1d6202a85f17",
        location: "Manchester City",
        shortLocation: "MNC",
        name: "Citizens"
    },
    {
        color: "#CC0000",
        _id: "5b9060e59a4c08bca6d80509",
        leagueId: "59723313734d1d6202a85f17",
        location: "Fulham",
        shortLocation: "FUL",
        name: "The Cottagers"
    },
    {
        color: "#41B6E6",
        _id: "5b9060e59a4c08bca6d8050a",
        leagueId: "59723313734d1d6202a85f17",
        location: "Newcastle United",
        shortLocation: "NEW",
        name: "The Magpies"
    },
    {
        color: "#DB0007",
        _id: "5b9060e59a4c08bca6d8050b",
        leagueId: "59723313734d1d6202a85f17",
        location: "Arsenal",
        shortLocation: "ARS",
        name: "The Gunners"
    },
    {
        color: "#FBEE23",
        _id: "5b9060e59a4c08bca6d8050c",
        leagueId: "59723313734d1d6202a85f17",
        location: "Watford",
        shortLocation: "WAT",
        name: "The Hornets"
    },
    {
        color: "#DA291C",
        _id: "5b9060e59a4c08bca6d8050d",
        leagueId: "59723313734d1d6202a85f17",
        location: "Manchester United",
        shortLocation: "MAN",
        name: "Red Devils"
    },
    {
        color: "#FDB913",
        _id: "5b9060e59a4c08bca6d8050e",
        leagueId: "59723313734d1d6202a85f17",
        location: "Wolverhampton",
        shortLocation: "WOL",
        name: "Wolves"
    },
    {
        color: "#6C1D45",
        _id: "5b9060e59a4c08bca6d8050f",
        leagueId: "59723313734d1d6202a85f17",
        location: "Burnley",
        shortLocation: "BUR",
        name: "The Clarets"
    },
    {
        color: "#003399",
        _id: "5b9060e59a4c08bca6d80510",
        leagueId: "59723313734d1d6202a85f17",
        location: "Everton",
        shortLocation: "EVE",
        name: "The Blues"
    },
    {
        color: "#7A263A",
        _id: "5b9060e59a4c08bca6d80511",
        leagueId: "59723313734d1d6202a85f17",
        location: "West Ham United",
        shortLocation: "WHU",
        name: "The Hammers"
    },
    {
        color: "#D71920",
        _id: "5b9060e59a4c08bca6d80512",
        leagueId: "59723313734d1d6202a85f17",
        location: "Southampton",
        shortLocation: "SOUT",
        name: "The Saints"
    },
    {
        color: "#0057B8",
        _id: "5b9060e59a4c08bca6d80513",
        leagueId: "59723313734d1d6202a85f17",
        location: "Brighton & Hove Albion",
        shortLocation: "BHA",
        name: "The Seagulls"
    },
    {
        color: "#FFF200",
        _id: "5b9060e59a4c08bca6d80514",
        leagueId: "59723313734d1d6202a85f17",
        location: "Norwich City",
        shortLocation: "NOR",
        name: "The Canaries"
    },
    {
        color: "#EC2227",
        _id: "5b9060e59a4c08bca6d80515",
        leagueId: "59723313734d1d6202a85f17",
        location: "Sheffield United",
        shortLocation: "SHU",
        name: "The Blades"
    },
    {
        color: "#670E36",
        _id: "5b9060e59a4c08bca6d80516",
        leagueId: "59723313734d1d6202a85f17",
        location: "Aston Villa",
        shortLocation: "AVL",
        name: "Villans"
    },
    {
        color: "#FFCD00",
        _id: "5b9060e59a4c08bca6d80517",
        leagueId: "59723313734d1d6202a85f17",
        location: "Leeds United",
        shortLocation: "LEE",
        name: "The Peacocks"
    },
    {
        color: "#122F67",
        _id: "5b9060e59a4c08bca6d80518",
        leagueId: "59723313734d1d6202a85f17",
        location: "West Bromwich Albion",
        shortLocation: "WBA",
        name: "The Baggies"
    }
];

const mlsTeams = [
    {
        _id: "19823783734d1d04a1b33001",
        leagueId: "59723313734d1d6202a85f29",
        location: "Atlanta",
        shortLocation: "ATL",
        name: "United FC",
        color: "#80000A"
    },
    {
        _id: "19823783734d1d04a1b33002",
        leagueId: "59723313734d1d6202a85f29",
        location: "Austin",
        shortLocation: "AUS",
        name: "FC",
        color: "#00B140"
    },
    {
        _id: "19823783734d1d04a1b33003",
        leagueId: "59723313734d1d6202a85f29",
        location: "Chicago",
        shortLocation: "CHI",
        name: "Fire",
        color: "#121F48"
    },
    {
        _id: "19823783734d1d04a1b33004",
        leagueId: "59723313734d1d6202a85f29",
        location: "Cincinnati",
        shortLocation: "CIN",
        name: "FC",
        color: "#003087"
    },
    {
        _id: "19823783734d1d04a1b33005",
        leagueId: "59723313734d1d6202a85f29",
        location: "Colorado",
        shortLocation: "COL",
        name: "Rapids",
        color: "#862633"
    },
    {
        _id: "19823783734d1d04a1b33006",
        leagueId: "59723313734d1d6202a85f29",
        location: "Columbus",
        shortLocation: "CLB",
        name: "Crew SC",
        color: "#FEF200"
    },
    {
        _id: "19823783734d1d04a1b33007",
        leagueId: "59723313734d1d6202a85f29",
        location: "D.C.",
        shortLocation: "DC",
        name: "United",
        color: "#EE1A39"
    },
    {
        _id: "19823783734d1d04a1b33008",
        leagueId: "59723313734d1d6202a85f29",
        location: "Dallas",
        shortLocation: "DAL",
        name: "FC",
        color: "#D11241"
    },
    {
        _id: "19823783734d1d04a1b33009",
        leagueId: "59723313734d1d6202a85f29",
        location: "Houston",
        shortLocation: "HOU",
        name: "Dynamo",
        color: "#F4911E"
    },
    {
        _id: "19823783734d1d04a1b3300a",
        leagueId: "59723313734d1d6202a85f29",
        location: "Miami",
        shortLocation: "MIA",
        name: "FC",
        color: "#F7B5CD"
    },
    {
        _id: "19823783734d1d04a1b3300b",
        leagueId: "59723313734d1d6202a85f29",
        location: "LA",
        shortLocation: "LA",
        name: "Galaxy",
        color: "#0065A4"
    },
    {
        _id: "19823783734d1d04a1b3300c",
        leagueId: "59723313734d1d6202a85f29",
        location: "LA",
        shortLocation: "LA",
        alternateName: "LAFC",
        name: "FC",
        color: "#C39E6D"
    },
    {
        _id: "19823783734d1d04a1b3300d",
        leagueId: "59723313734d1d6202a85f29",
        location: "Minnesota",
        shortLocation: "MIN",
        name: "United FC",
        color: "#9BCDE4"
    },
    {
        _id: "19823783734d1d04a1b3300e",
        leagueId: "59723313734d1d6202a85f29",
        location: "NE",
        shortLocation: "NE",
        name: "Revolution",
        color: "#E51938"
    },
    {
        _id: "19823783734d1d04a1b33010",
        leagueId: "59723313734d1d6202a85f29",
        location: "NY",
        shortLocation: "NYC",
        name: "FC",
        color: "#6CACE4"
    },
    {
        _id: "19823783734d1d04a1b33011",
        leagueId: "59723313734d1d6202a85f29",
        location: "NY",
        shortLocation: "NY",
        name: "Red Bulls",
        color: "#E31351"
    },
    {
        _id: "19823783734d1d04a1b33012",
        leagueId: "59723313734d1d6202a85f29",
        location: "Orlando City",
        shortLocation: "ORL",
        name: "FC",
        color: "#61259E"
    },
    {
        _id: "19823783734d1d04a1b33013",
        leagueId: "59723313734d1d6202a85f29",
        location: "Philadelphia",
        shortLocation: "PHI",
        name: "Union",
        color: "#B38707"
    },
    {
        _id: "19823783734d1d04a1b33014",
        leagueId: "59723313734d1d6202a85f29",
        location: "Portland",
        shortLocation: "POR",
        name: "Timbers",
        color: "#00482B"
    },
    {
        _id: "19823783734d1d04a1b33015",
        leagueId: "59723313734d1d6202a85f29",
        location: "Salt Lake",
        shortLocation: "RSL",
        name: "Real",
        color: "#B30838"
    },
    {
        _id: "19823783734d1d04a1b33016",
        leagueId: "59723313734d1d6202a85f29",
        location: "San Jose",
        shortLocation: "SJ",
        name: "Earthquakes",
        color: "#30457A"
    },
    {
        _id: "19823783734d1d04a1b33017",
        leagueId: "59723313734d1d6202a85f29",
        location: "Seattle",
        shortLocation: "SEA",
        name: "Sounders FC",
        color: "#236192"
    },
    {
        _id: "19823783734d1d04a1b33018",
        leagueId: "59723313734d1d6202a85f29",
        location: "Kansas City",
        shortLocation: "SKC",
        name: "Sporting",
        color: "#93B1D7"
    },
    {
        _id: "19823783734d1d04a1b33019",
        leagueId: "59723313734d1d6202a85f29",
        location: "Toronto",
        shortLocation: "TOR",
        name: "FC",
        color: "#AB1E2D"
    },
    {
        _id: "19823783734d1d04a1b3301a",
        leagueId: "59723313734d1d6202a85f29",
        location: "Vancouver",
        shortLocation: "VAN",
        name: "Whitescaps FC",
        color: "#04265C"
    },
    {
        _id: "19823783734d1d04a1b3301b",
        leagueId: "59723313734d1d6202a85f29",
        location: "Montreal",
        shortLocation: "MTL",
        name: "Impact",
        color: "#2B63AD"
    }
];

const nbaTeams = [
    {
        color: "#007A33",
        _id: "5b9060e59a4c08bca6d80700",
        leagueId: "59723313734d1d6202a85f19",
        location: "Boston",
        shortLocation: "BOS",
        name: "Celtics"
    },
    {
        color: "#F58426",
        _id: "5b9060e59a4c08bca6d80701",
        leagueId: "59723313734d1d6202a85f19",
        location: "New York",
        shortLocation: "NY",
        name: "Knicks"
    },
    {
        color: "#C4C9CC",
        _id: "5b9060e59a4c08bca6d80702",
        leagueId: "59723313734d1d6202a85f19",
        location: "Brooklyn",
        shortLocation: "BKN",
        name: "Nets"
    },
    {
        color: "#CE1141",
        _id: "5b9060e59a4c08bca6d80703",
        leagueId: "59723313734d1d6202a85f19",
        location: "Toronto",
        shortLocation: "TOR",
        name: "Raptors"
    },
    {
        color: "#006BB6",
        _id: "5b9060e59a4c08bca6d80704",
        leagueId: "59723313734d1d6202a85f19",
        location: "Philadelphia",
        shortLocation: "PHI",
        name: "76ers"
    },
    {
        color: "#00471B",
        _id: "5b9060e59a4c08bca6d80705",
        leagueId: "59723313734d1d6202a85f19",
        location: "Milwaukee",
        shortLocation: "MIL",
        name: "Bucks"
    },
    {
        color: "#FDBB30",
        _id: "5b9060e59a4c08bca6d80706",
        leagueId: "59723313734d1d6202a85f19",
        location: "Indiana",
        shortLocation: "IND",
        name: "Pacers"
    },
    {
        color: "#006BB6",
        _id: "5b9060e59a4c08bca6d80707",
        leagueId: "59723313734d1d6202a85f19",
        location: "Detroit",
        shortLocation: "DET",
        name: "Pistons"
    },
    {
        color: "#6F263D",
        _id: "5b9060e59a4c08bca6d80708",
        leagueId: "59723313734d1d6202a85f19",
        location: "Cleveland",
        shortLocation: "CLE",
        name: "Cavaliers"
    },
    {
        color: "#CE1141",
        _id: "5b9060e59a4c08bca6d80709",
        leagueId: "59723313734d1d6202a85f19",
        location: "Chicago",
        shortLocation: "CHI",
        name: "Bulls"
    },
    {
        color: "#1D1160",
        _id: "5b9060e59a4c08bca6d80710",
        leagueId: "59723313734d1d6202a85f19",
        location: "Charlotte",
        shortLocation: "CHA",
        name: "Hornets"
    },
    {
        color: "#0077C0",
        _id: "5b9060e59a4c08bca6d80711",
        leagueId: "59723313734d1d6202a85f19",
        location: "Orlando",
        shortLocation: "ORL",
        name: "Magic"
    },
    {
        color: "#98002E",
        _id: "5b9060e59a4c08bca6d80712",
        leagueId: "59723313734d1d6202a85f19",
        location: "Miami",
        shortLocation: "MIA",
        name: "Heat"
    },
    {
        color: "#E31837",
        _id: "5b9060e59a4c08bca6d80713",
        leagueId: "59723313734d1d6202a85f19",
        location: "Washington",
        shortLocation: "WSH",
        name: "Wizards"
    },
    {
        color: "#E03A3E",
        _id: "5b9060e59a4c08bca6d80714",
        leagueId: "59723313734d1d6202a85f19",
        location: "Atlanta",
        shortLocation: "ATL",
        name: "Hawks"
    },
    {
        color: "#0E2240",
        _id: "5b9060e59a4c08bca6d80715",
        leagueId: "59723313734d1d6202a85f19",
        location: "Denver",
        shortLocation: "DEN",
        name: "Nuggets"
    },
    {
        color: "#007AC1",
        _id: "5b9060e59a4c08bca6d80716",
        leagueId: "59723313734d1d6202a85f19",
        location: "Oklahoma City",
        shortLocation: "OKC",
        name: "Thunder"
    },
    {
        color: "#E03A3E",
        _id: "5b9060e59a4c08bca6d80717",
        leagueId: "59723313734d1d6202a85f19",
        location: "Portland",
        shortLocation: "POR",
        name: "Trail Blazers"
    },
    {
        color: "#0C2340",
        _id: "5b9060e59a4c08bca6d80718",
        leagueId: "59723313734d1d6202a85f19",
        location: "Minnesota",
        shortLocation: "MIN",
        name: "Timberwolves"
    },
    {
        color: "#B50E12",
        _id: "5b9060e59a4c08bca6d80719",
        leagueId: "59723313734d1d6202a85f19",
        location: "Utah",
        shortLocation: "UTAH",
        name: "Jazz"
    },
    {
        color: "#006BB6",
        _id: "5b9060e59a4c08bca6d80720",
        leagueId: "59723313734d1d6202a85f19",
        location: "Golden State",
        shortLocation: "GS",
        name: "Warriors"
    },
    {
        color: "#552583",
        _id: "5b9060e59a4c08bca6d80721",
        leagueId: "59723313734d1d6202a85f19",
        location: "Los Angeles",
        shortLocation: "LAL",
        name: "Lakers"
    },
    {
        color: "#C8102E",
        _id: "5b9060e59a4c08bca6d80722",
        leagueId: "59723313734d1d6202a85f19",
        location: "Los Angeles",
        shortLocation: "LAC",
        name: "Clippers"
    },
    {
        color: "#5A2D81",
        _id: "5b9060e59a4c08bca6d80723",
        leagueId: "59723313734d1d6202a85f19",
        location: "Sacramento",
        shortLocation: "SAC",
        name: "Kings"
    },
    {
        color: "#E56020",
        _id: "5b9060e59a4c08bca6d80724",
        leagueId: "59723313734d1d6202a85f19",
        location: "Phoenix",
        shortLocation: "PHX",
        name: "Suns"
    },
    {
        color: "#00538C",
        _id: "5b9060e59a4c08bca6d80725",
        leagueId: "59723313734d1d6202a85f19",
        location: "Dallas",
        shortLocation: "DAL",
        name: "Mavericks"
    },
    {
        color: "#12173F",
        _id: "5b9060e59a4c08bca6d80726",
        leagueId: "59723313734d1d6202a85f19",
        location: "Memphis",
        shortLocation: "MEM",
        name: "Grizzlies"
    },
    {
        color: "#CE1141",
        _id: "5b9060e59a4c08bca6d80727",
        leagueId: "59723313734d1d6202a85f19",
        location: "Houston",
        shortLocation: "HOU",
        name: "Rockets"
    },
    {
        color: "#EF426F",
        _id: "5b9060e59a4c08bca6d80728",
        leagueId: "59723313734d1d6202a85f19",
        location: "San Antonio",
        shortLocation: "SA",
        name: "Spurs"
    },
    {
        color: "#0C2340",
        _id: "5b9060e59a4c08bca6d80729",
        leagueId: "59723313734d1d6202a85f19",
        location: "New Orleans",
        shortLocation: "NO",
        name: "Pelicans"
    },
    {
        color: "#48494a",
        _id: "5b9060e59a4c08bca6d80730",
        leagueId: "59723313734d1d6202a85f19",
        location: "WORLD",
        shortLocation: "WORLD",
        name: "WORLD"
    },
    {
        color: "#FFC20E",
        _id: "5b9060e59a4c08bca6d80731",
        leagueId: "59723313734d1d6202a85f19",
        location: "USA",
        shortLocation: "USA",
        name: "USA"
    }
];

const mlbTeams = [
    {
        color: "#BD3039",
        _id: "5b9060e59a4c08bca6d80800",
        leagueId: "59723313734d1d6202a85f21",
        location: "Boston",
        shortLocation: "BOS",
        name: "Red Sox"
    },
    {
        color: "#0C2340",
        _id: "5b9060e59a4c08bca6d80801",
        leagueId: "59723313734d1d6202a85f21",
        location: "New York",
        shortLocation: "NYY",
        name: "Yankees"
    },
    {
        color: "#FC4C02",
        _id: "5b9060e59a4c08bca6d80802",
        leagueId: "59723313734d1d6202a85f21",
        location: "Baltimore",
        shortLocation: "BAL",
        name: "Orioles"
    },
    {
        color: "#134A8E",
        _id: "5b9060e59a4c08bca6d80803",
        leagueId: "59723313734d1d6202a85f21",
        location: "Toronto",
        shortLocation: "TOR",
        name: "Blue Jays"
    },
    {
        color: "#8FBCE6",
        _id: "5b9060e59a4c08bca6d80804",
        leagueId: "59723313734d1d6202a85f21",
        location: "Tampa Bay",
        shortLocation: "TB",
        name: "Rays"
    },
    {
        color: "#D31145",
        _id: "5b9060e59a4c08bca6d80805",
        leagueId: "59723313734d1d6202a85f21",
        location: "Minnesota",
        shortLocation: "MIN",
        name: "Twins"
    },
    {
        color: "#E31937",
        _id: "5b9060e59a4c08bca6d80806",
        leagueId: "59723313734d1d6202a85f21",
        location: "Cleveland",
        shortLocation: "CLE",
        name: "Indians"
    },
    {
        color: "#27251F",
        _id: "5b9060e59a4c08bca6d80807",
        leagueId: "59723313734d1d6202a85f21",
        location: "Chicago",
        shortLocation: "CHW",
        name: "White Sox"
    },
    {
        color: "#FA4616",
        _id: "5b9060e59a4c08bca6d80808",
        leagueId: "59723313734d1d6202a85f21",
        location: "Detroit",
        shortLocation: "DET",
        name: "Tigers"
    },
    {
        color: "#004687",
        _id: "5b9060e59a4c08bca6d80809",
        leagueId: "59723313734d1d6202a85f21",
        location: "Kansas City",
        shortLocation: "KC",
        name: "Royals"
    },
    {
        color: "#EB6E1F",
        _id: "5b9060e59a4c08bca6d80810",
        leagueId: "59723313734d1d6202a85f21",
        location: "Houston",
        shortLocation: "HOU",
        name: "Astros"
    },
    {
        color: "#C0111F",
        _id: "5b9060e59a4c08bca6d80811",
        leagueId: "59723313734d1d6202a85f21",
        location: "Texas",
        shortLocation: "TEX",
        name: "Rangers"
    },
    {
        color: "#003831",
        _id: "5b9060e59a4c08bca6d80812",
        leagueId: "59723313734d1d6202a85f21",
        location: "Oakland",
        shortLocation: "OAK",
        name: "Athletics"
    },
    {
        color: "#BA0021",
        _id: "5b9060e59a4c08bca6d80813",
        leagueId: "59723313734d1d6202a85f21",
        location: "Los Angeles",
        shortLocation: "LAA",
        name: "Angels"
    },
    {
        color: "#005C5C",
        _id: "5b9060e59a4c08bca6d80814",
        leagueId: "59723313734d1d6202a85f21",
        location: "Seattle",
        shortLocation: "SEA",
        name: "Mariners"
    },
    {
        color: "#13274F",
        _id: "5b9060e59a4c08bca6d80815",
        leagueId: "59723313734d1d6202a85f21",
        location: "Atlanta",
        shortLocation: "ATL",
        name: "Braves"
    },
    {
        color: "#E81828",
        _id: "5b9060e59a4c08bca6d80816",
        leagueId: "59723313734d1d6202a85f21",
        location: "Philadelphia",
        shortLocation: "PHI",
        name: "Phillies"
    },
    {
        color: "#AB0003",
        _id: "5b9060e59a4c08bca6d80817",
        leagueId: "59723313734d1d6202a85f21",
        location: "Washington",
        shortLocation: "WSH",
        name: "Nationals"
    },
    {
        color: "#FF5910",
        _id: "5b9060e59a4c08bca6d80818",
        leagueId: "59723313734d1d6202a85f21",
        location: "New York",
        shortLocation: "NYM",
        name: "Mets"
    },
    {
        color: "#EF3340",
        _id: "5b9060e59a4c08bca6d80819",
        leagueId: "59723313734d1d6202a85f21",
        location: "Miami",
        shortLocation: "MIA",
        name: "Marlins"
    },
    {
        color: "#0E3386",
        _id: "5b9060e59a4c08bca6d80820",
        leagueId: "59723313734d1d6202a85f21",
        location: "Chicago",
        shortLocation: "CHC",
        name: "Cubs"
    },
    {
        color: "#0A2351",
        _id: "5b9060e59a4c08bca6d80821",
        leagueId: "59723313734d1d6202a85f21",
        location: "Milwaukee",
        shortLocation: "MIL",
        name: "Brewers"
    },
    {
        color: "#C41E3A",
        _id: "5b9060e59a4c08bca6d80822",
        leagueId: "59723313734d1d6202a85f21",
        location: "St. Louis",
        shortLocation: "STL",
        name: "Cardinals"
    },
    {
        color: "#FDB827",
        _id: "5b9060e59a4c08bca6d80823",
        leagueId: "59723313734d1d6202a85f21",
        location: "Pittsburgh",
        shortLocation: "PIT",
        name: "Pirates"
    },
    {
        color: "#C6011F",
        _id: "5b9060e59a4c08bca6d80824",
        leagueId: "59723313734d1d6202a85f21",
        location: "Cincinnati",
        shortLocation: "CIN",
        name: "Reds"
    },
    {
        color: "#005A9C",
        _id: "5b9060e59a4c08bca6d80825",
        leagueId: "59723313734d1d6202a85f21",
        location: "Los Angeles",
        shortLocation: "LAD",
        name: "Dodgers"
    },
    {
        color: "#33006F",
        _id: "5b9060e59a4c08bca6d80826",
        leagueId: "59723313734d1d6202a85f21",
        location: "Colorado",
        shortLocation: "COL",
        name: "Rockies"
    },
    {
        color: "#A71930",
        _id: "5b9060e59a4c08bca6d80827",
        leagueId: "59723313734d1d6202a85f21",
        location: "Arizona",
        shortLocation: "ARI",
        name: "Diamondbacks"
    },
    {
        color: "#473729",
        _id: "5b9060e59a4c08bca6d80828",
        leagueId: "59723313734d1d6202a85f21",
        location: "San Diego",
        shortLocation: "SD",
        name: "Padres"
    },
    {
        color: "#FD5A1E",
        _id: "5b9060e59a4c08bca6d80829",
        leagueId: "59723313734d1d6202a85f21",
        location: "San Francisco",
        shortLocation: "SF",
        name: "Giants"
    }
];

const wnbaTeams = [
    {
        _id: "5b9060e59a4c08bca6d80900",
        leagueId: "59723313734d1d6202a85f37",
        location: "Atlanta",
        shortLocation: "ATL",
        name: "Dream",
        color: "#C8102E"
    },
    {
        _id: "5b9060e59a4c08bca6d80901",
        leagueId: "59723313734d1d6202a85f37",
        location: "Chicago",
        shortLocation: "CHI",
        name: "Sky",
        color: "#418FDE"
    },
    {
        _id: "5b9060e59a4c08bca6d80902",
        leagueId: "59723313734d1d6202a85f37",
        location: "Connecticut",
        shortLocation: "CONN",
        name: "Sun",
        color: "#A6192E"
    },
    {
        _id: "5b9060e59a4c08bca6d80903",
        leagueId: "59723313734d1d6202a85f37",
        location: "Indiana",
        shortLocation: "IND",
        name: "Fever",
        color: "#041E42"
    },
    {
        _id: "5b9060e59a4c08bca6d80904",
        leagueId: "59723313734d1d6202a85f37",
        location: "New York",
        shortLocation: "NY",
        name: "Liberty",
        color: "#FF671F"
    },
    {
        _id: "5b9060e59a4c08bca6d80905",
        leagueId: "59723313734d1d6202a85f37",
        location: "Washington",
        shortLocation: "WSH",
        name: "Mystics",
        color: "#C8102E"
    },
    {
        _id: "5b9060e59a4c08bca6d80906",
        leagueId: "59723313734d1d6202a85f37",
        location: "Dallas",
        shortLocation: "DAL",
        name: "Wings",
        color: "#C4D600"
    },
    {
        _id: "5b9060e59a4c08bca6d80907",
        leagueId: "59723313734d1d6202a85f37",
        location: "Las Vegas",
        shortLocation: "LV",
        name: "Aces",
        color: "#BA0C2F"
    },
    {
        _id: "5b9060e59a4c08bca6d80908",
        leagueId: "59723313734d1d6202a85f37",
        location: "Los Angeles",
        shortLocation: "LA",
        name: "Sparks",
        color: "#702F8A"
    },
    {
        _id: "5b9060e59a4c08bca6d80909",
        leagueId: "59723313734d1d6202a85f37",
        location: "Minnesota",
        shortLocation: "MIN",
        name: "Lynx",
        color: "#236192"
    },
    {
        _id: "5b9060e59a4c08bca6d8090a",
        leagueId: "59723313734d1d6202a85f37",
        location: "Phoenix",
        shortLocation: "PHX",
        name: "Mercury",
        color: "#CB6015"
    },
    {
        _id: "5b9060e59a4c08bca6d8090b",
        leagueId: "59723313734d1d6202a85f37",
        location: "Seattle",
        shortLocation: "SEA",
        name: "Storm",
        color: "#2C5234"
    }
];

module.exports = {
    nbaTeams,
	nflTeams,
    premierLeagueTeams,
    mlsTeams,
    ncaaTeams,
    mlbTeams,
    wnbaTeams,
    countries,
    boxingCompetitors,
    ufcCompetitors,
    nba2kCompetitors
};