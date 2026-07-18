'use client';
import { useEffect, useState } from 'react';
import { getInquiries, updateInquiry, deleteInquiry } from '@/lib/adminApi';
import { Phone, MessageSquare, Loader2, Check, Trash2, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import { useAdminStore } from '@/lib/adminStore';

// Design System components
import PageLayout from '@/design-system/layouts/PageLayout';
import PageHeader from '@/design-system/layouts/PageHeader';
import PageContent from '@/design-system/layouts/PageContent';
import Button from '@/design-system/components/Button';
import Badge from '@/design-system/components/Badge';
import Card from '@/design-system/components/Card';
import EmptyState from '@/design-system/components/EmptyState';
import Avatar from '@/design-system/components/Avatar';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useAdminStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = () => {
    setLoading(true);
    getInquiries()
      .then((data) => {
        setInquiries(data.inquiries || data || []);
      })
      .catch((err) => {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load customer enquiries.' });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateInquiry(id, { status: newStatus });
      addToast({ type: 'success', message: `Enquiry marked ${newStatus}.` });
      
      setInquiries((prev: any[]) => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
    } catch {
      addToast({ type: 'error', message: 'Failed to update enquiry status.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete enquiry from "${name}"?`)) return;
    try {
      await deleteInquiry(id);
      addToast({ type: 'success', message: 'Enquiry deleted successfully.' });
      if (expandedId === id) setExpandedId(null);
      fetchInquiries();
    } catch {
      addToast({ type: 'error', message: 'Failed to delete enquiry.' });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <PageLayout maxWidth="desktop">
      
      {/* Header title */}
      <PageHeader
        title="Enquiries"
        subtitle="Customer custom bridal fitting & styling requests"
      />

      {/* List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-[#C8851A]" size={28} />
          <p className="text-[12px] text-[#9B8E7E]">Loading enquiries...</p>
        </div>
      ) : inquiries.length > 0 ? (
        <PageContent>
          <div className="bg-white border border-[#E6C280]/15 rounded-[12px] overflow-hidden divide-y divide-[#FAF6F0] shadow-sm pb-16">
            {inquiries.map((inq) => {
              const isNew = inq.status === 'new';
              const isOpen = expandedId === inq._id;
              
              const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
              const formattedPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;
              const waLink = inq.phone
                ? `https://wa.me/${formattedPhone}?text=Hello%20${encodeURIComponent(inq.name)},%20thank%20you%20for%20reaching%20out%20to%20Sana%20Fashion.`
                : null;

              return (
                <div key={inq._id} className="transition-colors">
                  
                  {/* Row (WhatsApp Style) */}
                  <div
                    onClick={() => toggleExpand(inq._id)}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer active:bg-[#FAF6F0] transition-colors ${
                      isOpen ? 'bg-[#FAF6F0]/40' : ''
                    }`}
                  >
                    <Avatar name={inq.name} size="lg" />

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-[13px] font-bold text-[#1C1008] truncate font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                            {inq.name}
                          </h4>
                          {isNew && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8851A] flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[9px] text-[#9B8E7E] font-semibold whitespace-nowrap">
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <p className="text-[12px] font-bold text-[#6B5E4C] truncate">{inq.subject || 'Design Enquiry'}</p>
                      <p className="text-[11px] text-[#9B8E7E] truncate">{inq.message}</p>
                    </div>

                    <div className="text-gray-400 flex-shrink-0">
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="bg-[#FAF6F0]/30 px-4 pb-4 pt-1 space-y-4 animate-fade-in">
                      <Card className="space-y-3">
                        <div className="flex flex-col gap-0.5 text-[11px] text-[#9B8E7E] border-b border-[#E6C280]/10 pb-2">
                          <span>Email: {inq.email}</span>
                          {inq.phone && <span>Phone: {inq.phone}</span>}
                        </div>

                        <p className="text-[13px] text-[#6B5E4C] leading-relaxed break-words whitespace-pre-line">
                          {inq.message}
                        </p>

                        {inq.productInterest && (
                          <div className="text-[11px] font-semibold text-[#C8851A] pt-1.5 border-t border-[#E6C280]/10 flex items-center gap-1.5">
                            <span className="text-gray-400">Interested in:</span>
                            <span className="underline">{inq.productInterest.name || inq.productInterest}</span>
                          </div>
                        )}
                      </Card>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {inq.phone ? (
                            <a
                              href={`tel:${inq.phone}`}
                              className="w-full flex"
                            >
                              <Button variant="secondary" className="w-full" icon={<Phone size={13} />}>
                                Call Client
                              </Button>
                            </a>
                          ) : (
                            <Button variant="secondary" disabled className="w-full">
                              No Phone
                            </Button>
                          )}

                          {inq.phone && waLink ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex"
                            >
                              <Button variant="secondary" className="w-full" icon={<MessageSquare size={13} />}>
                                WhatsApp
                              </Button>
                            </a>
                          ) : (
                            <Button variant="secondary" disabled className="w-full">
                              No WhatsApp
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {isNew ? (
                            <Button
                              onClick={() => handleStatusUpdate(inq._id, 'resolved')}
                              variant="primary"
                              className="col-span-2"
                              icon={<Check size={12} strokeWidth={2.5} />}
                            >
                              Resolve
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleStatusUpdate(inq._id, 'new')}
                              variant="secondary"
                              className="col-span-2"
                            >
                              Mark Unread
                            </Button>
                          )}

                          <Button
                            onClick={() => handleDelete(inq._id, inq.name)}
                            variant="danger"
                            icon={<Trash2 size={12} />}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </PageContent>
      ) : (
        /* Empty State */
        <EmptyState
          icon={<Inbox size={28} />}
          title="All clear here"
          description="You have no client custom design or fitting inquiries at this time."
        />
      )}

    </PageLayout>
  );
}
