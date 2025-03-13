import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import OrderTable from '../components/OrderTable';
import OrderModal from '../components/OrderModal';
import { API_ENDPOINTS, apiRequest } from '../../../config/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const modalContentRef = useRef(null);

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

          <div className="bg-white rounded-lg overflow-hidden">
            <OrderTable
              orders={orders}
              formatDate={formatDate}
              formatPrice={formatPrice}
              onView={order => {
                setSelectedOrder(order);
                setShowViewModal(true);
              }}
            />
          </div>
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
