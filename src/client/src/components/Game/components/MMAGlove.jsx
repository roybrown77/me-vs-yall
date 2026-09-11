const MMAGlove = ({ style, ...props }) => (
  <svg
    width="96"
    height="108"
    viewBox="0 0 96 108"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="MMA glove"
    style={style}
    {...props}
  >
    <defs>
      <linearGradient id="mmaGloveFill" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#575757" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>
      <linearGradient id="mmaGloveCuff" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#353535" />
        <stop offset="100%" stopColor="#101010" />
      </linearGradient>
    </defs>

    <g
      fill="url(#mmaGloveFill)"
      stroke="#121212"
      strokeWidth="3.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect x="28" y="22" width="9" height="20" rx="4.5" />
      <rect x="39" y="22" width="9" height="20" rx="4.5" />
      <rect x="50" y="22" width="9" height="20" rx="4.5" />
      <rect x="61" y="22" width="9" height="20" rx="4.5" />
      <rect x="24" y="38" width="52" height="28" rx="12" />
      <ellipse cx="18" cy="50" rx="7" ry="10" />
      <rect x="26" y="62" width="48" height="16" rx="6" fill="url(#mmaGloveCuff)" />
    </g>

    <g stroke="#121212" strokeWidth="2.5" strokeLinecap="round" opacity="0.45">
      <line x1="39" y1="24" x2="39" y2="38" />
      <line x1="50" y1="24" x2="50" y2="38" />
      <line x1="61" y1="24" x2="61" y2="38" />
    </g>

    <g stroke="#707070" strokeWidth="2" strokeLinecap="round" opacity="0.75">
      <line x1="32" y1="70" x2="68" y2="70" />
    </g>

    <ellipse
      cx="50"
      cy="48"
      rx="18"
      ry="8"
      fill="rgba(255,255,255,0.1)"
      stroke="none"
    />
  </svg>
);

export default MMAGlove;
