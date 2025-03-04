import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    navigate('/add-challenge');
  }

  // Example challenge cards if no challenges exist
  const exampleChallenges = [
    {
      id: 4,
      name: 'Beach Cleanup',
      points: 120,
      description: 'Participate in a beach cleanup and submit photos.',
      status: 'pending',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      name: 'Carpool for a Week',
      points: 90,
      description: 'Reduce carbon emissions by carpooling for a whole week.',
      status: 'pending',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      name: 'Switch to Reusable Bags',
      points: 60,
      description: 'Use reusable bags instead of plastic for grocery shopping.',
      status: 'pending',
      image: 'https://via.placeholder.com/150',
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
                  navigate('/active-challenges');
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
                  navigate('/pending-challenges');
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
                  return <PendingCard key={challenge.id} challenge={challenge} />;
                })
              : exampleChallenges.map(function (challenge) {
                  return <PendingCard key={challenge.id} challenge={challenge} />;
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingChallenges;
