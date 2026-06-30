const STATUS_LABELS = {
  wishlist: 'Drömläge',
  planned: 'Planerad',
  visited: 'Avklarad',
}

export default function DestinationCard({ destination, onToggleVisited, onEdit, onDelete }) {
  const isVisited = destination.status === 'visited'

  return (
    <div className={`destination-card ${isVisited ? 'is-visited' : ''}`}>
      {destination.image_url ? (
        <img src={destination.image_url} alt={destination.title} className="card-image" />
      ) : (
        <div className="card-image-placeholder">🌍</div>
      )}

      <div className="card-body">
        <div className="card-title-row">
          <span className={`card-title ${isVisited ? 'is-visited' : ''}`}>{destination.title}</span>
          <span className={`status-badge status-${destination.status}`}>
            {STATUS_LABELS[destination.status] || destination.status}
          </span>
        </div>

        {destination.description && (
          <p className="card-description">{destination.description}</p>
        )}

        {destination.link && (
          <a href={destination.link} target="_blank" rel="noopener noreferrer" className="card-link">
            {destination.link}
          </a>
        )}

        {destination.tags && destination.tags.length > 0 && (
          <div className="card-tags">
            {destination.tags.map((tag) => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="card-actions">
          <button
            className={`card-action-btn ${isVisited ? 'is-active' : ''}`}
            onClick={() => onToggleVisited(destination)}
            title={isVisited ? 'Markera som ej avklarad' : 'Bocka av som avklarad'}
          >
            {isVisited ? '✓ Avklarad' : 'Bocka av'}
          </button>
          <button className="card-action-btn" onClick={() => onEdit(destination)} title="Redigera">
            Redigera
          </button>
          <button
            className="card-action-btn danger"
            onClick={() => onDelete(destination)}
            title="Ta bort"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>
  )
}
