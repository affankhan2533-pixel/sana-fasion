'use client';
import { useEffect, useState } from 'react';
import { getInquiries, updateInquiry } from '@/lib/adminApi';
import { Mail, Phone, MessageSquare, AlertCircle, Loader2, Check, User, Calendar } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();

  const fetchInquiries = () => {
    setLoading(true);
    getInquiries()
      .then((data) => {
        setInquiries(data.inquiries || data || []);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load inquiries.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'in_progress' | 'resolved') => {
    try {
      await updateInquiry(id, { status });
      addToast({ type: 'success', message: `Inquiry marked as ${status}.` });
      fetchInquiries();
    } catch {
      addToast({ type: 'error', message: 'Failed to update status.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Enquiries</h1>
          <p className="page-subtitle">Refine and reply to customer custom bridal and dress requests.</p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin text-[#C8851A] mx-auto mb-3" size={24} />
          <p className="text-[13px] text-[#9B8E7E]">Fetching enquiries...</p>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const isNew = inq.status === 'new';
            const isInProgress = inq.status === 'in_progress';
            return (
              <div
                key={inq._id}
                className="admin-card p-5 space-y-3 hover:shadow-card-hover transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`badge-${inq.status} uppercase tracking-wider text-[9px]`}>
                      {inq.status}
                    </span>
                    <h3 className="font-semibold text-[15px] text-[#1C1008] mt-1">{inq.subject}</h3>
                    <p className="text-[11px] text-[#9B8E7E] mt-0.5 flex items-center gap-1">
                      <User size={12} /> {inq.name} ({inq.email})
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-[#9B8E7E] flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                <div className="text-[13px] text-[#6B5E4C] leading-relaxed border-t border-[#F0EDE8] pt-3 pb-1">
                  {inq.message}
                </div>

                {inq.productInterest && (
                  <p className="text-[11px] text-[#C8851A] font-semibold">
                    Product reference interest: {inq.productInterest}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}
                      className="btn-secondary py-1 px-3 text-[11px] flex items-center gap-1"
                    >
                      <Mail size={12} /> Email Reply
                    </a>
                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="btn-secondary py-1 px-3 text-[11px] flex items-center gap-1"
                      >
                        <Phone size={12} /> Call Customer
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isNew && (
                      <button
                        onClick={() => handleStatusUpdate(inq._id, 'in_progress')}
                        className="btn-primary py-1 px-3 text-[11px]"
                      >
                        Mark In Progress
                      </button>
                    )}
                    {(isNew || isInProgress) && (
                      <button
                        onClick={() => handleStatusUpdate(inq._id, 'resolved')}
                        className="btn-secondary py-1 px-3 text-[11px] text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Check size={11} /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <AlertCircle className="text-gray-300 mx-auto mb-3" size={32} />
          <p className="text-[13px] text-[#9B8E7E]">No customer enquiries found.</p>
        </div>
      )}
    </div>
  );
}
