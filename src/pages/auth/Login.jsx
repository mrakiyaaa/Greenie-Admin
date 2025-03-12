import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginimg from '../../assets/login.svg';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.LOGIN, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Store auth data in localStorage
      localStorage.setItem(
        'adminAuth',
        JSON.stringify({
          token: response.token,
          name: response.name,
          adminId: response.adminId,
          role: response.role,
        })
      );

      // Redirect to dashboard
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-white px-12 flex flex-col md:flex-row w-full max-w-[1440px]">
        <div className="md:w-1/2 flex justify-center items-center">
          <img src={loginimg} alt="Login" className="w-full max-w- md:max-w-[500px] h-auto" />
        </div>

        <div className="md:w-1/2 flex flex-col items-center md:py-12 md:mt-5">
          <h2 className="text-[24px] text-textGray font-sans font-normal text-center mb-6">
            Log in to your Account
          </h2>

          {error && (
            <div className="w-full max-w-[400px] mb-4 p-3 bg-red-100 text-red rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail Address"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primaryGreen text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                'Login to Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
