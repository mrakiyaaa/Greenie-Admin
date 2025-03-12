import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
  const auth = localStorage.getItem('adminAuth');

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
