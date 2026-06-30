# 🌸 Vår resedrömlista

En privat webbapp för två personer att spara, planera och bocka av platser ni vill besöka tillsammans. Byggd med React + Supabase, hostas gratis på GitHub Pages.

Det här repot heter **Wilma-axel-reseapp** — alla instruktioner nedan utgår från det namnet. `vite.config.js` är redan inställd på rätt sökväg, så du behöver inte ändra något där om du inte byter repo-namn.

## Innehåll

1. [Skapa Supabase-projektet](#1-skapa-supabase-projektet)
2. [Skapa era 2 användarkonton](#2-skapa-era-2-användarkonton)
3. [Lägg in koden i GitHub-repot](#3-lägg-in-koden-i-github-repot)
4. [Lägg in hemligheter (secrets)](#4-lägg-in-hemligheter-secrets)
5. [Aktivera GitHub Pages](#5-aktivera-github-pages)
6. [Klart — testa appen](#6-klart--testa-appen)
7. [Köra lokalt (valfritt)](#7-köra-lokalt-valfritt)
8. [Vanliga problem](#8-vanliga-problem)

---

## 1. Skapa Supabase-projektet

1. Gå till [supabase.com](https://supabase.com) → skapa konto (gratis, t.ex. med GitHub-login).
2. Klicka **New project**.
   - Namn: t.ex. `resedromlista`
   - Databaslösenord: välj ett starkt lösenord, spara det någonstans
   - Region: välj närmast er (t.ex. Frankfurt/EU)
3. Vänta ~2 minuter medan projektet skapas.
4. Gå till **SQL Editor** (vänstermenyn) → **New query**.
5. Öppna filen `supabase-schema.sql` (finns i detta repo), kopiera hela innehållet, klistra in i SQL Editor.
6. Klicka **Run**. Du ska se "Success. No rows returned".

Detta skapar tabellen, säkerhetsreglerna (RLS) och bild-storage i ett enda steg.

## 2. Skapa era 2 användarkonton

1. Gå till **Authentication → Users** (vänstermenyn).
2. Klicka **Add user → Create new user**.
3. Fyll i din e-post + ett lösenord. **Viktigt:** bocka i "Auto Confirm User" så ni slipper mejlverifiering.
4. Klicka **Create user**.
5. Upprepa för din flickväns e-post + lösenord.

Nu finns exakt två konton som kan logga in — det finns ingen "registrera dig"-funktion i appen, så ingen annan kan skapa ett konto själv.

## 3. Lägg in koden i GitHub-repot

Du har redan repot **Wilma-axel-reseapp** skapat. Enklaste sättet att få in alla filer från denna zip utan terminal:

1. Packa upp zip-filen du laddade ner från Claude på din dator.
2. Gå till ditt repo på GitHub: `github.com/Axel-kram/Wilma-axel-reseapp`
3. Klicka på länken **"uploading an existing file"** (syns på repots startsida när det är tomt).
4. Öppna den uppackade mappen i din filhanterare, markera **alla filer och mappar** (inklusive den dolda mappen `.github` — på Mac visar du dolda filer med `Cmd+Shift+.`, på Windows under Visa → Dolda filer).
5. Dra in alltihop i GitHub:s uppladdningsruta.
6. Scrolla ner, skriv ett commit-meddelande t.ex. "Första versionen", klicka **Commit changes**.

> **Obs om `.github`-mappen:** GitHub:s dra-och-släpp-uppladdning hanterar ibland inte dolda mappar (`.github`, `.gitignore`) korrekt om din OS-filhanterare döljer dem. Om `.github/workflows/deploy.yml` inte dyker upp i repot efter uppladdningen, skapa filen manuellt istället: klicka **Add file → Create new file** i repot, skriv sökvägen `.github/workflows/deploy.yml` i filnamnsfältet (GitHub skapar mapparna automatiskt), klistra in innehållet från `deploy.yml`, och committa.

Alternativ om du senare vill jobba med terminal/Git istället (valfritt, inte nödvändigt):

```bash
git init
git add .
git commit -m "Första versionen av resedrömlistan"
git branch -M main
git remote add origin https://github.com/Axel-kram/Wilma-axel-reseapp.git
git push -u origin main
```

## 4. Lägg in hemligheter (secrets)

Appen behöver veta vilket Supabase-projekt den ska prata med, utan att hemligheterna ligger synliga i koden.

1. I Supabase: gå till **Settings → API**.
2. Kopiera **Project URL** (ser ut som `https://xxxxx.supabase.co`).
3. Kopiera **anon public key** (lång textsträng under "Project API keys").
4. I ditt GitHub-repo: gå till **Settings → Secrets and variables → Actions**.
5. Klicka **New repository secret**:
   - Name: `VITE_SUPABASE_URL`
   - Value: klistra in Project URL
   - Spara
6. Klicka **New repository secret** igen:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: klistra in anon public key
   - Spara

## 5. Aktivera GitHub Pages

1. I repot: **Settings → Pages** (vänstermenyn).
2. Under **Build and deployment → Source**, välj **GitHub Actions**.

Klart — ingen mer konfiguration behövs här. Workflowen (`.github/workflows/deploy.yml`) körs nu automatiskt varje gång ni pushar/laddar upp filer till `main`, bygger appen, och publicerar den.

## 6. Klart — testa appen

1. Gå till **Actions**-fliken i repot, vänta tills den gröna bocken visas (1-2 minuter).
2. Gå till **Settings → Pages**, du ser en länk högst upp typ `https://axel-kram.github.io/Wilma-axel-reseapp/`.
3. Öppna länken, logga in med ett av de två kontona ni skapade i steg 2.
4. Lägg till er första plats! 🌸

Spara länken som bokmärke eller hemskärms-genväg på mobilen — så har ni snabb åtkomst.

## 7. Köra lokalt (valfritt)

Om du vill testa ändringar på din egen dator innan du laddar upp:

```bash
npm install
cp .env.example .env
# öppna .env och fyll i dina riktiga Supabase-värden
npm run dev
```

Appen körs då på `http://localhost:5173`.

## 8. Vanliga problem

**"Saknar Supabase-konfiguration" i konsolen**
Du har glömt secrets i steg 4, eller stavat namnen fel. De måste heta exakt `VITE_SUPABASE_URL` och `VITE_SUPABASE_ANON_KEY`.

**Sidan laddar men visar bara vit skärm / 404 på GitHub Pages**
`base`-värdet i `vite.config.js` matchar troligen inte repo-namnet. Det är redan satt till `/Wilma-axel-reseapp/` — dubbelkolla att ditt repo faktiskt heter exakt det (skiftlägeskänsligt).

**Kan inte logga in**
Kontrollera att du bockade i "Auto Confirm User" när du skapade kontot i Supabase (steg 2). Annars väntar kontot på mejlverifiering som aldrig skickas.

**Bilder laddas inte upp**
Kontrollera i Supabase → Storage att bucketen `destination-images` finns. Om SQL-scriptet av någon anledning inte skapade den automatiskt: Storage → New bucket → namn `destination-images` → Public bucket: på.

**`.github`-mappen syns inte i repot efter uppladdning**
Se noteringen i steg 3 — skapa `deploy.yml` manuellt via "Create new file" istället.

**Appen känns långsam första gången på dagen**
Supabase free tier pausar projektet efter 7 dagars total inaktivitet. Första laddningen efter en paus tar några extra sekunder medan projektet vaknar — sen är allt normalt igen.

**Vill byta lösenord**
Supabase → Authentication → Users → klicka på användaren → sätt nytt lösenord manuellt där.

---

## Teknisk översikt

- **Frontend:** React + Vite, statiska filer hostade på GitHub Pages
- **Databas:** Supabase (Postgres) med Row Level Security — endast inloggade användare (era 2 konton) kan läsa/skriva data
- **Bildlagring:** Supabase Storage
- **Auth:** Supabase Auth (e-post + lösenord), inga publika registreringar möjliga
- **Deploy:** GitHub Actions bygger och publicerar automatiskt vid varje push/uppladdning till `main`

All kostnad: 0 kr/månad inom ramarna för free tier hos både GitHub och Supabase.
