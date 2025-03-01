import PropTypes from 'prop-types';

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="bg-primaryGreen text-white px-4 py-2 rounded-md">
      {children}
    </button>
  );
}

// Add PropTypes validation for the props
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
