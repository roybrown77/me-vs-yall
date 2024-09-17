import PropTypes from 'prop-types';

import Header from '../Header';
import Footer from '../Footer';

const PageContainer = (props) => {
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