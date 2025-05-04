import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <p className="text-gray-600 text-sm">{title}</p>
      <h3 className="text-2xl font-medium">{value}</h3>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const OrderItem = ({ orderNumber, customer, amount, status, date }) => {
  const normalizedStatus = status ? status.toLowerCase() : '';

  const getStatusStyle = () => {
    switch (normalizedStatus) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div>
        <p className="font-medium text-sm">#{orderNumber}</p>
        <p className="text-xs text-gray-500">{customer}</p>
      </div>
      <div>
        <p className="text-sm">${amount}</p>
      </div>
      <div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle()}`}>{status}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  customer: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

const PostItem = ({ title, author, category, date }) => {
  const displayDate = date && date !== 'N/A' ? date : 'No date available';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex-1">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-gray-500">by {author}</p>
      </div>
      <div className="ml-4">
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{category}</span>
      </div>
      <div className="ml-4">
        <p className="text-xs text-gray-500">{displayDate}</p>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string,
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    activeProducts: 0,
    activeMembers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api/admin';

  const formatDate = dateString => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authData = localStorage.getItem('adminAuth');
        if (!authData) {
          setIsAuthenticated(false);
          setError('You must be logged in to view the dashboard.');
          setLoading(false);
          redirectToLogin();
          return;
        }

        const parsed = JSON.parse(authData);
        if (!parsed.token) {
          setIsAuthenticated(false);
          setError('Invalid authentication data.');
          setLoading(false);
          redirectToLogin();
          return;
        }

        setIsAuthenticated(true);
        setLoading(true);

        const authHeader = {
          headers: {
            Authorization: `Bearer ${parsed.token}`,
            'Content-Type': 'application/json',
          },
        };

        console.log('Fetching dashboard stats...');
        try {
          const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`, authHeader);
          console.log('Stats response:', statsResponse.data);
          setStats(statsResponse.data);

          console.log('Fetching recent orders...');
          const ordersResponse = await axios.get(
            `${API_BASE_URL}/dashboard/recent-orders`,
            authHeader
          );
          console.log('Orders response:', ordersResponse.data);

          const formattedOrders = ordersResponse.data.map(order => ({
            id: order.id,
            orderNumber: order.orderId || order.id,
            customer: order.user ? order.user.name : 'Anonymous',
            amount: order.totalAmount ? order.totalAmount.toFixed(2) : '0.00',
            status: order.status || 'Pending',
            date: formatDate(order.createdAt),
          }));
          setOrders(formattedOrders);

          console.log('Fetching recent posts...');
          const postsResponse = await axios.get(
            `${API_BASE_URL}/dashboard/recent-posts`,
            authHeader
          );
          console.log('Posts response:', postsResponse.data);

          const formattedPosts = postsResponse.data.map(post => ({
            id: post.id,
            title: post.title || 'Untitled Post',
            author: post.user ? post.user.name : 'Anonymous',
            category: post.category || 'General',
            date: post.createdAt ? formatDate(post.createdAt) : 'No date',
          }));
          setPosts(formattedPosts);

          setLoading(false);
          setError(null);
        } catch (apiError) {
          console.error('API Error:', apiError);

          if (
            apiError.response &&
            (apiError.response.status === 401 || apiError.response.status === 403)
          ) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
            redirectToLogin();
          } else {
            setError(
              `Error loading dashboard data: ${apiError.response?.data?.error || apiError.message}`
            );
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsAuthenticated(false);
        setLoading(false);
        redirectToLogin();
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6 flex justify-center items-center h-full">
            <div className="text-center">
              <p className="text-gray-500">Loading dashboard data...</p>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6">
            <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
              <p>{error || 'Authentication failed. Please log in again.'}</p>
            </div>
            <button
              onClick={redirectToLogin}
              className="bg-primaryGreen text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="p-6">
            <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={redirectToLogin}
              className="bg-primaryGreen text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Users" value={stats.totalUsers || 0} />
            <StatsCard title="Total Posts" value={stats.totalPosts || 0} />
            <StatsCard title="Active Products" value={stats.activeProducts || 0} />
            <StatsCard title="Active Members" value={stats.activeMembers || 0} />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Last Orders</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              {orders.length > 0 ? (
                orders.map(order => (
                  <OrderItem
                    key={order.id}
                    orderNumber={order.orderNumber}
                    customer={order.customer}
                    amount={order.amount}
                    status={order.status}
                    date={order.date}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders found</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Last Posts</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostItem
                    key={post.id}
                    title={post.title}
                    author={post.author}
                    category={post.category}
                    date={post.date}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent posts found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
