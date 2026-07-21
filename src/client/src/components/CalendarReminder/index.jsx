import { useState, useRef, useEffect } from "react";
import Calendar from '@mui/icons-material/CalendarToday';
import IconButton from "@mui/material/IconButton";

const CalendarReminder = ({ marginLeft = 'auto', iconClassName = '' }) => {
    const [showCalendarDescription, setShowCalendarDescription] = useState(false);
    const divRef = useRef(null);
    const reminderUrl = "https://www.mevsyall.com";
    const reminderTitle = "Me vs Yall - Make Your Picks";
    const reminderDetails = "Drop your picks before lock. Link: https://www.mevsyall.com";
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(reminderTitle)}&details=${encodeURIComponent(reminderDetails)}&recur=${encodeURIComponent("RRULE:FREQ=DAILY;BYHOUR=19;BYMINUTE=0;BYSECOND=0")}`;
    const icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(
      [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Me vs Yall//Pick Reminder//EN",
        "BEGIN:VEVENT",
        "UID:mevsyall-daily-pick-reminder@mevsyall.com",
        "SUMMARY:Me vs Yall - Make Your Picks",
        "DESCRIPTION:Drop your picks before lock. Link: https://www.mevsyall.com",
        "RRULE:FREQ=DAILY;BYHOUR=19;BYMINUTE=0;BYSECOND=0",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")
    )}`;

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
                  marginLeft,
                    padding: "10px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                }}
            >
                <div style={{ fontSize: "9px", fontWeight: 700 }}>Add to Calendar</div>
                <div style={{ background: '#D68F92', margin: '5px', borderRadius: '8px' }}>
                    <IconButton
                    style={{color: "#000" }}
                    aria-label="Add Calendar Reminder"
                    >
                    <Calendar className={iconClassName} />
                    </IconButton>
                </div>
            </div>
            {
                showCalendarDescription &&
                <div
                    ref={divRef}
                  className="calendar-reminder__modal"
                    style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: "9999",
                  width: "min(480px, calc(100vw - 20px))",
                  position: "fixed",
                  top: "74px",
                    padding: "16px",
                    background: "#fff",
                    borderRadius: "14px",
                    boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                    fontSize: ".9rem",
                    textAlign: "left",
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: "8px" }}>Never miss picks again.</div>
                    <div style={{ marginBottom: "8px" }}>
                      Set a daily 7:00 PM reminder and keep your streak alive.
                    </div>
                    <div className="calendar-reminder__actions">
                      <a
                        className="calendar-reminder__action-btn"
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Quick add (Google Calendar)
                      </a>
                      <a
                        className="calendar-reminder__action-btn"
                        href={icsUrl}
                        download="mevsyall-pick-reminder.ics"
                      >
                        Universal add (iOS, macOS, Android, Outlook)
                      </a>
                    </div>
                    <div className="calendar-reminder__manual">
                      <div className="calendar-reminder__manual-copy">
                        Prefer manual? Create a daily reminder titled "Make your picks" with link:
                      </div>
                      <a
                        href={reminderUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {reminderUrl}
                      </a>
                    </div>
                    <div style={{ marginTop: "10px" }}>😎🏈⚽️🏀🥇🏆👑✌🏿</div>
                </div>
            }
        </>
    );
};

export default CalendarReminder;