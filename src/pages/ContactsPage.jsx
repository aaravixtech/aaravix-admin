import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';
import { formatDate, truncate, stripTags } from '../utils/sanitize';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailMetaItem from '../components/DetailMetaItem';
import {
  Eye, Trash2, ChevronLeft, ChevronRight, AlertCircle,
  MessageSquare, RefreshCw, Mail, Calendar, Phone, User,
} from 'lucide-react';
import toast from 'react-hot-toast';

function MessageDetailPanel({ message, onClose }) {
  const name = stripTags(message.name);
  const email = stripTags(message.email);
  const phone = message.phone ? stripTags(message.phone) : null;
  const body = stripTags(message.message);

  return (
    <div className="message-detail">
      <div className="message-detail-sender">
        <div className="message-detail-avatar">
          {name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div className="message-detail-sender-info">
          <p className="message-detail-name">{name}</p>
          <p className="message-detail-email">{email}</p>
        </div>
      </div>

      <div className="message-detail-meta">
        <DetailMetaItem
          icon={Calendar}
          label="Received"
          value={formatDate(message.created_at)}
        />
        <DetailMetaItem
          icon={Mail}
          label="Email"
          value={email}
          href={`mailto:${email}`}
        />
        {phone && (
          <DetailMetaItem
            icon={Phone}
            label="Phone"
            value={phone}
            href={`tel:${phone.replace(/\s/g, '')}`}
          />
        )}
        <DetailMetaItem
          icon={User}
          label="From"
          value={name}
        />
      </div>

      <div className="message-detail-message">
        <p className="field-label">Message</p>
        <div className="message-detail-content">
          <p>{body || 'No message content.'}</p>
        </div>
      </div>

      <div className="message-detail-footer">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Close
        </button>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Re: Contact from ${name}`)}`}
          className="btn btn-primary"
        >
          <Mail className="h-4 w-4" />
          Reply via Email
        </a>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [data, setData] = useState({ messages: [], total: 0, page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await contactService.getAll(page, 12));
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contactService.delete(deleteTarget.id);
      toast.success('Message deleted');
      setDeleteTarget(null);
      fetchContacts();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <div className="page-header-icon bg-indigo-50 text-indigo-600">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="page-header-title">Contact Messages</h2>
            <p className="page-header-subtitle">
              {loading ? 'Loading…' : `${data.total} total messages`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchContacts}
          className="btn-icon"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="alert-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="message-card">
              <div className="skeleton mb-4 h-10 w-10 rounded-lg" />
              <div className="skeleton mb-2 h-4 w-3/4" />
              <div className="skeleton mb-4 h-3 w-1/2" />
              <div className="skeleton mt-auto h-16 w-full" />
            </div>
          ))}
        </div>
      ) : data.messages.length === 0 ? (
        <div className="ui-card empty-state">
          <div className="empty-state-icon">
            <MessageSquare className="h-7 w-7 text-[var(--text-muted)]" />
          </div>
          <p className="empty-state-title">No messages yet</p>
          <p className="empty-state-desc">Messages from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.messages.map((msg) => (
            <article key={msg.id} className="message-card">
              <div className="message-card-header flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--accent-light)] text-sm font-bold text-[var(--accent)]">
                  {stripTags(msg.name)?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                    {stripTags(msg.name)}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                    {stripTags(msg.email)}
                  </p>
                </div>
              </div>

              <div className="message-card-body">
                <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                  {truncate(stripTags(msg.message), 160)}
                </p>
              </div>

              {msg.phone && (
                <div className="message-card-phone">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {stripTags(msg.phone)}
                  </span>
                </div>
              )}

              <div className="message-card-footer">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  {formatDate(msg.created_at)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMsg(msg)}
                    title="View details"
                    className="btn-icon hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(msg)}
                    title="Delete"
                    className="btn-icon hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {data.total_pages > 1 && (
        <div className="ui-card flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          <p className="text-sm font-medium text-[var(--text-tertiary)]">
            Page <span className="font-semibold text-[var(--text-secondary)]">{data.page}</span> of {data.total_pages}
            <span className="mx-1.5 text-[var(--border)]">·</span>
            {data.total} messages
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="pagination-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
              disabled={page >= data.total_pages}
              className="pagination-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        title="Message Details"
        size="md"
        flushBody
      >
        {selectedMsg && (
          <MessageDetailPanel
            message={selectedMsg}
            onClose={() => setSelectedMsg(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
