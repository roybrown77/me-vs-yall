import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';

function PageContainer(props) {
    return (
        <div>
            <Header/>
            	<div className='page-container'>
                {props.children}
                </div>
            <Footer/>
        </div>
    );
}

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageContainer;