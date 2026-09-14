-- Khoury Clinic Demo — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.
-- See SETUP_SUPABASE.md at the project root for full setup instructions.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Clinics & Doctors
-- ─────────────────────────────────────────────

create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  address_line text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  hours jsonb not null default '[]',
  map_label text,
  created_at timestamptz not null default now()
);

create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  name text not null,
  title text,
  specialty text not null,
  bio text,
  education jsonb not null default '[]',
  certifications jsonb not null default '[]',
  experience_years int not null default 0,
  specialties jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Services
-- ─────────────────────────────────────────────

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  slug text not null unique,
  category text not null check (category in ('dermatology', 'aesthetic-medicine')),
  name text not null,
  short_description text,
  description text,
  benefits jsonb not null default '[]',
  duration_minutes int not null default 30,
  price_from numeric(10, 2) not null default 0,
  faq jsonb not null default '[]',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Patients
-- ─────────────────────────────────────────────

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  name text not null,
  phone text not null,
  email text not null,
  communication_status text not null default 'opted-in' check (communication_status in ('opted-in', 'opted-out')),
  notes text,
  created_at timestamptz not null default now(),
  unique (clinic_id, phone)
);

-- ─────────────────────────────────────────────
-- Appointments
-- ─────────────────────────────────────────────

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  patient_id uuid not null references patients (id) on delete cascade,
  service_id uuid not null references services (id),
  date date not null,
  time time not null,
  status text not null default 'pending'
    check (status in ('confirmed', 'pending', 'completed', 'cancelled', 'rescheduled')),
  source text not null default 'website' check (source in ('website', 'telegram', 'dashboard')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_clinic_date on appointments (clinic_id, date);
create index if not exists idx_appointments_patient on appointments (patient_id);

-- Simple history/audit trail per appointment
create table if not exists appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments (id) on delete cascade,
  action text not null, -- created | confirmed | cancelled | rescheduled | completed
  note text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Follow-ups (recall)
-- ─────────────────────────────────────────────

create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  patient_id uuid not null references patients (id) on delete cascade,
  appointment_id uuid references appointments (id) on delete set null,
  treatment text,
  last_visit date,
  due_date date not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'due', 'overdue', 'completed')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Messages (WhatsApp + Telegram log)
-- ─────────────────────────────────────────────

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  appointment_id uuid references appointments (id) on delete cascade,
  patient_id uuid references patients (id) on delete set null,
  channel text not null check (channel in ('whatsapp', 'telegram')),
  direction text not null default 'outbound' check (direction in ('outbound', 'inbound')),
  kind text not null, -- confirmation | reminder-24h | reminder-2h | thank-you | follow-up | cancellation | reschedule | custom
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_appointment on messages (appointment_id);

-- ─────────────────────────────────────────────
-- Automation rules
-- ─────────────────────────────────────────────

create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  name text not null,
  trigger_description text not null,
  action_description text not null,
  timing text,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Testimonials & Gallery
-- ─────────────────────────────────────────────

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  patient_name text not null,
  service_id uuid references services (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  quote text not null,
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics (id) on delete cascade,
  category text not null check (category in ('clinic', 'skin-treatments', 'aesthetic', 'environment')),
  title text not null,
  image_url text,
  accent text default 'gold',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Website settings (per clinic, single row)
-- ─────────────────────────────────────────────

create table if not exists website_settings (
  clinic_id uuid primary key references clinics (id) on delete cascade,
  show_testimonials boolean not null default true,
  show_gallery boolean not null default true,
  enable_arabic boolean not null default true,
  enable_french boolean not null default true,
  enable_online_booking boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- updated_at trigger helper
-- ─────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_appointments_updated_at on appointments;
create trigger trg_appointments_updated_at
  before update on appointments
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
-- This demo has a single admin (the doctor) and public patient booking.
-- Policy model:
--   - Anyone (anon) may INSERT a patient + appointment (public booking form).
--   - Anyone (anon) may SELECT services, testimonials, gallery, clinic/doctor info (public site content).
--   - Only authenticated staff (service role, or an authenticated Supabase user) may
--     SELECT/UPDATE/DELETE appointments, patients, follow-ups, messages, settings.
-- Adjust to your real authentication model before going to production.

alter table clinics enable row level security;
alter table doctors enable row level security;
alter table services enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table appointment_events enable row level security;
alter table follow_ups enable row level security;
alter table messages enable row level security;
alter table automation_rules enable row level security;
alter table testimonials enable row level security;
alter table gallery_items enable row level security;
alter table website_settings enable row level security;

-- Public read access for marketing/site content
create policy "Public can read clinics" on clinics for select using (true);
create policy "Public can read doctors" on doctors for select using (true);
create policy "Public can read services" on services for select using (true);
create policy "Public can read testimonials" on testimonials for select using (true);
create policy "Public can read gallery" on gallery_items for select using (true);
create policy "Public can read website settings" on website_settings for select using (true);

-- Public booking: allow inserting a patient + appointment from the website
create policy "Public can create a patient" on patients for insert with check (true);
create policy "Public can create an appointment" on appointments for insert with check (true);

-- Staff-only access (service role bypasses RLS entirely; these policies cover
-- an authenticated dashboard user if/when real auth is wired up)
create policy "Staff can manage patients" on patients for all using (auth.role() = 'authenticated');
create policy "Staff can manage appointments" on appointments for all using (auth.role() = 'authenticated');
create policy "Staff can manage appointment_events" on appointment_events for all using (auth.role() = 'authenticated');
create policy "Staff can manage follow_ups" on follow_ups for all using (auth.role() = 'authenticated');
create policy "Staff can manage messages" on messages for all using (auth.role() = 'authenticated');
create policy "Staff can manage automation_rules" on automation_rules for all using (auth.role() = 'authenticated');
create policy "Staff can manage website_settings" on website_settings for all using (auth.role() = 'authenticated');
