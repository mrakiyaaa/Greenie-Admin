import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PendingCard from '../../components/challenges/PendingCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

function PendingChallenges() {
  const navigate = useNavigate();
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // Fetch pending challenges
    fetch('http://localhost:8080/api/admin/challenges/status/pending')
      .then(response => response.json())
      .then(data => setPendingChallenges(data))
      .catch(error => console.error('Error fetching pending challenges:', error));

    // Fetch active challenge count for display
    fetch('http://localhost:8080/api/admin/challenges/status/active')
      .then(response => response.json())
      .then(data => setActiveCount(data.length))
      .catch(error => console.error('Error fetching active challenge count:', error));
  }, []);

  function handleClick() {
    navigate('/challenges/add-challenge');
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between mb-4">
            {/* Status Filters */}
            <div className="flex space-x-4">
              <span
                className="bg-green-200 text-green-800 px-4 py-1 rounded-full cursor-pointer"
                onClick={() => navigate('/challenges/active-challenges')}
              >
                Active ({activeCount})
              </span>
              <span
                className="bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full cursor-pointer"
                onClick={() => navigate('/challenges/pending-challenges')}
              >
                Pending ({pendingChallenges.length})
              </span>
            </div>

            {/* Add Challenge Button */}
            <Button onClick={handleClick}>Add Challenge</Button>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {pendingChallenges.map(challenge => (
              <Link
                key={challenge.challengeId}
                to={`/challenges/review-challenge/${challenge.challengeId}`}
                state={{ challenge }}
              >
                <PendingCard challenge={challenge} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingChallenges;
