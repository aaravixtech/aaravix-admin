import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '../services/applicationService';
import { formatDate, truncate, stripTags } from '../utils/sanitize';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DetailMetaItem from '../components/DetailMetaItem';
import {
  Eye, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  Briefcase, RefreshCw, CheckCircle, XCircle, FileText, Filter,
  Mail, Calendar, User,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS = {
  pending:  { badge: 'badge badge-pending',  dot: 'badge-dot bg-amber-500',  label: 'Pending'  },
  approved: { badge: 'badge badge-approved', dot: 'badge-dot bg-emerald-500', label: 'Approved' },
  rejected: { badge: 'badge badge-rejected', dot: 'badge-dot bg-red-500',    label: 'Rejected' },
};
const getStatus = (s) => STATUS[s] || STATUS.pending;

const selectChevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

function ApplicationDetailPanel({ application, onClose, onStatusUpdate, updatingStatus }) {
  const firstName = stripTags(application.first_name);
  const lastName = stripTags(application.last_name);
  const fullName = `${firstName} ${lastName}`.trim();
  const email = stripTags(application.email);
  const skills = stripTags(application.skills);
  const status = getStatus(application.status);
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';

  return (
    <div className="application-detail">
      <div className="application-detail-header">
        <div className="record-detail-avatar">{initials}</div>
        <div className="record-detail-header-info">
          <p className="record-detail-title">{fullName || 'Applicant'}</p>
          <p className="record-detail-subtitle">{email}</p>
        </div>
        <span className={status.badge}>
          <span className={status.dot} />
          {status.label}
        </span>
      </div>

      <div className="record-detail-meta">
        <DetailMetaItem
          icon={Mail}
          label="Email"
          value={email}
          href={`mailto:${email}`}
        />
        <DetailMetaItem
          icon={Calendar}
          label="Applied on"
          value={formatDate(application.created_at)}
        />
        <DetailMetaItem icon={User} label="First name" value={firstName} />
        <DetailMetaItem icon={User} label="Last name" value={lastName} />
      </div>

      <div className="record-detail-section">
        <p className="field-label">Skills & experience</p>
        <div className="record-detail-content">
          <p>{skills || 'No skills listed.'}</p>
        </div>
      </div>

      {application.resume_path && (
        <div className="record-detail-section">
          <p className="field-label">Resume</p>
          <a
            href={application.resume_path}
            target="_blank"
            rel="noopener noreferrer"
            className="record-detail-resume"
          >
            <FileText className="h-4 w-4" />
            Download resume
          </a>
        </div>
      )}

      <div className="application-detail-footer">
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Close
        </button>
        <div className="application-detail-footer-actions">
          {application.status !== 'approved' && (
            <button
              type="button"
              onClick={() => onStatusUpdate(application.id, 'approved')}
              disabled={updatingStatus === application.id}
              className="btn btn-success"
            >
              {updatingStatus === application.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Approve
            </button>
          )}
          {application.status !== 'rejected' && (
            <button
              type="button"
              onClick={() => onStatusUpdate(application.id, 'rejected')}
              disabled={updatingStatus === application.id}
              className="btn btn-danger"
            >
              {updatingStatus === application.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [data, setData] = useState({ applications: [], total: 0, page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await applicationService.getAll(page, 15, filter || null));
    } catch {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      await applicationService.updateStatus(id, newStatus);
      toast.success(`Application ${newStatus}`);
      setSelectedApp(null);
      fetchApplications();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await applicationService.delete(deleteTarget.id);
      toast.success('Application deleted');
      setDeleteTarget(null);
      fetchApplications();
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
          <div className="page-header-icon bg-[var(--accent-light)] text-[var(--accent)]">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="page-header-title">Job Applications</h2>
            <p className="page-header-subtitle">
              {loading ? 'Loading…' : `${data.total} total submissions`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="select-field min-w-[140px]"
              style={{
                backgroundImage: selectChevron,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            type="button"
            onClick={fetchApplications}
            className="btn-icon"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="table-shell">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden md:table-cell">Email</th>
                <th className="hidden lg:table-cell">Skills</th>
                <th>Status</th>
                <th className="hidden sm:table-cell">Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((__, j) => (
                      <td
                        key={j}
                        className={`${j === 1 ? 'hidden md:table-cell' : ''} ${j === 2 ? 'hidden lg:table-cell' : ''} ${j === 4 ? 'hidden sm:table-cell' : ''}`}
                      >
                        <div className="skeleton h-4 max-w-[120px]" />
                      </td>
                    ))}
                  </tr>
                ))
                : data.applications.length === 0
                ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <Briefcase className="h-7 w-7 text-[var(--text-muted)]" />
                        </div>
                        <p className="empty-state-title">No applications found</p>
                        <p className="empty-state-desc">Try changing the filter or check back later.</p>
                      </div>
                    </td>
                  </tr>
                )
                : data.applications.map((app) => {
                  const s = getStatus(app.status);
                  return (
                    <tr key={app.id}>
                      <td>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {stripTags(app.first_name)} {stripTags(app.last_name)}
                        </p>
                      </td>
                      <td className="hidden md:table-cell">{stripTags(app.email)}</td>
                      <td className="hidden lg:table-cell">{truncate(stripTags(app.skills), 32)}</td>
                      <td>
                        <span className={s.badge}>
                          <span className={s.dot} />
                          {s.label}
                        </span>
                      </td>
                      <td className="hidden text-xs font-medium text-[var(--text-muted)] sm:table-cell">
                        {formatDate(app.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            title="View details"
                            className="btn-icon hover:border-blue-200 hover:bg-blue-50 hover:text-[var(--accent)]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(app)}
                            title="Delete"
                            className="btn-icon hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        {data.total_pages > 1 && (
          <div className="table-footer">
            <p className="text-sm font-medium text-[var(--text-tertiary)]">
              Page <span className="font-semibold text-[var(--text-secondary)]">{data.page}</span> of {data.total_pages}
              <span className="mx-1.5 text-[var(--border)]">·</span>
              {data.total} results
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
      </div>

      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        size="md"
        flushBody
      >
        {selectedApp && (
          <ApplicationDetailPanel
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusUpdate={handleStatusUpdate}
            updatingStatus={updatingStatus}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Application"
        message={`Delete application from "${deleteTarget?.first_name} ${deleteTarget?.last_name}"? This cannot be undone.`}
      />
    </div>
  );
}
