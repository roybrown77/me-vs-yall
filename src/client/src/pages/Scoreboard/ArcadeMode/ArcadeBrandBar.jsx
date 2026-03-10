import { Link } from "react-router-dom";

import {
  googleLogin,
  isConfirmedAuthentication,
  logout,
} from "../../../utilities/authenticationClient";

import mvyLogo from "../../../styles/images/mvy-balls-cut.png";

const ArcadeBrandBar = () => {
  const isAuthenticated = isConfirmedAuthentication();

  const buttonStyle = {
    border: "1px solid #E7E7E7",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "7px 10px",
    fontSize: "11px",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        backgroundColor: "#fff",
        border: "1px solid #E7E7E7",
        borderRadius: "14px",
        pointerEvents: "auto",
      }}
    >
      <Link to="/" aria-label="Me vs Yall home" style={{ display: "flex", alignItems: "center" }}>
        <img
          src={mvyLogo}
          alt="Me vs Yall"
          style={{ height: "34px", width: "72px", objectFit: "contain" }}
        />
      </Link>

      <button
        type="button"
        onClick={isAuthenticated ? logout : googleLogin}
        style={buttonStyle}
        aria-label={isAuthenticated ? "Sign out" : "Sign in"}
      >
        <span style={{ fontSize: ".7rem" }}>📱</span> {isAuthenticated ? "Sign out" : "SIGN IN"}
      </button>
    </div>
  );
};

export default ArcadeBrandBar;
