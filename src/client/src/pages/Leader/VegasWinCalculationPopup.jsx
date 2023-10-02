import Popover from '../../components/Popover';

const VegasWinCalculationPopup = (props) => {
    const { leader, title='', showInfo=false } = props;

    if (!showInfo) {
        return (
            <div style={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700', cursor: 'pointer'}}>
                {`${title}${leader.vegasWinnings}`}
            </div>
        );
    }

    return (
        <Popover 
            title={`${title}${leader.vegasWinnings}`}
            titleStyle={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700', cursor: 'pointer'}}
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

export default VegasWinCalculationPopup;