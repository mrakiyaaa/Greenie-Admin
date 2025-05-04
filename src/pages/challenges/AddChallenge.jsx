import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddChallenges() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photoUrl: '',
    name: '',
    points: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      challengeName: formData.name,
      points: parseInt(formData.points),
      description: formData.description,
      photoUrl: formData.photoUrl,
    };

    try {
      const response = await fetch('http://localhost:8080/api/admin/challenges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();

      if (response.ok) {
        setMessage('Challenge added successfully!');
        setIsError(false);
        setFormData({ photoUrl: '', name: '', points: '', description: '' });
      } else {
        setMessage(resultText || 'Failed to add challenge.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error submitting challenge.');
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg">
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
            isError ? 'bg-red' : 'bg-primaryGreen'
          } text-white`}
        >
          {message}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 border-b pb-3 mt-6">Add New Challenge</h2>

      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-medium mb-2">
          Upload an Image URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="photoUrl"
          className="w-full border border-gray-300 p-2 text-center h-32 rounded"
          placeholder="Paste image URL here"
          value={formData.photoUrl}
          onChange={handleChange}
        />
        {formData.photoUrl && (
          <div className="mt-4">
            <img
              src={formData.photoUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

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
