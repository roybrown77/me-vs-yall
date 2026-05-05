import { useState, useRef, useEffect } from "react";
import Calendar from '@mui/icons-material/CalendarToday';
import IconButton from "@mui/material/IconButton";

const CalendarReminder = ({ containerStyle }) => {
    const [showCalendarDescription, setShowCalendarDescription] = useState(false);
    const divRef = useRef(null);

    const handleOutsideClick = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowCalendarDescription(false); // Close the floating div
      }
    };

    useEffect(() => {
        if (showCalendarDescription) {
          document.addEventListener("mousedown", handleOutsideClick);
        } else {
          document.removeEventListener("mousedown", handleOutsideClick);
        }
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
      }, [showCalendarDescription]);

    return (
        <>
            <div
                onClick={() => setShowCalendarDescription(!showCalendarDescription)}
                style={{
                    marginTop: "25px",
            marginLeft: "auto",
                    padding: "10px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
            ...containerStyle,
                }}
            >
                <div style={{ fontSize: "9px", fontWeight: 700 }}>Add Reminder</div>
                <div style={{ background: '#D68F92', margin: '5px', borderRadius: '8px' }}>
                    <IconButton
                    style={{color: "#000" }}
                    aria-label="Add Calendar Reminder"
                    >
                    <Calendar />
                    </IconButton>
                </div>
            </div>
            {
                showCalendarDescription &&
                <div
                    ref={divRef}
                    style={{
                    margin: "0 25%",
                    zIndex: "9999",
                    width: "50%",
                    position: "absolute",
                    padding: "16px",
                    background: "#fff",
                    boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                    fontSize: ".9rem",
                    textAlign: "left",
                    }}
                >
                    <div>1. Open your calendar app</div>
                    <div>2. Create Me vs Yall reminder with link <a href="https://www.mevsyall.com">https://www.mevsyall.com</a></div>
                    <div>3. Set reminder for 7 pm every night to avoid missing picks 😎🏈⚽️🏀🥇🏆👑✌🏿</div>
                </div>
            }
        </>
    );
};

export default CalendarReminder;