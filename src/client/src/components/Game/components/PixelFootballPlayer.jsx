const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 3px)',
    gridTemplateRows: 'repeat(20, 2px)',
    gap: '1px',
    position: 'absolute',
    top: '19rem',
    left: '7rem',
  },
  helmet: {
    gridColumn: '5 / span 4',
    gridRow: '1 / span 3',
    backgroundColor: '#ff0000',
  },
  faceguard: {
    gridColumn: '5 / span 5',
    gridRow: '4 / 5',
    backgroundColor: 'darkgray',
  },
  chest: {
    gridColumn: '4 / span 6',
    gridRow: '5 / span 2',
    backgroundColor: '#ff0000',
  },
  number: {
    gridColumn: '6 / span 2',
    gridRow: '6',
    backgroundColor: '#ffffff',
  },
  leftArm: {
    gridColumn: '3 / span 2',
    gridRow: '5 / span 2',
    backgroundColor: '#ff0000',
  },
  rightArm: {
    gridColumn: '9 / span 2',
    gridRow: '5 / span 2',
    backgroundColor: '#ff0000',
  },
  shorts: {
    gridColumn: '5 / span 4',
    gridRow: '7',
    backgroundColor: '#000000',
  },
  leftLeg: {
    gridColumn: '5 / span 2',
    gridRow: '8 / span 2',
    backgroundColor: '#000000',
  },
  rightLeg: {
    gridColumn: '8 / span 2',
    gridRow: '8 / span 2',
    backgroundColor: '#000000',
  },
  leftBoot: {
    gridColumn: '4 / span 2',
    gridRow: '10',
    backgroundColor: '#000000',
  },
  rightBoot: {
    gridColumn: '9 / span 2',
    gridRow: '10',
    backgroundColor: '#000000',
  },
  // ball: {
  //   gridColumn: '3 / span 2',
  //   gridRow: '8 / span 2',
  //   backgroundColor: '#b5651d',
  // },
};

const PixelFootballPlayer = ({ playerStyles = { grid: {}, teamColor: null, }}) => {
  return (
    <div style={{...styles.grid, ...playerStyles.grid}}>
      <div style={{...styles.helmet, color: playerStyles.teamColor || styles.helmet.color}}></div>
      <div style={styles.faceguard}></div>
      <div style={styles.chest}></div>
      <div style={styles.number}></div>
      <div style={styles.leftArm}></div>
      <div style={styles.rightArm}></div>
      <div style={styles.shorts}></div>
      <div style={styles.leftLeg}></div>
      <div style={styles.rightLeg}></div>
      <div style={styles.leftBoot}></div>
      <div style={styles.rightBoot}></div>
      {/* <div style={styles.ball}></div> */}
    </div>
  );
};

export default PixelFootballPlayer;