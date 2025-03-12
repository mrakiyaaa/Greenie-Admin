import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUp } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';

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
      const response = await apiRequest(API_ENDPOINTS.PRODUCTS.ADD, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          numberOfPoints: Number(formData.numberOfPoints),
          quantity: Number(formData.quantity),
          // Remove productID if it exists to let backend generate it
          productID: undefined,
        }),
      });

      // Log the response to check if backend is sending the correct ID
      console.log('New Product Response:', response);

      if (!response.productID) {
        console.warn('Backend did not return a product ID');
      }

      navigate('/products');
    } catch (err) {
      setError(err.message);
      console.error('Error adding product:', err);
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
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-textGray">Add New Product</h2>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="w-full">
                <label className="block text-sm font-medium text-textGray mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-4 py-4 sm:px-6 sm:py-6 border-2 border-outlineGray border-dashed rounded-md">
                  <div className="space-y-2 text-center">
                    <div className="flex flex-col items-center">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-md"
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
                        <ImageUp className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
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
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
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
                      className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
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
                      className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
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
                    className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
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
                    className="w-full p-2 sm:p-3 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-1/2 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600 disabled:opacity-50 order-1 sm:order-2"
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
