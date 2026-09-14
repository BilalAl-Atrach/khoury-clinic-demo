# Connecting Khoury Clinic Demo to Supabase

## Where things stand today

The demo runs **entirely on an in-memory store** (`lib/store/demo-store.ts`, Zustand) seeded
from `lib/data/seed.ts`. That's intentional — it means the demo works instantly for anyone,
with zero setup, zero API keys, and no risk of hitting an empty/misconfigured database mid-pitch.

Nothing in the UI talks to Supabase yet. The `@supabase/supabase-js` client, the database
schema, and the seed data are already prepared (see below) so that wiring up a real backend
later is a mechanical, table-by-table job — not a redesign.

You only need to follow this guide when you're ready to move from **sales demo** to a
**real, persistent product** for an actual clinic.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick a name (e.g. `khoury-clinic` or the real clinic's name), a strong database password, and a region close to your users (e.g. an EU region for lowest latency to Lebanon).
3. Wait for provisioning to finish (~2 minutes).

## 2. Get your API keys

In **Project Settings → API**, copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ server-only secret — never expose this in client code or commit it)

Copy `.env.example` to `.env.local` in the project root and fill these in:

```bash
cp .env.example .env.local
```

## 3. Create the schema

Open the Supabase dashboard → **SQL Editor** → paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) → **Run**.

This creates all tables with foreign keys, indexes, an `updated_at` trigger on
`appointments`, and Row Level Security policies. Tables created:

`clinics`, `doctors`, `services`, `patients`, `appointments`, `appointment_events`,
`follow_ups`, `messages`, `automation_rules`, `testimonials`, `gallery_items`, `website_settings`.

Alternatively, with the [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project:

```bash
supabase db push
```

## 4. Seed fictional demo data (optional but recommended)

Run [`supabase/seed.sql`](supabase/seed.sql) the same way (SQL Editor → Run), *after* the
schema. It inserts the same fictional doctor, clinic, 10 services, 10 patients, 21
appointments, 10 follow-ups, testimonials, gallery items, and automation rules that
`lib/data/seed.ts` uses — so the database and the current UI show identical data while
you migrate.

> Re-running `seed.sql` inserts duplicates. If you need to re-seed, truncate the tables first
> (`truncate clinics restart identity cascade;` truncates everything via cascading FKs).

## 5. Verify Row Level Security (RLS)

`schema.sql` enables RLS on every table and adds a starting policy set:

- **Public (anon) read access** to `clinics`, `doctors`, `services`, `testimonials`,
  `gallery_items`, `website_settings` — this is what powers the public marketing site.
- **Public (anon) insert access** to `patients` and `appointments` — this is what lets the
  `/book` flow create a booking without requiring the patient to log in.
- **Authenticated-only access** to everything else (reading/updating appointments, patients,
  follow-ups, messages, automation rules, settings) — this is what the dashboard needs.

This is a reasonable starting point, **not a finished security model**. Before going live:

- Decide how staff will authenticate (see step 7) and confirm the `auth.role() = 'authenticated'`
  policies match that model.
- Consider scoping every policy to a specific `clinic_id` once you support more than one clinic.
- Review the [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 6. Wire the app to Supabase

The store's public API (`useDemoStore` in `lib/store/demo-store.ts`) is the seam to cut along.
Every screen calls store actions like `bookAppointment`, `cancelAppointment`,
`rescheduleAppointment`, `completeAppointment`, `sendWhatsApp`, `markFollowUpCompleted`,
`telegramSend`, etc. None of the components talk to data directly.

Recommended migration order (each step ships independently and keeps the demo working):

1. **Services** — replace `lib/data/seed.ts`'s `services` export with a fetch from
   `supabase.from('services').select('*')` (Server Component or a small data-fetching hook).
   Lowest risk: read-only, public data.
2. **Appointments read path** — replace `appointments` in the store with data loaded from
   Supabase, keeping the write actions (`bookAppointment`, etc.) as local mutations for now.
3. **Appointments write path** — swap each store action's local `set(...)` call for a
   Supabase `insert`/`update`, e.g.:

   ```ts
   // lib/store/demo-store.ts — bookAppointment, sketch
   const { data, error } = await getSupabaseClient()
     .from("appointments")
     .insert({ clinic_id, patient_id, service_id, date, time, status: "confirmed", source: "website" })
     .select()
     .single();
   ```

   Keep `whatsappTemplates`/`telegramResponses` exactly as they are — they're pure functions
   that only need appointment data, not a specific storage backend.
4. **Patients, follow-ups, messages, automation rules, website settings** — same pattern.
5. Once every store action reads/writes Supabase, delete the local seed fallback.

Because every screen only ever calls the store's actions (never raw data), this can be done
one table at a time without touching `app/` or `components/`.

## 7. Replace the demo login with real auth

Today, `/login` checks a hardcoded `demo@khouryclinic.com` / `demo123` pair in
`useDemoStore.login()`. For production:

1. Enable **Email** (or **Magic Link**) auth in Supabase → **Authentication → Providers**.
2. Create the real staff account(s) in **Authentication → Users** (or via `supabase.auth.admin.createUser`).
3. Replace `login()`/`logout()` in the store with `supabase.auth.signInWithPassword(...)` /
   `supabase.auth.signOut()`, and replace the `isAuthenticated` boolean with a check against
   `supabase.auth.getSession()`.
4. Update the RLS policies' `auth.role() = 'authenticated'` checks if you need per-clinic or
   per-role restrictions (e.g. only the assigned doctor can edit their own clinic's data).

## 8. Optional: Realtime dashboard sync

If more than one staff member will use the dashboard at once (e.g. front desk + doctor),
enable [Supabase Realtime](https://supabase.com/docs/guides/realtime) on `appointments` and
`follow_ups` so changes make from Telegram or another tab appear live, the same way the
current demo keeps the Zustand store in sync across the dashboard, booking flow, and Telegram
panel automatically.

## 9. Telegram and WhatsApp — when you're ready to go live

This demo **simulates** both channels entirely in the UI (see `lib/telegram/parser.ts` and
`lib/messages/whatsapp-templates.ts`) — no external API calls are made. To connect real
providers later:

- **Telegram**: create a bot via [@BotFather](https://t.me/BotFather), stand up a webhook
  (a Next.js Route Handler under `app/api/telegram/webhook/route.ts` is a natural fit), and
  feed incoming updates into the same `parseTelegramInput` logic already in `lib/telegram/parser.ts` —
  it's already written as a pure function decoupled from the UI.
- **WhatsApp**: use the [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
  (Cloud API) or a provider like Twilio. Keep `lib/messages/whatsapp-templates.ts` as your
  message copy source of truth and call the real send API from the same places the store
  currently calls `pushMessage(...)`.

Both integrations are optional for the sales demo — don't build them until a real clinic signs on.

## 10. Deployment env vars

Whichever host you deploy to (Vercel, etc.), set the same three variables from `.env.local`
as project environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only — mark it as a "secret"/server env var, never expose to the client bundle)

---

## Checklist

- [ ] Supabase project created
- [ ] `.env.local` filled in from `.env.example`
- [ ] `supabase/schema.sql` run
- [ ] `supabase/seed.sql` run (optional, for demo-identical data)
- [ ] RLS policies reviewed against your real auth/multi-tenant model
- [ ] Store actions migrated table-by-table (services → appointments → patients → follow-ups → messages → settings)
- [ ] Real staff auth wired up, demo login removed
- [ ] (Optional) Realtime enabled for multi-user dashboard sync
- [ ] (Optional) Real Telegram/WhatsApp providers connected
- [ ] Env vars set on the deployment host
