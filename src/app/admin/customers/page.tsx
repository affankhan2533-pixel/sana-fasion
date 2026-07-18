'use client';
import { useEffect, useState } from 'react';
import { getAdminCustomers, updateCustomer } from '@/lib/adminApi';
import { useAdminStore } from '@/lib/adminStore';
import { Loader2, Eye, Search, User, MapPin, Gift, Phone, Mail, FileText, X } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<any | null>(null);

  // Edit notes state
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    getAdminCustomers({ search: search.trim() || undefined })
      .then((res) => setCustomers(res.customers || []))
      .catch(() => addToast({ type: 'error', message: 'Failed to load customers.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const openProfile = (c: any) => {
    setSelectedCust(c);
    setNotes(c.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedCust) return;
    setSavingNotes(true);
    try {
      const updated = await updateCustomer(selectedCust._id, { notes });
      setSelectedCust(updated.customer);
      addToast({ type: 'success', message: 'Styling notes saved successfully!' });
      fetchCustomers();
    } catch {
      addToast({ type: 'error', message: 'Failed to update notes.' });
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Customer Profiles
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Manage custom fitting sizes, styling preferences, and consultation logs.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-[#E8E2D9] rounded-[16px] p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <form onSubmit={handleSearch} className="relative w-full md:w-96 flex">
          <input
            type="text"
            placeholder="Search by customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8E2D9] bg-white text-[13px] outline-none focus:border-[#C8851A] transition-colors"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B8E7E]" />
          <button type="submit" className="hidden" />
        </form>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-[#E8E2D9] rounded-[20px] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#C8851A]" />
            <p className="text-[13px] text-[#9B8E7E]">Retrieving client files...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] text-[11px] font-semibold tracking-wider text-[#6B5E4C] uppercase">
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Total Bookings</th>
                  <th className="py-4 px-6">Lifetime Value</th>
                  <th className="py-4 px-6">Last Active</th>
                  <th className="py-4 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] text-[13px] text-[#1C1008]">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-[#FCFBF9] transition-colors">
                    <td className="py-4 px-6 font-semibold flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[rgba(200,133,26,0.08)] text-[#C8851A] flex items-center justify-center font-bold">
                        {cust.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-[12.5px]">
                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-[#9B8E7E]" /> {cust.email}</span>
                        {cust.phone && <span className="flex items-center gap-1.5 mt-0.5"><Phone size={12} className="text-[#9B8E7E]" /> {cust.phone}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">{cust.totalOrders || 0} orders</td>
                    <td className="py-4 px-6 font-bold text-[#C8851A]">₹{(cust.totalSpend || 0).toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-[#9B8E7E]">
                      {new Date(cust.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openProfile(cust)}
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
            No client profiles saved. Profiles are automatically linked when orders or consultations are scheduled.
          </div>
        )}
      </div>

      {/* Profile Details Drawer */}
      {selectedCust && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white border-l border-[#E8E2D9] w-full max-w-lg h-full p-6 sm:p-8 flex flex-col shadow-2xl relative animate-slide-left overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-[#F0EDE8] pb-4 mb-6 flex-shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#C8851A] uppercase tracking-widest">Client File</span>
                <h3 className="text-[20px] font-bold text-[#1C1008] mt-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {selectedCust.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="p-1.5 hover:bg-gray-50 rounded-full cursor-pointer"
              >
                <X size={18} className="text-[#9B8E7E]" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 space-y-6">
              
              {/* Spend summaries */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 bg-[#FAFAF8]">
                  <span className="text-[10px] font-semibold text-[#9B8E7E] uppercase block">Lifetime Orders</span>
                  <span className="text-[20px] font-bold text-[#1C1008] mt-1 block">{selectedCust.totalOrders || 0}</span>
                </div>
                <div className="border rounded-xl p-4 bg-[#FAFAF8]">
                  <span className="text-[10px] font-semibold text-[#9B8E7E] uppercase block">Atelier Spend</span>
                  <span className="text-[20px] font-bold text-[#C8851A] mt-1 block">₹{(selectedCust.totalSpend || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Shipping Addresses */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Saved Addresses</h4>
                {selectedCust.addresses?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCust.addresses.map((addr: any, idx: number) => (
                      <div key={idx} className="border border-[#E8E2D9] rounded-xl p-3 bg-white text-[12.5px] flex gap-2">
                        <MapPin size={16} className="text-[#C8851A] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#1C1008]">{addr.isDefault && '(Default) '}{addr.line1}</p>
                          {addr.line2 && <p className="text-[#9B8E7E]">{addr.line2}</p>}
                          <p className="text-[#9B8E7E]">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12.5px] text-[#9B8E7E] italic">No saved delivery addresses.</p>
                )}
              </div>

              {/* Fitting & Styling Notes */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-[#6B5E4C] uppercase tracking-wider">Bridal & Styling Custom Preferences</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Fitting sizes (e.g. bust 34, waist 28), dupatta drape style, fabric allergies, and bridal preferences..."
                  rows={4}
                  className="w-full p-3.5 border border-[#E8E2D9] rounded-xl text-[12.5px] outline-none focus:border-[#C8851A] resize-y min-h-[100px]"
                />
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 bg-[#C8851A] hover:bg-[#B07414] text-white font-semibold text-[11.5px] tracking-wide rounded-lg cursor-pointer"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
