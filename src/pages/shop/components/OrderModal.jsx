import { FileDown } from 'lucide-react';
import PropTypes from 'prop-types';

function OrderModal({ order, onClose, onExport, formatPrice, modalRef }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-textGray">Order Details</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={onExport}
              className="text-primaryGreen hover:text-green-600 flex items-center gap-2"
            >
              <FileDown size={18} />
              Export PDF
            </button>
            <button onClick={onClose} className="text-textGray hover:text-gray-700">
              ×
            </button>
          </div>
        </div>

        <div ref={modalRef} className="space-y-4 bg-white p-4">
          {/* Order Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
              <p className="text-textGray">{order.orderId}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="text-textGray">{order.status}</p>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
            {order.cartItems.map((item, index) => (
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

          {/* Totals Section */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subtotal</h4>
              <p className="text-textGray">{formatPrice(order.subtotal)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Points Applied</h4>
              <p className="text-textGray">{order.pointsApplied}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
              <p className="text-textGray font-bold">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="border-t border-outlineGray pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
            <p className="text-textGray">{order.shippingAddress.fullName}</p>
            <p className="text-textGray">{order.shippingAddress.phone}</p>
            <p className="text-textGray">{order.shippingAddress.addressLine1}</p>
            <p className="text-textGray">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-textGray">{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired,
  modalRef: PropTypes.object.isRequired,
};

export default OrderModal;
