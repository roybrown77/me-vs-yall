import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';

import PageContainer from '../PageContainer';

import hoodiesBw from '../../styles/images/mvy-hoodie-white-bw.jpg';
import hoodies from '../../styles/images/mvy-hoodie-white-jossie.jpg';
import shirtsBw from '../../styles/images/mvy-tee-black-bw.jpg';
import shirts from '../../styles/images/mvy-tee-white-romey.jpg';
import stickers from '../../styles/images/mvy-sticker-gray.jpg';

const styles = {
  root: {
    flexGrow: 1,
  },
  item: {
    color: '#fff'
  },
  image: {
    width: 300
  },
  name: {
    position: 'relative',
    top: '48px',
    paddingRight: '65%'
  },
  price: {
    position: 'relative',
    paddingRight: '75%',
    bottom: '48px'
  },
  contact: {
    position: 'relative',
    paddingLeft: '55%',
    bottom: '48px'
  },
  source: {
    fontWeight: 700,
    position: 'absolute',
    fontSize: '10px',
    marginTop: '-16px',
    color: '#ABB2B9'
  }
};

const items = [
  {
    id: 1,
    image: hoodiesBw,
    name: 'Hoodies',
    price: '$40',
    source: 'courtesy @ _jayfilms'
  },
  {
    id: 2,
    image: hoodies,
    name: 'Hoodies',
    price: '$40',
    source: 'courtesy @ _jayfilms'
  },
  {
    id: 3,
    image: shirtsBw,
    name: 'Tees',
    price: '$20',
    contact: '@ _jayfilms'
  },
  {
    id: 4,
    image: shirts,
    name: 'Tees',
    price: '$20',
    contact: '@ _romeyofficial'
  },
  {
    id: 5,
    image: stickers,
    name: 'Stickers',
    price: '$1'
  }
];

class Shop extends React.Component {
  render() {
    const {width} = this.props;

    return (
      <PageContainer>
        <Grid container style={styles.root}>
          <Grid item xs={12} style={{paddingTop:'12px'}}>
            <Grid container justify="center">
              {items.map(item => (
                <Grid key={item.id} item style={{padding:'4px',cursor:'pointer'}}>
                  <div style={styles.item}>
                    <div style={styles.name}>{item.name}</div>
                    <img src={item.image} style={styles.image}/>
                    <div style={styles.price}>{item.price}</div>
                    <div style={styles.contact}>{item.contact}</div>
                    <div style={styles.source}>{item.source}</div>
                  </div>
                </Grid>
              ))}
            </Grid>
            <div style={{padding:'12px'}}>Please call 404.539.7786 to order.</div>
          </Grid>
        </Grid>
      </PageContainer>
    );
  }
}

const mapStateToProps = (state) => {
    return {
    }
};

Shop.propTypes = {
};

Shop.defaultProps = {
};

export default compose(
    withStyles(styles),
    withWidth(),
    connect(mapStateToProps,{})
)(Shop);