export default function Toolbar({ search, setSearch, statusFilter, setStatusFilter, onAddClick }) {
  return (
    <div className="toolbar">
      <input
        type="text"
        placeholder="Sök bland platser..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">Alla statusar</option>
        <option value="wishlist">Drömläge</option>
        <option value="planned">Planerad</option>
        <option value="visited">Avklarad</option>
      </select>

      <button className="add-btn" onClick={onAddClick}>
        + Lägg till plats
      </button>
    </div>
  )
}
