import { useEffect } from 'react';
import Grid from '@mui/material/Grid';

import PageContainer from '../../components/PageContainer';

import hoodiesBw from '../../styles/images/mvy-hoodie-white-bw.jpg';
import shirtsBw from '../../styles/images/mvy-tee-black-bw.jpg';
import shirts from '../../styles/images/mvy-tee-white-romey.jpg';
import shirtGray from '../../styles/images/mvy-tee-gray.jpg';
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
    name: 'White Hoodie',
    price: 'Sold Out',
    source: 'courtesy @ _jayfilms'
  },
  {
    id: 2,
    image: shirtsBw,
    name: 'Black Tee',
    price: 'Sold Out',
    contact: '@ _jayfilms'
  },
  {
    id: 3,
    image: shirts,
    name: 'White Tee',
    price: 'Sold Out',
    contact: '@ _romeyofficial'
  },
  {
    id: 4,
    image: shirtGray,
    name: 'Gray Tee',
    price: 'Sold Out'
  },
  {
    id: 5,
    image: stickers,
    name: 'Stickers',
    price: 'Sold Out'
  }
];

const Shop = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
  },[]);

  return (
    <PageContainer>
      <Grid container style={styles.root}>
        <Grid item xs={12} style={{paddingTop:'12px'}}>
          <Grid container justify="center">
            {items.map(item => (
              <Grid key={item.id} item style={{padding:'4px',cursor:'pointer'}}>
                <div style={styles.item}>
                  <div style={styles.name}>{item.name}</div>
                  <img src={item.image} style={styles.image} alt=""/>
                  <div style={styles.price}>{item.price}</div>
                  <div style={styles.contact}>{item.contact}</div>
                  <div style={styles.source}>{item.source}</div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Shop;