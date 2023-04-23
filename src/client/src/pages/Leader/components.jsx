import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

import Popover from '../../components/Popover';

function TabPanel(props) {
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
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const VegasWinCalculation = (props) => {
    const { leader, title='', showInfo=false } = props;

    if (!showInfo) {
        return (
            <div style={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700'}}>
                {`${title}${leader.vegasWinnings}`}
            </div>
        );
    }

    return (
        <Popover 
            title={`${title}${leader.vegasWinnings}`}
            titleStyle={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700'}}
        >
            <div style={{padding:'16px'}}>
                <div>${(leader.wins + leader.losses) * 110} initial bets = {leader.wins + leader.losses} bets x $110</div>
                <div style={{paddingTop:'16px'}}>{leader.positiveWinnings ? '$' : '-$'}{Math.abs(leader.wins * 100 - leader.losses * 110)} profit = {leader.wins} wins x $100 - {leader.losses} losses x $110</div>
                <div style={{paddingTop:'16px'}}>${leader.wins * 100 + leader.wins * 110} payout = initial bets + profit</div>
                <div style={{paddingTop:'16px', fontStyle: 'italic'}}>Wins are determined against the spread</div>
            </div>
        </Popover>
    );
};

export {
    a11yProps,
    VegasWinCalculation,
};