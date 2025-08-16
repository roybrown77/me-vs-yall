const MMAGlove = (style) => {
    return (
        <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Black MMA glove"
            {...style}
        >
            <defs>
                <linearGradient id="gloveBlack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5a5a5a" />
                    <stop offset="1" stopColor="#0f0f0f" />
                </linearGradient>
                <linearGradient id="strap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#222" />
                    <stop offset="1" stopColor="#000" />
                </linearGradient>
            </defs>

            <g
                id="glove"
                stroke="#0a0a0a"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                transform="translate(30,8)"
            >
                <rect x="18" y="34" rx="9" ry="9" width="38" height="34" fill="url(#gloveBlack)" />
                <rect x="18" y="20" rx="3" ry="3" width="7" height="12" fill="url(#gloveBlack)" />
                <rect x="27" y="20" rx="3" ry="3" width="7" height="12" fill="url(#gloveBlack)" />
                <rect x="36" y="20" rx="3" ry="3" width="7" height="12" fill="url(#gloveBlack)" />
                <rect x="45" y="20" rx="3" ry="3" width="7" height="12" fill="url(#gloveBlack)" />
                <rect
                    x="10"
                    y="42"
                    rx="6"
                    ry="6"
                    width="12"
                    height="16"
                    fill="url(#gloveBlack)"
                    transform="rotate(-12 16 50)"
                />
                <rect x="18" y="70" rx="5" ry="5" width="38" height="20" fill="url(#strap)" />
                <rect x="14" y="74" rx="4" ry="4" width="46" height="10" fill="#111" />
                <g stroke="#555" strokeWidth="1">
                    <line x1="22" y1="79" x2="25" y2="79" />
                    <line x1="28" y1="79" x2="31" y2="79" />
                    <line x1="34" y1="79" x2="37" y2="79" />
                    <line x1="40" y1="79" x2="43" y2="79" />
                    <line x1="46" y1="79" x2="49" y2="79" />
                </g>
                <path
                    d="M22 40c6-8 18-10 26-8"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                />
            </g>
        </svg>
    );
};

export default MMAGlove;