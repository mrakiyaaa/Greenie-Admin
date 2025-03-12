import { Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

function ProductTable({ products, isLoading, error }) {
  const getStockStatus = quantity => {
    if (quantity === 0) return { status: 'Out of Stock', className: 'bg-red-100 text-red' };
    if (quantity <= 10) return { status: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', className: 'bg-green-100 text-green-800' };
  };

  const formatPrice = price => {
    return `LKR ${price.toLocaleString('en-LK')}`;
  };

  if (isLoading) return <div className="p-4 text-center">Loading products...</div>;
  if (error) return <div className="p-4 text-center text-red">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-outlineGray">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-textGray uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-outlineGray">
          {products.map(product => {
            const stockStatus = getStockStatus(product.quantity);
            return (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                  {product.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                  {product.numberOfPoints}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.className}`}
                  >
                    {stockStatus.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Edit size={18} />
                    </button>
                    <button className="text-red hover:text-red-800 p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default ProductTable;
