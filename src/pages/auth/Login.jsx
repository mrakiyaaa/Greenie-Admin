import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgLightGray">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-textGray mb-6">Login</h1>
        {/* Add your login form here */}
        <div className="mt-4 text-sm">
          Don t have an account?{' '}
          <Link to="/register" className="text-primaryGreen hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
