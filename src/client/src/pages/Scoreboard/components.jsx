import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import IconButton from '@material-ui/core/IconButton';
import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';
import Share from '@material-ui/icons/BackupOutlined';
import Box from '@material-ui/core/Box';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3, padding: 0 }}>
            {children}
            </Box>
        )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const RemainingGamesNotifier = ({isAuthenticated, picksNotSelected}) => {
    if (!isAuthenticated || picksNotSelected === 0) {
        return null;
    }

    return (
        <Snackbar className="remaining-games-notifier" open={true}>
            <Alert severity="error">
                {`${picksNotSelected} Remaining Pick(s)`}
            </Alert>
        </Snackbar>
    );
};

const ScoreboardOptions = ({classes, spreadMode, copyData, openCopyAlert, isAuthenticated}) => {
    return (
        <div style={{
            justifyContent: 'center',
            display:'flex', 
            fontSize: '17px', 
            paddingBottom: '20px',
            fontFamily: 'monospace'}}>
            <div style={{marginRight: '40px'}} onClick={()=>{}}>
                <div>
                    <IconButton className={spreadMode ? classes.toggleButtonOn : classes.toggleButtonOff} aria-label="spreadModeToggle">
                        {spreadMode ? <ToggleOn/> : <ToggleOff/>}
                    </IconButton>
                </div>
                <div style={{marginTop: '-3px'}}>
                    beat vegas
                </div>
            </div>
            {
                document.queryCommandSupported('copy') &&
                <div style={{marginRight: '40px'}}>
                    <div>
                        <IconButton className={classes.toggleButtonOn} aria-label="share picks" onClick={this.handleSharePicks}>
                            <Share/>
                        </IconButton>
                    </div>
                    <div style={{marginTop: '-3px'}}>
                        share
                    </div>
                    <textarea style={{position:'fixed',bottom:'-10em'}} type="text" onChange={()=>{}} value={copyData} id="copyInput" readOnly />
                    <Snackbar open={openCopyAlert} autoHideDuration={10000} onClose={this.handleCopyAlertClose}>
                        <Alert onClose={this.handleCopyAlertClose} severity="success">
                        {isAuthenticated ? 'Picks copied!' : 'Games copied!'}
                        </Alert>
                    </Snackbar>
                </div>
            }
        </div>
    );
};

export {
    ScoreboardOptions,
    RemainingGamesNotifier,
    a11yProps,
};