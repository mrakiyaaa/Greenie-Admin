import { Link } from 'react-router-dom';

function Challenges() {
  return (
    <div>
      <h1>Challenges</h1>
      <Link to="/" className="text-primaryGreen hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default Challenges;
