import MuiAlert from '@mui/material/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default Alert;