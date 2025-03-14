import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginimg from '../../assets/login.svg';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { useToast } from '../../hooks/useToast';

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = error => {
    switch (error?.message) {
      case 'Invalid credentials':
        return 'Incorrect email or password';
      case 'User not found':
        return 'No account found with this email';
      case 'Account locked':
        return 'Your account has been locked. Please contact support';
      case 'Account disabled':
        return 'Your account has been disabled. Please contact support';
      case 'Network error - Please check your internet connection':
        return 'Unable to connect - Please check your internet connection';
      default:
        if (error?.message?.startsWith('Server error:')) {
          return 'Something went wrong on our end. Please try again later';
        }
        return error?.message || 'An unexpected error occurred';
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN.LOGIN, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      localStorage.setItem(
        'adminAuth',
        JSON.stringify({
          token: response.token,
          name: response.name,
          adminId: response.adminId,
          role: response.role,
        })
      );

      showToast('Successfully logged in', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      // Clear password field on authentication errors
      if (error.message === 'Invalid credentials' || error.message === 'User not found') {
        setFormData(prev => ({ ...prev, password: '' }));
      }
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
