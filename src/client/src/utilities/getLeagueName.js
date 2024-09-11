export const getLeagueName = () => {
    // Get the current location from history
    const currentPath = window?.location?.pathname;
  
    // Split the path and get the last part
    const parts = currentPath.split('/').filter(Boolean); // Filter to remove empty strings
    return parts.length > 0 ? parts.pop() : 'nfl';
};