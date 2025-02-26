import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgLightGray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-textGray mb-6">Register</h1>
        {/* Add your registration form here */}
        <div className="text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primaryGreen hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
