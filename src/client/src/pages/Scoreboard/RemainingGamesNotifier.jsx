import Snackbar from '@mui/material/Snackbar';

import Alert from '../../components/Alert';

import './remaining-games-notifier.css';

const RemainingGamesNotifier = ({
  isAuthenticated,
  picksNotSelected,
  picksDataLoading = false,
}) => {
  if (
    !isAuthenticated ||
    picksDataLoading ||
    picksNotSelected === 0
  ) {
    return null;
  }

    return (
        <Snackbar
            className="remaining-games-notifier"
            open={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                severity="error"
                style={{
                    fontWeight: 'bold',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                }}
            >
                <span className="flash">{`${picksNotSelected} Remaining Pick(s) 🤩`}</span>
            </Alert>
        </Snackbar>
    );
};

export default RemainingGamesNotifier;
