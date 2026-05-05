import PropTypes from 'prop-types';

import Header from '../Header';
import Footer from '../Footer';

import { isConfirmedAuthentication } from '../../utilities/authenticationClient';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

const PageContainer = (props) => {
    useGoogleAnalytics();

    if (false && !isConfirmedAuthentication()) {
        window.location.href = '/';
        return null;
    }

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
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageContainer;