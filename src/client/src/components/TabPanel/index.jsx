import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const TabPanel = (props) => {
    const { children, value, index } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        hidden={value !== index}
        style={{
            color: "rgba(0, 0, 0, .87)",
            fontSize: "1rem",
        }}>
            <Box sx={{ p: 3, padding: 0, display: value === index ? "block" : "none" }}>
            {children}
            </Box>
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default TabPanel;