import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageUp, X } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.PRODUCTS.GET_ONE(id));
        setFormData(data);
        if (data.imgURL) {
          setPreviewImage(data.imgURL);
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error:', err);
      }
    };

    fetchProduct();
  }, [id]);

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

    try {
      await apiRequest(API_ENDPOINTS.PRODUCTS.UPDATE(id), {
        method: 'PUT',
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

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-textGray mb-6">Edit Product</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red rounded-md">{error}</div>}

            {formData && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
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
                              <X size={16} />
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
                    </div>
                  </div>
                </div>

                {/* Form Fields similar to AddProduct... */}
                {/* ...existing form fields... */}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600"
                  >
                    {isLoading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
