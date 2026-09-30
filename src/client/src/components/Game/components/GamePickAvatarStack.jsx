import { useCallback, useState } from "react";
import PropTypes from "prop-types";

const MAX_VISIBLE = 6;
const AVATAR_SIZE = 32;
const OVERLAP = 10;

const avatarColors = [
  "#3772FA",
  "#0B6E4F",
  "#FD7E14",
  "#6C757D",
  "#C62828",
  "#7B1FA2",
];

const colorForId = (id) => {
  let hash = 0;
  const value = String(id || "");
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash + value.charCodeAt(index) * (index + 1)) % avatarColors.length;
  }
  return avatarColors[hash];
};

const GamePickAvatarStack = ({ pickers = [], side = "left", leadersHref }) => {
  const [failedImages, setFailedImages] = useState({});

  const navigateToLeaders = useCallback(() => {
    if (leadersHref) {
      window.location.href = leadersHref;
    }
  }, [leadersHref]);

  const handleImageError = useCallback((pickerId) => {
    setFailedImages((current) => ({
      ...current,
      [pickerId]: true,
    }));
  }, []);

  if (!pickers.length) {
    return null;
  }

  const visiblePickers = pickers.slice(0, MAX_VISIBLE);
  const overflowCount = pickers.length - visiblePickers.length;

  return (
    <div
      role={leadersHref ? "link" : undefined}
      tabIndex={leadersHref ? 0 : undefined}
      onClick={leadersHref ? navigateToLeaders : undefined}
      onKeyDown={
        leadersHref
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigateToLeaders();
              }
            }
          : undefined
      }
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: leadersHref ? "pointer" : undefined,
      }}
      aria-label={`${side === "left" ? "Away" : "Home"} pickers. View on Leaders page.`}
    >
      {visiblePickers.map((picker, index) => {
        const showImage = picker.picture && !failedImages[picker.id];

        return (
          <div
            key={`${picker.id}-${index}`}
            title={picker.label}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: "50%",
              border: "2px solid #fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
              overflow: "hidden",
              marginLeft: index === 0 ? 0 : -OVERLAP,
              zIndex: index + 1,
              backgroundColor: showImage ? "#fff" : colorForId(picker.id),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {showImage ? (
              <img
                src={picker.picture}
                alt=""
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={() => handleImageError(picker.id)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              picker.label
            )}
          </div>
        );
      })}
      {overflowCount > 0 && (
        <div
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: "50%",
            border: "2px solid #fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            marginLeft: -OVERLAP,
            zIndex: visiblePickers.length + 1,
            backgroundColor: "#E2E8F0",
            color: "#334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
};

GamePickAvatarStack.propTypes = {
  pickers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      picture: PropTypes.string,
      label: PropTypes.string.isRequired,
    })
  ),
  side: PropTypes.oneOf(["left", "right"]),
  leadersHref: PropTypes.string,
};

export default GamePickAvatarStack;
