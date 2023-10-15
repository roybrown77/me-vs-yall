const styles = theme => ({
    root: {
      width: '100%',
      paddingBottom: '12px'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    googleLogin: {
      width: '250px',
      '&:hover': {
        cursor: 'pointer'
      }
    },
    container: {
      backgroundColor: '#ffffff'
    },
    userName: {
      padding: '10px 0 0 10px',
      fontSize: '12px',
      fontWeight: '900',
      wordWrap: 'break-word',
      width: '75px',
      textAlign: 'left'
    },
    expansionSummary: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      paddingBottom: '1rem'
    },
    expansionPanelDetails: {
      padding: '8px'
    },
    userPicture: {
      height: '50px',
      width: '50px',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    userDefaultPictureContainer: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      backgroundColor: '#3772FA',
      color: '#fff',
      fontSize: '1.5rem',
      objectFit: 'cover',
      margin: 'auto'
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
  });

  export default styles;