import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUp } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

function AddProduct() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    numberOfPoints: '',
    quantity: '',
    shortDescription: '',
    fullDescription: '',
    imgURL: 'https://via.placeholder.com/300',
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          imgURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiRequest(API_ENDPOINTS.PRODUCTS.ADD, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          numberOfPoints: Number(formData.numberOfPoints),
          quantity: Number(formData.quantity),
        }),
      });
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-textGray mb-6">Add New Product</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textGray mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-outlineGray border-dashed rounded-md">
                  <div className="space-y-2 text-center">
                    <div className="flex flex-col items-center">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-40 w-40 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData(prev => ({
                                ...prev,
                                imgURL: 'https://via.placeholder.com/300',
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red text-white rounded-full p-1 hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 mt-2">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primaryGreen hover:text-green-600">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textGray mb-1">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">Points</label>
                  <input
                    type="number"
                    name="numberOfPoints"
                    value={formData.numberOfPoints}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textGray mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textGray mb-1">
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
