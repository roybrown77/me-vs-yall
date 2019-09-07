import React from 'react';

import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

import PageContainer from '../PageContainer';
import blue from '../../styles/images/blue-mvy.png'
import white from '../../styles/images/white-mvy.jpg'

function Shop () {
     return (
            <PageContainer>
                <div style={{padding: '12px 0'}}>
                  <div style={{textAlign:'left', fontFamily: 'Courier New,Courier,Monaco', paddingLeft: '12px'}}>
                    <div style={{fontSize: '17px'}}>MvY Tee</div>
                  	<div style={{fontWeight: '700', fontSize: '15px'}}>Blue</div>
                  </div>
                	<div style={{display: 'flex', padding: '12px 0'}}>
                  	<div style={{margin: 'auto', padding: '16px', border: '16px solid #fff'}}>
                    	<img src={blue} alt=""/>
                	  </div>
                	</div>
                  {
                    false &&
                  	<div style={{padding: '4px 12px', display: 'flex', backgroundColor: '#f4f7f6', boxShadow: '0 0px 3px 1px #ccc'}}>
                  		<div style={{fontFamily: 'Courier New,Courier,Monaco', fontSize: '17px', margin: 'auto 0'}}>$30</div>
                      <div>
                        <NativeSelect
                          style={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                padding: '0 20px',
                                border: '4px solid lightgray'
                          }}
                          value={20}
                          onChange={()=>{}}
                          input={<InputBase name="size" id="size-customized-native-simple" />}
                        >
                          <option value={10}>Small</option>
                          <option value={20}>Medium</option>
                          <option value={30}>Large</option>
                        </NativeSelect>
                      </div>
                      <div>
                        <Button
                            variant="contained" 
                            style={{
                              marginTop: '2px',
                              fontWeight: "700",
                              backgroundColor: '#3772FA',
                              color: '#FFFFFF',
                              borderColor: '#3772FA',
                              '&:hover': {
                                backgroundColor: '#3772FA',
                                color: '#FFFFFF',
                                borderColor: '#3772FA',
                              }
                            }}
                            onClick={() => {}}>
                          add to cart
                        </Button>
                      </div>
                  	</div>
                  }
                  {
                    true &&
                    <div style={{margin: '0 12px', padding: '16px', display: 'flex', border: '4px solid lightblue', borderRadius: '8px'}}>
                      <div style={{fontFamily: 'Courier New,Courier,Monaco', fontSize: '15px', margin: 'auto'}}>coming soon...please email mevsyallsports@gmail.com to be placed on mailing list</div>
                    </div>
                  }
              	</div>
            </PageContainer>
        );
}

export default Shop;