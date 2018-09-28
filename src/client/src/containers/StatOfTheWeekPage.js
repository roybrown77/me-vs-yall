import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  title: {
    margin: '12px 12px 0 12px',
    paddingTop: '12px'
  },
  stats: {
    margin: '12px 12px 0 12px'
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
                    <div style={styles.title}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography variant="headline" component="h3">
                          Stat of the Week
                        </Typography>
                      </Paper>
                    </div>
                    <div style={styles.stats}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography variant="headline" component="h3">
                          NFL
                        </Typography>
                        <Typography variant="subheading">
                          September 25, 2018
                        </Typography>
                        <Divider style={styles.divider} />
                        <Typography variant="display2">
                          16 teams have not won on the road after 48 games played.
                        </Typography>
                      </Paper>
                    </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;