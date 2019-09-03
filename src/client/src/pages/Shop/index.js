import React from 'react';

import PageContainer from '../PageContainer';
import blue from '../../styles/images/blue-mvy.png'
import white from '../../styles/images/white-mvy.jpg'

function Shop () {
     return (
            <PageContainer>
                <div style={{padding: '12px 0'}}>
                  <div style={{textAlign:'left', fontFamily: 'Courier New,Courier,Monaco', paddingLeft: '12px'}}>
                    <div style={{fontSize: '15px'}}>MvY Tee</div>
                  	<div style={{fontWeight: '700', fontSize: '12px'}}>Blue</div>
                  </div>
                	<div style={{display: 'flex', padding: '12px 0'}}>
                  	<div style={{margin: 'auto', padding: '16px', border: '16px solid #fff'}}>
                    	<img src={blue} alt=""/>
                	  </div>
                	</div>
                  {
                    false &&
                  	<div style={{padding: '16px', display: 'flex', backgroundColor: '#f4f7f6', boxShadow: '0 0px 3px 1px #ccc'}}>
                  		<div style={{fontFamily: 'Courier New,Courier,Monaco', fontSize: '16px'}}>$30</div>
                  	</div>
                  }
                  <div style={{margin: '0 12px', padding: '16px', display: 'flex', border: '4px solid lightblue', borderRadius: '8px'}}>
                    <div style={{fontFamily: 'Courier New,Courier,Monaco', fontSize: '16px', margin: 'auto'}}>coming soon...please email mevsyallsports@gmail.com to be placed on mailing list</div>
                  </div>
              	</div>
            </PageContainer>
        );
}

export default Shop;