import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import ProductTable from '../../components/shop/ProductTable';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-textGray">Products</h2>
            <button className="flex items-center gap-2 bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
              <Plus size={20} />
              Add Product
            </button>
          </div>

          <div className="bg-white rounded-lg border border-outlineGray overflow-hidden">
            <ProductTable products={products} isLoading={isLoading} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
