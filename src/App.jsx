import { useEffect, useState, useCallback } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Toolbar from './components/Toolbar'
import DestinationCard from './components/DestinationCard'
import DestinationForm from './components/DestinationForm'
import FloralCorner from './components/FloralCorner'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [formOpen, setFormOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState(null)

  // --- Auth ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // --- Hämta destinationer ---
  const fetchDestinations = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setDestinations(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (session) {
      fetchDestinations()
    }
  }, [session, fetchDestinations])

  async function handleToggleVisited(destination) {
    const newStatus = destination.status === 'visited' ? 'wishlist' : 'visited'
    const payload = { status: newStatus }
    if (newStatus === 'visited') {
      payload.visited_at = new Date().toISOString()
    }

    setDestinations((prev) =>
      prev.map((d) => (d.id === destination.id ? { ...d, ...payload } : d))
    )

    await supabase.from('destinations').update(payload).eq('id', destination.id)
  }

  async function handleDelete(destination) {
    if (!confirm(`Ta bort "${destination.title}"?`)) return

    setDestinations((prev) => prev.filter((d) => d.id !== destination.id))
    await supabase.from('destinations').delete().eq('id', destination.id)
  }

  function handleEdit(destination) {
    setEditingDestination(destination)
    setFormOpen(true)
  }

  function handleAddClick() {
    setEditingDestination(null)
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    setEditingDestination(null)
  }

  function handleFormSaved() {
    setFormOpen(false)
    setEditingDestination(null)
    fetchDestinations()
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  // --- Filtrering ---
  const filtered = destinations.filter((d) => {
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (authLoading) {
    return null
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="app-shell">
      <FloralCorner position="top-left" size={120} />

      <div className="app-header">
        <h1>🌸 Vår resedrömlista</h1>
        <button className="signout-btn" onClick={handleSignOut}>
          Logga ut
        </button>
      </div>

      <Toolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddClick={handleAddClick}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Laddar...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <p>
            {destinations.length === 0
              ? 'Inga platser ännu — lägg till er första dröm!'
              : 'Inga platser matchar din sökning/filter.'}
          </p>
        </div>
      ) : (
        <div className="destinations-grid">
          {filtered.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onToggleVisited={handleToggleVisited}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <DestinationForm
          initialData={editingDestination}
          onClose={handleFormClose}
          onSaved={handleFormSaved}
        />
      )}
    </div>
  )
}
