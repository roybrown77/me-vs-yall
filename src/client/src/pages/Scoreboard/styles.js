const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    rootSlim: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    dateHeader: (slimMode, zIndex = 3) => ({
      position: 'relative',
      zIndex,
      boxSizing: 'border-box',
      fontFamily: 'monospace',
      backgroundColor: 'rgba(0,0,0,0.87)',
      color: '#ffffff',
      width: '100%',
      padding: slimMode ? '8px 0' : '18px 0',
      fontSize: slimMode ? '12px' : '14px',
      fontWeight: '600',
      lineHeight: 1.2,
      textAlign: 'center',
    }),
    googleLogin: {
      width: '250px',
      '&:hover': {
        cursor: 'pointer'
      }
    },
    input: {
      display: 'none',
    },
    banner: {
      marginBottom: '10px'
    },
    bannerImage: {
      borderRadius: '8px'
    },
    button: {
      backgroundColor: '#3772FA',
      borderColor: '#3772FA',
      '&:hover': {
        backgroundColor: '#3772FA',
        color: '#FFFFFF',
        borderColor: '#3772FA',
      },
      borderRadius: 0,
      color: '#FFFFFF',
      fontSize: '1.5rem',
      fontWeight: "700",
      lineHeight: '2.75',
      marginBottom: '10px',
      padding: '0',
      width: '75%',
      'WebkitBoxShadow': '-8px 8px 0px 0px #000',
      'MozBoxShadow': '-8px 8px 0px 0px #000',
      boxShadow: '-8px 8px 0px 0px #000'
    },
    toggleButtonOn: {
      color: '#000'
    },
    toggleButtonOff: {
      color: 'gray'
    }
  };

  export default styles;