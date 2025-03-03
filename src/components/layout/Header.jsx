import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const location = useLocation();

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');

    if (!savedProfile) {
      fetch('http://localhost:8080/api/user/profile')
        .then(response => response.json())
        .then(data => {
          setProfile(data);
          localStorage.setItem('userProfile', JSON.stringify(data));
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          const defaultProfile = {
            name: 'John Doe',
            imageUrl: 'https://via.placeholder.com/40',
          };
          setProfile(defaultProfile);
          localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        });
    }
  }, [location.pathname]);

  return (
    <header className="bg-white w-full p-2 sm:p-4 md:p-5 lg:p-6 flex justify-between items-center border-b-2 border-outline">
      {profile && (
        <img
          src={profile.imageUrl || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="w-10 h-10 rounded-full bg-gray-300 object-cover ml-auto"
        />
      )}
    </header>
  );
}

export default Header;
