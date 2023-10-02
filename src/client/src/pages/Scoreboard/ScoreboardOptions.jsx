import Snackbar from '@material-ui/core/Snackbar';

import IconButton from '@material-ui/core/IconButton';
import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';
import Share from '@material-ui/icons/BackupOutlined';

import Alert from '../../components/Alert';

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

export default ScoreboardOptions;