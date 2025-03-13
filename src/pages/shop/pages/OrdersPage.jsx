import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import OrderTable from '../components/OrderTable';
import OrderModal from '../components/OrderModal';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';
import { Search } from 'lucide-react';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const modalContentRef = useRef(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    date: '',
  });

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

  const exportToPDF = async () => {
    if (!modalContentRef.current) return;

    try {
      const canvas = await html2canvas(modalContentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let first = true;

      while (heightLeft >= 0) {
        if (!first) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        first = false;
      }

      pdf.save(`order-${selectedOrder.orderId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  const filterOrders = () => {
    return orders.filter(order => {
      const searchMatch =
        order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(filters.search.toLowerCase());

      const statusMatch = filters.status === 'ALL' || order.status === filters.status;

      const dateMatch =
        !filters.date ||
        new Date(order.createdAt).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString();

      return searchMatch && statusMatch && dateMatch;
    });
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

          {/* Filters Section */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full p-2 pr-8 border border-outlineGray rounded-md"
              />
              <Search className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border border-outlineGray rounded-md"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
              className="w-full p-2 border border-outlineGray rounded-md"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-outlineGray overflow-hidden">
            <OrderTable
              orders={filterOrders()}
              formatDate={formatDate}
              formatPrice={formatPrice}
              onView={order => {
                setSelectedOrder(order);
                setShowViewModal(true);
              }}
            />
          </div>

          {filterOrders().length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No orders found matching the filters
            </div>
          )}
        </div>
      </div>

      {showViewModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setShowViewModal(false)}
          onExport={exportToPDF}
          formatPrice={formatPrice}
          modalRef={modalContentRef}
        />
      )}
    </div>
  );
}

export default OrdersPage;
