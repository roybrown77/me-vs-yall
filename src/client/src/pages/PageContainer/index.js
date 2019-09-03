import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

function PageContainer(props) {
    return (
        <div>
            <Header>
            	<div className='page-container'>
                    {props.children}
                </div>
            </Header>
            <Footer/>
        </div>
    );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageContainer;