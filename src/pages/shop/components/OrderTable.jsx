import { Eye } from 'lucide-react';
import PropTypes from 'prop-types';

function OrderTable({ orders, formatDate, formatPrice, onView }) {
  return (
    <div className="min-w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-outlineGray">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Points Used
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-textGray uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-outlineGray">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">{order.orderId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                {order.shippingAddress.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                {formatPrice(order.totalAmount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                {order.pointsApplied}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(order)}
                  className="text-primaryGreen hover:text-green-600"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
  formatDate: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

export default OrderTable;
