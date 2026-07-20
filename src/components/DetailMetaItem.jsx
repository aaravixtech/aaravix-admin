export default function DetailMetaItem({ icon: Icon, label, value, href }) {
  return (
    <div className="record-detail-meta-item">
      <div className="record-detail-meta-icon">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="record-detail-meta-label">{label}</p>
        {href ? (
          <a href={href} className="record-detail-meta-value">
            {value || '—'}
          </a>
        ) : (
          <p className="record-detail-meta-value">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}
