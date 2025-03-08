import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import ActiveChallenges from './pages/challenges/ActiveChallenges';
import PendingChallenges from './pages/challenges/PendingChallenges';
import AddChallenge from './pages/challenges/AddChallenge';
import ReviewChallenge from './pages/challenges/ReviewChallenge';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductsPage from './pages/shop/ProductsPage';
import OrdersPage from './pages/shop/OrdersPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<Dashboard />} />

        {/* Challenges Routes */}
        <Route path="/challenges/active-challenges" element={<ActiveChallenges />} />
        <Route path="/challenges/pending-challenges" element={<PendingChallenges />} />
        <Route path="/challenges/add-challenge" element={<AddChallenge />} />
        <Route path="/challenges/review-challenge" element={<ReviewChallenge />} />

        {/* Shop Routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
