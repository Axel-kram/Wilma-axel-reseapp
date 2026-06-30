-- ============================================================
-- Resedrömlista — Supabase schema + Row Level Security
-- Kör hela detta i Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

-- Tabell för destinationer
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  image_url text,
  status text not null default 'wishlist', -- 'wishlist' | 'planned' | 'visited'
  tags text[] default '{}',
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  visited_at timestamptz,
  priority int default 0
);

-- Slå på Row Level Security (utan detta är tabellen olåst)
alter table destinations enable row level security;

-- Policy: alla inloggade användare (oavsett vilket konto) får läsa allt
create policy "Inloggade kan läsa allt"
on destinations for select
to authenticated
using (true);

-- Policy: alla inloggade användare får skapa nya rader
create policy "Inloggade kan skapa"
on destinations for insert
to authenticated
with check (true);

-- Policy: alla inloggade användare får uppdatera alla rader
-- (ni är två som delar listan, ingen ska vara låst till bara sina egna poster)
create policy "Inloggade kan uppdatera"
on destinations for update
to authenticated
using (true)
with check (true);

-- Policy: alla inloggade användare får ta bort rader
create policy "Inloggade kan ta bort"
on destinations for delete
to authenticated
using (true);

-- ============================================================
-- Storage bucket för bilder
-- ============================================================

insert into storage.buckets (id, name, public)
values ('destination-images', 'destination-images', true)
on conflict (id) do nothing;

-- Policy: inloggade får ladda upp bilder
create policy "Inloggade kan ladda upp bilder"
on storage.objects for insert
to authenticated
with check (bucket_id = 'destination-images');

-- Policy: alla (även icke-inloggade) får visa bilder (publik bucket = enklare <img>-taggar)
create policy "Alla kan se bilder"
on storage.objects for select
using (bucket_id = 'destination-images');

-- Policy: inloggade får ta bort bilder
create policy "Inloggade kan ta bort bilder"
on storage.objects for delete
to authenticated
using (bucket_id = 'destination-images');

-- ============================================================
-- Klart! Gå vidare till Authentication -> Users och skapa era
-- två konton manuellt (se README.md steg 2).
-- ============================================================
