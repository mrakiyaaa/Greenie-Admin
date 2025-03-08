import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PendingCard from '../../components/challenges/PendingCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';

function PendingChallenges() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(function () {
    fetch('http://localhost:8080/api/challenges') // Replace with your actual API endpoint
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setChallenges(data);
      })
      .catch(function (error) {
        console.error('Error fetching challenges:', error);
      });
  }, []);

  function handleClick() {
    navigate('/challenges/add-challenge');
  }

  // Example challenge cards if no challenges exist
  const exampleChallenges = [
    {
      id: 4,
      name: 'Beach Cleanup',
      points: 120,
      description: 'Participate in a beach cleanup and submit photos.',
      status: 'pending',
      image:
        'https://images.stockcake.com/public/5/3/8/5380c746-d505-424a-9800-c41a762037cb_large/beach-clean-up-efforts-stockcake.jpg',
    },
    {
      id: 5,
      name: 'Carpool for a Week',
      points: 90,
      description: 'Reduce carbon emissions by carpooling for a whole week.',
      status: 'pending',
      image: 'https://talkintrashwithuhn.com/wp-content/uploads/2019/02/carpool-week-2019.png',
    },
    {
      id: 6,
      name: 'Switch to Reusable Bags',
      points: 60,
      description: 'Use reusable bags instead of plastic for grocery shopping.',
      status: 'pending',
      image:
        'https://www.fosters.com/gcdn/authoring/2009/05/06/NFDD/ghows-FD-fd67ea7e-ee87-422b-b341-0fa9cc784b82-c58ae020.jpeg?width=1200&disable=upscale&format=pjpg&auto=webp',
    },
  ];

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
                className="bg-green-200 text-green-800 px-4 py-1 rounded-full cursor-pointer "
                onClick={function () {
                  navigate('/challenges/active-challenges');
                }}
              >
                Active (
                {
                  challenges.filter(function (c) {
                    return c.status === 'active';
                  }).length
                }
                )
              </span>
              <span
                className="bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full cursor-pointer"
                onClick={function () {
                  navigate('/challenges/pending-challenges');
                }}
              >
                Pending (
                {
                  challenges.filter(function (c) {
                    return c.status === 'pending';
                  }).length
                }
                )
              </span>
            </div>

            {/* Add Challenge Button */}
            <Button onClick={handleClick}>Add Challenge</Button>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {challenges.length > 0
              ? challenges.map(function (challenge) {
                  return (
                    <Link key={challenge.id} to="/proofs/view-proof" state={{ challenge }}>
                      <PendingCard challenge={challenge} />
                    </Link>
                  );
                })
              : exampleChallenges.map(function (challenge) {
                  return (
                    <Link key={challenge.id} to="/proofs/view-proof" state={{ challenge }}>
                      <PendingCard challenge={challenge} />
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingChallenges;
