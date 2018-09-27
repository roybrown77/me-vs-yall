import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  root: {
    margin: '12px',
    paddingTop: '12px'
  },
  container: {
    padding: '12px'
  },
  divider: {
    margin: '12px 0'
  }
};

function StatOfTheWeekPage () {
     return (
            <div>
                <PageContainer>
                    <div style={styles.root}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography variant="headline" component="h3">
                          NFL Stat of the Week
                        </Typography>
                        <Typography variant="subheading">
                          September 30, 2018
                        </Typography>
                        <Divider style={styles.divider} />
                        <Typography variant="display2">
                          17 teams have not won a road game after 2 weeks.
                        </Typography>
                      </Paper>
                    </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;