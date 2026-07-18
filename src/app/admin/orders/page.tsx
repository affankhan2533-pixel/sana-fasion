'use client';
import { useEffect, useState } from 'react';
import { getAdminOrders, updateOrder } from '@/lib/adminApi';
import { useAdminStore } from '@/lib/adminStore';
import { Loader2, Eye, Search, CreditCard, Truck, RefreshCw, ShoppingBag, X, Check, Printer, FileText } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  const [search, setSearch] = useState('');
  const [payStatus, setPayStatus] = useState('');
  const [shipStatus, setShipStatus] = useState('');

  // Selected Order for detail view / actions
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAdminOrders({
      search: search.trim() || undefined,
      paymentStatus: payStatus || undefined,
      shippingStatus: shipStatus || undefined,
    })
      .then((res) => setOrders(res.orders || []))
      .catch(() => addToast({ type: 'error', message: 'Failed to load orders.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [payStatus, shipStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openDetails = (ord: any) => {
    setSelectedOrder(ord);
    setTrackingNumber(ord.trackingNumber || '');
  };

  const handleUpdateStatus = async (field: 'paymentStatus' | 'shippingStatus', value: string) => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await updateOrder(selectedOrder._id, { [field]: value });
      setSelectedOrder(updated.order);
      addToast({ type: 'success', message: `Order ${field} updated to ${value}.` });
      fetchOrders();
    } catch {
      addToast({ type: 'error', message: 'Failed to update order.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const updated = await updateOrder(selectedOrder._id, {
        trackingNumber,
        shippingStatus: 'shipped', // Automatically mark shipped when tracking is added
      });
      setSelectedOrder(updated.order);
      addToast({ type: 'success', message: 'Tracking details saved successfully!' });
      fetchOrders();
    } catch {
      addToast({ type: 'error', message: 'Failed to save tracking number.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    if (!confirm('Are you sure you want to refund this order?')) return;
    setUpdating(true);
    try {
      const updated = await updateOrder(selectedOrder._id, { paymentStatus: 'refunded' });
      setSelectedOrder(updated.order);
      addToast({ type: 'success', message: 'Order marked as refunded.' });
      fetchOrders();
    } catch {
      addToast({ type: 'error', message: 'Failed to process refund.' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Atelier Orders
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Process custom couture orders, manage dispatch status, and process styling deposits.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E8E2D9] rounded-[16px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <form onSubmit={handleSearch} className="relative w-full md:w-96 flex">
          <input
            type="text"
            placeholder="Search by order number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E2D9] bg-white text-[13px] outline-none focus:border-[#C8851A] transition-colors"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8E7E]" />
          <button type="submit" className="hidden" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={payStatus}
            onChange={(e) => setPayStatus(e.target.value)}
            className="h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] bg-white text-[#1C1008] outline-none focus:border-[#C8851A]"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={shipStatus}
            onChange={(e) => setShipStatus(e.target.value)}
            className="h-11 px-3.5 rounded-xl border border-[#E8E2D9] text-[13px] bg-white text-[#1C1008] outline-none focus:border-[#C8851A]"
          >
            <option value="">All Shipping</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button onClick={fetchOrders} className="h-11 w-11 flex items-center justify-center rounded-xl border border-[#E8E2D9] hover:bg-gray-50 text-[#6B5E4C] cursor-pointer">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8E2D9] rounded-[20px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#C8851A]" />
            <p className="text-[13px] text-[#9B8E7E]">Retrieving order register...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-semibold tracking-wider text-[#6B5E4C] uppercase">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Shipping</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] text-[13px] text-[#1C1008]">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FCFBF9] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#C8851A]">{ord.orderNumber}</td>
                    <td className="py-4 px-6 text-[#9B8E7E]">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      <div className="flex flex-col">
                        <span>{ord.customer?.name}</span>
                        <span className="text-[11px] text-[#9B8E7E] mt-0.5">{ord.customer?.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold">{ord.items?.length || 0} items</span>
                    </td>
                    <td className="py-4 px-6 font-bold">₹{ord.total?.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold ${
                        ord.paymentStatus === 'paid' ? 'text-emerald-600' : ord.paymentStatus === 'refunded' ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ord.paymentStatus === 'paid' ? 'bg-emerald-500' : ord.paymentStatus === 'refunded' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge-${ord.shippingStatus}`}>
                        {ord.shippingStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openDetails(ord)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[#C8851A] cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-[#9B8E7E]">
            No customer orders recorded. Click the **First Time Setup** button to generate pre-filled sales logs.
          </div>
        )}
      </div>

      {/* 📝 Order Details Side-Drawer/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white border-l border-[#E8E2D9] w-full max-w-lg h-full p-6 sm:p-8 flex flex-col shadow-2xl relative animate-slide-left overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#F0EDE8] pb-4 mb-6 flex-shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#C8851A] uppercase tracking-widest">Order Details</span>
                <h3 className="text-[20px] font-bold text-[#1C1008] mt-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-gray-50 rounded-full cursor-pointer"
              >
                <X size={18} className="text-[#9B8E7E]" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 space-y-6">
              
              {/* Customer Profile Card */}
              <div className="border border-[#E8E2D9] rounded-xl p-4 space-y-2 bg-[#FAFAF8]">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Customer Profile</h4>
                <p className="text-[13px] font-semibold text-[#1C1008]">{selectedOrder.customer?.name}</p>
                <p className="text-[12px] text-[#9B8E7E]">{selectedOrder.customer?.email} • {selectedOrder.customer?.phone || 'No phone'}</p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Garments Purchased</h4>
                <div className="border border-[#E8E2D9] rounded-xl overflow-hidden divide-y divide-[#F0EDE8]">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white flex justify-between items-center text-[13px]">
                      <div>
                        <p className="font-semibold text-[#1C1008]">{item.productName}</p>
                        <p className="text-[11px] text-[#9B8E7E] mt-0.5">Qty: {item.quantity} • Price: ₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Operational Status Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#9B8E7E] mb-1 font-semibold uppercase">Payment</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdateStatus('paymentStatus', e.target.value)}
                      disabled={updating}
                      className="w-full h-10 px-3 rounded-lg border border-[#E8E2D9] text-[12px] bg-white text-[#1C1008]"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#9B8E7E] mb-1 font-semibold uppercase">Shipping</label>
                    <select
                      value={selectedOrder.shippingStatus}
                      onChange={(e) => handleUpdateStatus('shippingStatus', e.target.value)}
                      disabled={updating}
                      className="w-full h-10 px-3 rounded-lg border border-[#E8E2D9] text-[12px] bg-white text-[#1C1008]"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tracking input */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Logistics Dispatch (Tracking)</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter Bluedart/DHL tracking URL or ID..."
                    className="flex-1 h-10 px-3 rounded-lg border border-[#E8E2D9] text-[12px] outline-none"
                  />
                  <button
                    onClick={handleUpdateTracking}
                    disabled={updating}
                    className="px-4 bg-[#C8851A] hover:bg-[#B07414] text-white font-semibold text-[12px] rounded-lg cursor-pointer"
                  >
                    Save Tracking
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[#F0EDE8] pt-4 space-y-2 text-[13px]">
                <div className="flex justify-between text-[#9B8E7E]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#1C1008] font-bold text-[15px] pt-1">
                  <span>Grand Total</span>
                  <span>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Print Invoice & Refund Actions */}
            <div className="border-t border-[#F0EDE8] pt-4 mt-6 grid grid-cols-2 gap-3 flex-shrink-0">
              <button
                onClick={handleRefund}
                disabled={updating || selectedOrder.paymentStatus === 'refunded'}
                className="w-full h-11 border border-red-200 text-red-600 rounded-xl text-[12.5px] font-semibold hover:bg-red-50 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={14} /> Process Refund
              </button>
              <button
                onClick={() => window.print()}
                className="w-full h-11 border border-[#C8851A] text-[#C8851A] rounded-xl text-[12.5px] font-semibold hover:bg-[rgba(200,133,26,0.05)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Print Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
