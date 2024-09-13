import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { loadUser } from '../../actions';

const AuthenticationCallback = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return null;
};

AuthenticationCallback.propTypes = {
  loadUser: PropTypes.func.isRequired
};

export default AuthenticationCallback;