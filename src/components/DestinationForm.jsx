import { useState } from 'react'
import { supabase } from '../lib/supabase'

const emptyForm = {
  title: '',
  description: '',
  link: '',
  image_url: '',
  status: 'wishlist',
  tags: '',
}

export default function DestinationForm({ initialData, onClose, onSaved }) {
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState(() =>
    initialData
      ? {
          title: initialData.title || '',
          description: initialData.description || '',
          link: initialData.link || '',
          image_url: initialData.image_url || '',
          status: initialData.status || 'wishlist',
          tags: (initialData.tags || []).join(', '),
        }
      : emptyForm
  )

  const [imageMode, setImageMode] = useState('url') // 'url' | 'upload'
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadPreview, setUploadPreview] = useState(initialData?.image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    setUploadPreview(URL.createObjectURL(file))
  }

  async function uploadImageIfNeeded() {
    if (imageMode !== 'upload' || !uploadFile) {
      return form.image_url || null
    }

    const fileExt = uploadFile.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('destination-images')
      .upload(fileName, uploadFile)

    if (uploadError) {
      throw new Error('Bilduppladdning misslyckades: ' + uploadError.message)
    }

    const { data } = supabase.storage.from('destination-images').getPublicUrl(fileName)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const imageUrl = await uploadImageIfNeeded()

      const tagsArray = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        link: form.link.trim() || null,
        image_url: imageUrl,
        status: form.status,
        tags: tagsArray,
      }

      if (form.status === 'visited' && (!initialData || initialData.status !== 'visited')) {
        payload.visited_at = new Date().toISOString()
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('destinations')
          .update(payload)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { data: userData } = await supabase.auth.getUser()
        payload.created_by = userData?.user?.id

        const { error: insertError } = await supabase.from('destinations').insert(payload)

        if (insertError) throw insertError
      }

      onSaved()
    } catch (err) {
      setError(err.message || 'Något gick fel. Försök igen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h2>{isEdit ? 'Redigera plats' : 'Lägg till plats'}</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="form-field">
            <label htmlFor="title">Namn på platsen *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              placeholder="t.ex. Santorini, Grekland"
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Anteckning</label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Varför vill ni dit? Tips, datum-idéer..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="link">Länk</label>
            <input
              id="link"
              type="url"
              value={form.link}
              onChange={(e) => updateField('link', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-field">
            <label>Bild</label>
            <div className="image-input-toggle">
              <button
                type="button"
                className={imageMode === 'url' ? 'is-active' : ''}
                onClick={() => setImageMode('url')}
              >
                Via URL
              </button>
              <button
                type="button"
                className={imageMode === 'upload' ? 'is-active' : ''}
                onClick={() => setImageMode('upload')}
              >
                Ladda upp
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => updateField('image_url', e.target.value)}
                placeholder="https://exempel.com/bild.jpg"
              />
            ) : (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}

            {(uploadPreview || form.image_url) && (
              <img
                src={imageMode === 'upload' ? uploadPreview : form.image_url}
                alt="Förhandsvisning"
                className="image-preview"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
              >
                <option value="wishlist">Drömläge</option>
                <option value="planned">Planerad</option>
                <option value="visited">Avklarad</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="tags">Taggar (kommaseparerade)</label>
              <input
                id="tags"
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="strand, vandring, stad"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Sparar...' : 'Spara'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
