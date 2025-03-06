import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import ActiveChallenges from './pages/challenges/ActiveChallenges';
import PendingChallenges from './pages/challenges/PendingChallenges';
import AddChallenge from './pages/challenges/AddChallenge';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

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
      </Routes>
    </Router>
  );
}

export default App;
