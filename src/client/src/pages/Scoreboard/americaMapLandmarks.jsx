import { POINTS } from "./americaMapLocations";

// First emoji from each team's entry in src/server/utilities/teams/nfl.js.
const TEAM_MARKS = [
  ["glendale", "🐦", "Cardinals"],
  ["atlanta", "🦅", "Falcons"],
  ["baltimore", "🦅", "Ravens", { dy: -8 }],
  ["orchard park", "🦬", "Bills"],
  ["charlotte", "🐆", "Panthers"],
  ["chicago", "🐻", "Bears"],
  ["cincinnati", "🐯", "Bengals"],
  ["cleveland", "🐕", "Browns"],
  ["arlington", "🤠", "Cowboys"],
  ["denver", "🐎", "Broncos", { dx: 8 }],
  ["detroit", "🦁", "Lions"],
  ["green bay", "🧀", "Packers"],
  ["houston", "🤠", "Texans"],
  ["indianapolis", "🐎", "Colts"],
  ["jacksonville", "🐆", "Jaguars"],
  ["kansas city", "👨🏾‍🚒", "Chiefs"],
  ["paradise", "🏴‍☠️", "Raiders"],
  ["inglewood", "⚡️", "Chargers", { dx: -9 }],
  ["inglewood", "🐏", "Rams", { dx: 9 }],
  ["miami gardens", "🐬", "Dolphins"],
  ["minneapolis", "🔱", "Vikings"],
  ["foxborough", "🦞", "Patriots"],
  ["new orleans", "😇", "Saints"],
  ["east rutherford", "🗽", "Giants", { dx: -8, dy: -6 }],
  ["east rutherford", "🛩️", "Jets", { dx: 8, dy: 6 }],
  ["philadelphia", "🦅", "Eagles"],
  ["pittsburgh", "🛠️", "Steelers"],
  ["santa clara", "🧑🏼‍🚒", "49ers"],
  ["seattle", "🌊🦅", "Seahawks"],
  ["tampa", "🏴‍☠️", "Buccaneers"],
  ["nashville", "🥁", "Titans"],
  ["landover", "🧑🏾‍🚀", "Commanders", { dy: 8 }],
];

const SCENERY = [
  ["maine", "🌲", "Maine woods", -68.8, 46.3],
  ["minnesota", "🌲", "North woods", -94.4, 47.8],
  ["michigan", "🌲", "Upper Peninsula", -87.2, 46.5],
  ["oregon", "🌲", "Oregon forest", -122.6, 44.2],
  ["redwoods", "🌲", "Redwoods", -123.9, 41.3],
  ["olympics", "🌲", "Olympic forest", -123.9, 47.7],
  ["idaho", "🌲", "Idaho forest", -115.4, 46.6],
  ["ozarks", "🌲", "Ozarks", -93.2, 36.5],
  ["smokies", "🌲", "Smoky Mountains", -83.5, 35.5],
  ["appalachian-woods", "🌲", "Appalachian forest", -82.6, 37.4],
  ["piney", "🌲", "Piney Woods", -94.6, 31.4],
  ["glacier", "🏔️", "Rocky Mountains", -113.7, 48.5],
  ["montana-rockies", "🏔️", "Rocky Mountains", -110.5, 45.5],
  ["tetons", "🏔️", "Grand Teton", -111.3, 43.5],
  ["rockies", "🏔️", "Rocky Mountains", -106.6, 39.3],
  ["san-juan", "🏔️", "Rocky Mountains", -107.5, 37.6],
  ["sierra", "⛰️", "Sierra Nevada", -119.7, 37.5],
  ["rainier", "🏔️", "Mount Rainier", -121.75, 46.85],
  ["denali", "🏔️", "Denali", -151.0, 63.1],
  ["whites", "⛰️", "White Mountains", -71.9, 44.55],
  ["adirondacks", "⛰️", "Adirondacks", -74.3, 44.2],
  ["allegheny", "⛰️", "Appalachian Mountains", -78.5, 41.1],
  ["appalachia", "⛰️", "Appalachian Mountains", -81.3, 38.15],
  ["blue-ridge", "⛰️", "Blue Ridge", -79.3, 37.9],
  ["north-georgia", "⛰️", "Appalachian Mountains", -83.9, 34.8],
  ["arizona", "🌵", "Sonoran Desert", -113.3, 32.4],
  ["sonoran-south", "🌵", "Sonoran Desert", -111.6, 31.5],
  ["mojave", "🌵", "Mojave Desert", -116.3, 35.1],
  ["chihuahua", "🌵", "Chihuahuan Desert", -105.4, 32.2],
  ["west-texas", "🌵", "West Texas", -103.2, 30.5],
  ["gate", "🌉", "Golden Gate Bridge", -122.48, 37.82],
  ["harbor", "🗽", "Statue of Liberty", -74.04, 40.69],
  ["rushmore", "🗿", "Mount Rushmore", -103.46, 43.88],
  ["canyon", "🏜️", "Grand Canyon", -112.1, 36.2],
  ["yellowstone", "🦬", "Yellowstone", -110.5, 44.6],
  ["arch", "🌉", "Gateway Arch", -90.18, 38.63],
  ["hollywood", "🎬", "Hollywood", -118.1, 34.65],
  ["rocket", "🚀", "Kennedy Space Center", -80.85, 29.2],
  ["vegas", "🎰", "Las Vegas", -114.35, 36.85],
  ["alamo", "⭐", "The Alamo", -98.49, 29.42],
  ["keys", "🌴", "Florida Keys", -81.1, 24.8],
  ["everglades", "🐊", "Everglades", -81.2, 25.8],
  ["hawaii", "🌋", "Hawaii", -155.5, 19.6],
  ["plains", "🌾", "Great Plains", -100.5, 41.5],
];

const project = (projection, unit, lng, lat, dx = 0, dy = 0) => {
  const point = projection([lng, lat]);
  if (!point) return null;
  return { x: point[0] + dx * unit, y: point[1] + dy * unit };
};

export function placeMapLandmarks(projection, unit) {
  const teams = TEAM_MARKS.flatMap(([city, emoji, title, options = {}], index) => {
    const coords = POINTS[city];
    if (!coords) return [];
    const point = project(projection, unit, coords[0], coords[1], options.dx, options.dy);
    if (!point) return [];
    return [{
      id: `${city}-${index}`,
      emoji,
      title,
      x: point.x,
      y: point.y - 18 * unit,
    }];
  });

  const scenery = SCENERY.flatMap(([id, emoji, title, lng, lat]) => {
    const point = project(projection, unit, lng, lat);
    if (!point) return [];
    return [{ id, emoji, title, ...point }];
  });

  return { teams, scenery };
}

export function MapLandmarks({ landmarks, unit }) {
  return (
    <g className="america-map-landmarks">
      {landmarks.scenery.map((item) => (
        <text
          key={item.id}
          x={item.x}
          y={item.y}
          fontSize={16 * unit}
          textAnchor="middle"
          dominantBaseline="central"
          data-scenery={item.id}
        >
          <title>{item.title}</title>
          {item.emoji}
        </text>
      ))}
      {landmarks.teams.map((item) => (
        <text
          key={item.id}
          x={item.x}
          y={item.y}
          fontSize={18 * unit}
          textAnchor="middle"
          dominantBaseline="central"
          data-landmark={item.id}
        >
          <title>{item.title}</title>
          {item.emoji}
        </text>
      ))}
    </g>
  );
}
