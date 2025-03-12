import { useState, useEffect } from 'react';
import { Plus, X, ImageUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import ProductTable from '../components/ProductTable';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.PRODUCTS.GET_ALL);
      setProducts(data);
    } catch (error) {
      setError('Failed to fetch products');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = product => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = product => {
    setEditFormData(product);
    setEditPreviewImage(product.imgURL);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    setIsEditLoading(true);

    try {
      await apiRequest(API_ENDPOINTS.PRODUCTS.UPDATE(editFormData.productID), {
        method: 'PUT',
        body: JSON.stringify({
          ...editFormData,
          price: Number(editFormData.price),
          numberOfPoints: Number(editFormData.numberOfPoints),
          quantity: Number(editFormData.quantity),
        }),
      });
      setIsEditModalOpen(false);
      fetchProducts(); // Refresh list
      setError(''); // Clear any existing errors
    } catch (err) {
      // Changed from apiError to err since we're using the error message
      setError(err.message || 'Failed to update product');
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleEditImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreviewImage(reader.result);
        setEditFormData(prev => ({
          ...prev,
          imgURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleteLoading(true);
    setDeleteError('');

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS.DELETE(selectedProduct.productID), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setShowDeleteModal(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      setDeleteError(error.message || 'Failed to delete product');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-textGray">Products</h2>
            <button
              onClick={() => navigate('/products/add')}
              className="flex items-center gap-2 bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          <div className="bg-white rounded-lg border border-outlineGray overflow-hidden">
            <ProductTable
              products={products}
              isLoading={isLoading}
              error={error}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={product => {
                setSelectedProduct(product);
                setShowDeleteModal(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-textGray mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-2">Are you sure you want to delete:</p>
            <p className="text-base font-medium text-textGray mb-4">
              &quot;{selectedProduct?.productName}&quot;?
            </p>
            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 text-red rounded-md text-sm">{deleteError}</div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 bg-red text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
              >
                {isDeleteLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-textGray">Product Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-textGray hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={selectedProduct.imgURL}
                alt={selectedProduct.productName}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product Name</h4>
                  <p className="text-textGray">{selectedProduct.productName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Price</h4>
                  <p className="text-textGray">
                    LKR {selectedProduct.price.toLocaleString('en-LK')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Points</h4>
                  <p className="text-textGray">{selectedProduct.numberOfPoints}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Quantity</h4>
                  <p className="text-textGray">{selectedProduct.quantity}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Short Description</h4>
                  <p className="text-textGray">{selectedProduct.shortDescription}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Description</h4>
                  <p className="text-textGray">{selectedProduct.fullDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-textGray">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-textGray hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-textGray mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-outlineGray border-dashed rounded-md">
                  <div className="space-y-2 text-center">
                    <div className="flex flex-col items-center">
                      {editPreviewImage ? (
                        <div className="relative">
                          <img
                            src={editPreviewImage}
                            alt="Preview"
                            className="h-40 w-40 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditPreviewImage(null);
                              setEditFormData(prev => ({
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
                            onChange={handleEditImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.productName}
                    onChange={e =>
                      setEditFormData({ ...editFormData, productName: e.target.value })
                    }
                    className="w-full p-2 border border-outlineGray rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-textGray mb-1">
                      Price (LKR)
                    </label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={e => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full p-2 border border-outlineGray rounded-md"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textGray mb-1">Points</label>
                    <input
                      type="number"
                      value={editFormData.numberOfPoints}
                      onChange={e =>
                        setEditFormData({ ...editFormData, numberOfPoints: e.target.value })
                      }
                      className="w-full p-2 border border-outlineGray rounded-md"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textGray mb-1">Quantity</label>
                    <input
                      type="number"
                      value={editFormData.quantity}
                      onChange={e => setEditFormData({ ...editFormData, quantity: e.target.value })}
                      className="w-full p-2 border border-outlineGray rounded-md"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={editFormData.shortDescription}
                    onChange={e =>
                      setEditFormData({ ...editFormData, shortDescription: e.target.value })
                    }
                    className="w-full p-2 border border-outlineGray rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-textGray mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={editFormData.fullDescription}
                    onChange={e =>
                      setEditFormData({ ...editFormData, fullDescription: e.target.value })
                    }
                    className="w-full p-2 border border-outlineGray rounded-md"
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditLoading}
                  className="flex-1 px-4 py-2 bg-primaryGreen text-white rounded-md"
                >
                  {isEditLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ...existing delete modal... */}
    </div>
  );
}

export default ProductsPage;
