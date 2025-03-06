import { useState } from 'react';
import { ImageUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AddChallenges() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    points: '',
    description: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle file upload
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  }

  // Handle input change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const challengeData = new FormData();
    challengeData.append('image', formData.image);
    challengeData.append('name', formData.name);
    challengeData.append('points', formData.points);
    challengeData.append('description', formData.description);

    try {
      const response = await fetch('http://localhost:8080/api/challenges', {
        method: 'POST',
        body: challengeData,
      });

      if (response.ok) {
        setMessage('Challenge added successfully!');
        setIsError(false);
        setFormData({ image: null, name: '', points: '', description: '' });
        setPreviewImage(null);
      } else {
        setMessage('Failed to add challenge.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error submitting challenge.');
      setIsError(true);
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
      {/* Popup Message */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${isError ? 'bg-red' : 'bg-primaryGreen'} text-white`}
        >
          {message}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 mt-6">Add New Challenge</h2>

      {/* Image Upload */}
      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-medium mb-1">
          Challenge Image <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 p-20 rounded-lg flex flex-col items-center cursor-pointer">
          <ImageUp className="text-gray-500 text-3xl mb-2" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <p className="text-gray-500 text-sm">Upload Image</p>
        </div>
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-md"
          />
        )}
      </div>

      {/* Challenge Name */}
      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-medium mb-1">
          Challenge Name <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter challenge name"
          className="border border-gray-300 p-3 w-full rounded-md"
        />
      </div>

      {/* Number of Points */}
      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-medium mb-1">
          Number of Points <span className="text-red">*</span>
        </label>
        <input
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          placeholder="Enter points"
          className="border border-gray-300 p-3 w-full rounded-md"
        />
      </div>

      {/* Challenge Description */}
      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-medium mb-1">
          Challenge Description <span className="text-red">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter challenge description"
          className="border border-gray-300 p-3 w-full rounded-md"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-red text-white px-4 py-2 rounded-md w-1/2 mr-2"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primaryGreen text-white px-4 py-2 rounded-md w-1/2 ml-2"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Challenge'}
        </button>
      </div>
    </div>
  );
}

export default AddChallenges;
