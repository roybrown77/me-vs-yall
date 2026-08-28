import { getLeagueNameFromPath } from "./navigationPaths";

export const getLeagueName = () => getLeagueNameFromPath(window?.location?.pathname);
