import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/challenges" className="text-primaryGreen hover:underline">
        Go to Challenges
      </Link>
    </div>
  );
}

export default Dashboard;
