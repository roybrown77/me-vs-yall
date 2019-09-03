import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';

import { googleLogin } from '../../middleware/authenticationService';
import PageContainer from '../PageContainer';

const styles = {
    login: {
        margin: '8px',
        fontWeight: '600'
    },
    google: {
        border: '8px solid #dd4b39',
        borderRadius: '8px',
        color: '#dd4b39',
        cursor:'pointer'
    }
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchor: 'left',
        };
    }

    componentWillMount() {
        if (!this.props.isAuthenticated) {
            googleLogin();
        }
    }

    render () { 
        const { classes, isAuthenticated } = this.props;

        const userJson = localStorage.getItem('user');
        const user = JSON.parse(userJson || JSON.stringify({}));
        const picture = get(user,'picture');

        return (
        	<div>
                <PageContainer>
                    {
                        isAuthenticated && picture &&
                        <img className={classes.userPicture} src={picture} alt=""/>
                    }
                </PageContainer>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
        isAuthenticated
    }
};

Login.propTypes = {
    isAuthenticated: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Login));