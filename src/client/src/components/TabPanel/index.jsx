import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const TabPanel = (props) => {
    const {
        children,
        value,
        index,
        idPrefix = "simple",
        bold = true,
    } = props;

    const isActive = value === index;

    return (
        <div
            role="tabpanel"
            hidden={!isActive}
            id={`${idPrefix}-tabpanel-${index}`}
            aria-labelledby={`${idPrefix}-tab-${index}`}
            style={{
                color: "rgba(0, 0, 0, .87)",
                fontSize: "1rem",
                ...(bold ? { fontWeight: "bold" } : {}),
            }}
        >
            <Box sx={{ p: 3, padding: 0, display: isActive ? "block" : "none" }}>
                {children}
            </Box>
        </div>
    );
};

TabPanel.propTypes = {
    bold: PropTypes.bool,
    children: PropTypes.node,
    idPrefix: PropTypes.string,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default TabPanel;
