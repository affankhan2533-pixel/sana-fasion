'use client';
import { useEffect, useState } from 'react';
import { getAppointments, updateAppointment } from '@/lib/adminApi';
import {
  Calendar, Check, X, Phone, Mail, MessageSquare, AlertCircle, Loader2,
  CalendarDays, User, ExternalLink, Clock, FileText, UserCheck, RefreshCw
} from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  // Filters
  const [activeSegment, setActiveSegment] = useState('upcoming');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');

  const fetchAppointments = () => {
    setLoading(true);
    getAppointments()
      .then((data) => {
        setAppointments(data.appointments || data || []);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load appointments.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateAppointment(id, { status });
      addToast({ type: 'success', message: `Appointment status updated to ${status}.` });
      fetchAppointments();
    } catch {
      addToast({ type: 'error', message: 'Failed to update status.' });
    }
  };

  const handleAssignStaff = async (id: string) => {
    if (!staffName) return;
    try {
      await updateAppointment(id, { notes: `Assigned Stylist: ${staffName}` });
      addToast({ type: 'success', message: `Stylist ${staffName} assigned successfully!` });
      setAssigningId(null);
      setStaffName('');
      fetchAppointments();
    } catch {
      addToast({ type: 'error', message: 'Failed to assign staff.' });
    }
  };

  // WhatsApp confirmation text generator
  const getWhatsAppLink = (phone: string, name: string, date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
    const text = encodeURIComponent(
      `Hello ${name}, this is SANA Fashion Atelier. We are writing to confirm your consultation scheduled for ${formattedDate} at ${time}. Please let us know if this works for you.`
    );
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  };

  const segments = [
    { id: 'upcoming', label: 'Upcoming Consultations' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'all', label: 'All Bookings' },
  ];

  const filteredAppointments = appointments.filter((app) => {
    if (activeSegment === 'upcoming') return app.status === 'pending' || app.status === 'confirmed';
    if (activeSegment === 'completed') return app.status === 'completed';
    if (activeSegment === 'cancelled') return app.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6 p-4 md:p-10 max-w-full mx-auto animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D9] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1C1008]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Bridal & Styling Calendar
          </h1>
          <p className="text-[13px] text-[#9B8E7E] mt-0.5">
            Manage bespoke dress measurements, fittings, and design alignments.
          </p>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="flex overflow-x-auto border-b border-[#E8E2D9] pb-px scrollbar-none gap-2">
        {segments.map((seg) => (
          <button
            key={seg.id}
            onClick={() => setActiveSegment(seg.id)}
            className={`px-4 py-3 text-[13px] font-medium transition-all duration-200 border-b-2 whitespace-nowrap cursor-pointer ${
              activeSegment === seg.id
                ? 'border-[#C8851A] text-[#C8851A] font-semibold'
                : 'border-transparent text-[#9B8E7E] hover:text-[#1C1008]'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#C8851A]" size={32} />
          <p className="text-[13px] text-[#9B8E7E]">Retrieving consultations calendar...</p>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((app) => {
            const isPending = app.status === 'pending';
            const isConfirmed = app.status === 'confirmed';
            
            return (
              <div
                key={app._id}
                className="bg-white border border-[#E8E2D9] rounded-[20px] p-5 space-y-4 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)' }}
              >
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className={`badge-${app.status} uppercase tracking-wider text-[9px] px-2 py-0.5`}>
                        {app.status}
                      </span>
                      <h3 className="font-semibold text-[16px] text-[#1C1008] flex items-center gap-1.5 pt-1">
                        <User size={15} className="text-[#9B8E7E]" /> {app.name}
                      </h3>
                    </div>
                    
                    {/* Date Block */}
                    <div className="bg-[rgba(200,133,26,0.05)] text-[#C8851A] rounded-xl p-2 flex flex-col items-center justify-center min-w-[54px] border border-[rgba(200,133,26,0.1)]">
                      <span className="text-[14px] font-bold">
                        {new Date(app.date).getDate()}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-bold">
                        {new Date(app.date).toLocaleString('en-IN', { month: 'short' })}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-[13px] border-y border-[#F0EDE8] py-3 text-[#6B5E4C]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#9B8E7E]" />
                      <span className="font-medium">
                        {new Date(app.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#9B8E7E]" />
                      <span className="font-medium">{app.time}</span>
                    </div>
                    <div className="col-span-2 flex items-start gap-2 pt-1 border-t border-[#F5F3EF]">
                      <FileText size={14} className="text-[#9B8E7E] mt-0.5" />
                      <span className="font-semibold text-[#1C1008]">{app.serviceType}</span>
                    </div>
                  </div>

                  {/* Client Notes / Staff Assignments */}
                  {app.notes && (
                    <div className="p-3 bg-[#FAFAF8] border border-[#E8E2D9] rounded-lg text-[12px] text-[#6B5E4C] italic">
                      "{app.notes}"
                    </div>
                  )}

                  {/* Assign Staff Panel */}
                  {assigningId === app._id ? (
                    <div className="flex gap-2 animate-slide-up">
                      <input
                        type="text"
                        placeholder="Designer name..."
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="flex-1 h-9 px-3 rounded-lg border text-[12px] outline-none"
                      />
                      <button
                        onClick={() => handleAssignStaff(app._id)}
                        className="px-3 bg-[#C8851A] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => setAssigningId(null)}
                        className="px-3 border text-[11px] rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigningId(app._id)}
                      className="text-[11px] text-[#C8851A] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <UserCheck size={12} /> Assign Designer / Staff
                    </button>
                  )}
                </div>

                {/* Contacts & Status Triggers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5F3EF] mt-4">
                  <div className="flex gap-1.5">
                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppLink(app.phone, app.name, app.date, app.time)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 rounded-lg transition-colors cursor-pointer"
                      title="WhatsApp Customer"
                    >
                      <MessageSquare size={14} />
                    </a>

                    {/* Direct dial */}
                    <a
                      href={`tel:${app.phone}`}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                      title="Call Customer"
                    >
                      <Phone size={14} />
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${app.email}`}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                      title="Email Customer"
                    >
                      <Mail size={14} />
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'confirmed')}
                          className="btn-primary py-1.5 px-3 text-[12px] flex items-center gap-1 cursor-pointer"
                        >
                          <Check size={12} /> Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app._id, 'cancelled')}
                          className="btn-secondary py-1.5 px-3 text-[12px] text-red-600 hover:bg-red-50 border-red-200 hover:border-red-400 flex items-center gap-1 cursor-pointer"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </>
                    ) : isConfirmed ? (
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'completed')}
                        className="btn-secondary py-1.5 px-3 text-[12px] text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={12} /> Complete Consultation
                      </button>
                    ) : null}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-[#9B8E7E]">
          No consultation bookings in this category.
        </div>
      )}

    </div>
  );
}
