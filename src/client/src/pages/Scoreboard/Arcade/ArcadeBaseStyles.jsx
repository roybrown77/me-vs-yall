const ArcadeBaseStyles = () => {
  return (
    <style>{`
      @keyframes arcadeBob {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(-2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes arcadeWiggle {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(2deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-2deg); }
        100% { transform: rotate(0deg); }
      }
    `}</style>
  );
};

export default ArcadeBaseStyles;
