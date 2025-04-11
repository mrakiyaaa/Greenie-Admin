import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ActiveCard from '../../components/challenges/ActiveCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

function ActiveChallenges() {
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Fetch only ACTIVE challenges
    fetch('http://localhost:8080/api/admin/challenges/status/active')
      .then(response => response.json())
      .then(data => setActiveChallenges(data))
      .catch(error => console.error('Error fetching active challenges:', error));

    // Fetch pending challenge count
    fetch('http://localhost:8080/api/admin/challenges/status/pending')
      .then(response => response.json())
      .then(data => setPendingCount(data.length))
      .catch(error => console.error('Error fetching pending challenge count:', error));
  }, []);

  function handleClick() {
    navigate('/challenges/add-challenge');
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Status Filters & Add Challenge Button */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            {/* Status Filters */}
            <div className="flex space-x-4">
              <span
                className="bg-green-200 text-green-800 px-4 py-1 rounded-full cursor-pointer"
                onClick={() => navigate('/challenges/active-challenges')}
              >
                Active ({activeChallenges.length})
              </span>
              <span
                className="bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full cursor-pointer"
                onClick={() => navigate('/challenges/pending-challenges')}
              >
                Pending ({pendingCount})
              </span>
            </div>

            {/* Add Challenge Button */}
            <Button onClick={handleClick}>Add Challenge</Button>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {activeChallenges.length > 0 ? (
              activeChallenges.map(challenge => (
                <Link
                  key={challenge.challengeId}
                  to={`/challenges/review-challenge/${challenge.challengeId}`}
                  state={{ challenge }}
                >
                  <ActiveCard challenge={challenge} />
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No active challenges found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveChallenges;
