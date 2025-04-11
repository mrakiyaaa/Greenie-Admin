import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import ActiveChallenges from './pages/challenges/ActiveChallenges';
import PendingChallenges from './pages/challenges/PendingChallenges';
import AddChallenge from './pages/challenges/AddChallenge';
import ReviewChallenge from './pages/challenges/ReviewChallenge';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductsPage from './pages/shop/pages/ProductsPage';
import OrdersPage from './pages/shop/pages/OrdersPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import AddProduct from './pages/shop/components/AddProduct';
import ProofSubmission from './pages/proofs/ProofSubmission';
import ViewProof from './pages/proofs/ViewProof';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/active-challenges"
            element={
              <ProtectedRoute>
                <ActiveChallenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/pending-challenges"
            element={
              <ProtectedRoute>
                <PendingChallenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/add-challenge"
            element={
              <ProtectedRoute>
                <AddChallenge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/review-challenge/:challengeId"
            element={
              <ProtectedRoute>
                <ReviewChallenge />
              </ProtectedRoute>
            }
          />
          <Route path="/proofs/proof-submission" element={<ProofSubmission />} />
          <Route path="/proofs/view-proof" element={<ViewProof />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
