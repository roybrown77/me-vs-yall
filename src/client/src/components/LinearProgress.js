import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function LinearIndeterminate(props) {
  const { classes } = props;
  return (
    <div style={styles.root}>
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
      <br />
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
      <br />
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
      <br />
      <LinearProgress />
    </div>
  );
}

export default LinearIndeterminate;