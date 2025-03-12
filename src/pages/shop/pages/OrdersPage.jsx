import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.ORDERS.GET_ALL);
      setOrders(data);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = amount => {
    return `LKR ${amount.toLocaleString('en-LK')}`;
  };

  if (isLoading) return <div className="p-4 text-center">Loading orders...</div>;
  if (error) return <div className="p-4 text-center text-red">{error}</div>;

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 w-full flex flex-col">
        <Header />
        <div className="flex-1 p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-textGray">Orders</h2>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                        {order.orderId}
                      </td>
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
                          ${
                            order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowViewModal(true);
                          }}
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
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-textGray">Order Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-textGray hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
                  <p className="text-textGray">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="text-textGray">{selectedOrder.status}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                {selectedOrder.cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-outlineGray py-2"
                  >
                    <div>
                      <p className="text-textGray">{item.productName}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-textGray">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Subtotal</h4>
                  <p className="text-textGray">{formatPrice(selectedOrder.subtotal)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Points Applied</h4>
                  <p className="text-textGray">{selectedOrder.pointsApplied}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                  <p className="text-textGray font-bold">
                    {formatPrice(selectedOrder.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border-t border-outlineGray pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                <p className="text-textGray">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-textGray">{selectedOrder.shippingAddress.phone}</p>
                <p className="text-textGray">{selectedOrder.shippingAddress.addressLine1}</p>
                <p className="text-textGray">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-textGray">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
