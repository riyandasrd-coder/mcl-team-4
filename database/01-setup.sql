-- 01-setup.sql : Bhubaneswari OCP - Daily Coal & OB Production log
-- Paste this WHOLE block into the Supabase SQL Editor and click Run. Run it once.

create table if not exists public.production_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  log_date date not null,
  shift text not null check (shift in ('A', 'B', 'C')),
  location text not null default 'Bhubaneswari OCP',
  coal_target numeric not null default 0 check (coal_target >= 0),
  coal_actual numeric not null default 0 check (coal_actual >= 0),
  ob_target numeric not null default 0 check (ob_target >= 0),
  ob_actual numeric not null default 0 check (ob_actual >= 0),
  shortfall_reason text,
  delay_hours numeric not null default 0 check (delay_hours >= 0 and delay_hours <= 24),
  remarks text,
  corrective_action text,
  urgency text not null default 'Low' check (urgency in ('Low', 'Medium', 'High')),
  status text not null default 'Open' check (status in ('Open', 'In progress', 'Resolved'))
);

-- Only one record per date and shift (stops double counting)
create unique index if not exists production_log_date_shift_uq
  on public.production_log (log_date, shift);

alter table public.production_log enable row level security;

create policy "anon and authenticated can read"
  on public.production_log for select to anon, authenticated using (true);

create policy "anon and authenticated can add"
  on public.production_log for insert to anon, authenticated with check (true);

create policy "anon and authenticated can update"
  on public.production_log for update to anon, authenticated using (true) with check (true);

grant select, insert, update on public.production_log to anon, authenticated;
