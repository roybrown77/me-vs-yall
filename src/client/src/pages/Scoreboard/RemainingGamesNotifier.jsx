import Snackbar from '@mui/material/Snackbar';

import Alert from '../../components/Alert';

const RemainingGamesNotifier = ({isAuthenticated, picksNotSelected}) => {
    if (!isAuthenticated || picksNotSelected === 0) {
        return null;
    }

    return (
        <Snackbar
            className="remaining-games-notifier"
            open={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert severity="error">
                {`${picksNotSelected} Remaining Pick(s)`}
            </Alert>
        </Snackbar>
    );
};

export default RemainingGamesNotifier;