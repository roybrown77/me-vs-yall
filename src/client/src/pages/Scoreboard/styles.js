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