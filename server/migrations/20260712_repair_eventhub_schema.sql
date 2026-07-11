-- EventHub schema repair / compatibility migration
-- Run once in the Supabase SQL Editor for the production project.
-- It is idempotent, so it is also safe to run against a fresh database.

create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.events
  add column if not exists title text,
  add column if not exists short_description text,
  add column if not exists description text,
  add column if not exists full_description text,
  add column if not exists category text,
  add column if not exists venue text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text default 'India',
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists start_time time,
  add column if not exists end_time time,
  add column if not exists registration_deadline date,
  add column if not exists ticket_type text,
  add column if not exists price text default '0',
  add column if not exists capacity integer,
  add column if not exists tags text[] default '{}',
  add column if not exists banner_url text,
  add column if not exists image text,
  add column if not exists organizer_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists website text,
  add column if not exists facebook text,
  add column if not exists instagram text,
  add column if not exists organizer_id text,
  add column if not exists creator text,
  add column if not exists status text default 'Upcoming',
  add column if not exists created_at timestamptz not null default now();

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_start_date_idx on public.events (start_date);
create index if not exists events_city_idx on public.events (city);
create index if not exists events_organizer_id_idx on public.events (organizer_id);

-- Preserve data from earlier EventHub versions that used event_date/event_time.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'event_date'
  ) then
    execute 'update public.events set start_date = coalesce(start_date, event_date)';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'event_time'
  ) then
    execute 'update public.events set start_time = coalesce(start_time, event_time)';
  end if;
end;
$$;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

alter table public.registrations
  add column if not exists registration_id text,
  add column if not exists user_id text,
  add column if not exists event_id uuid references public.events(id) on delete cascade,
  add column if not exists event_title text,
  add column if not exists attendee_name text,
  add column if not exists attendee_email text,
  add column if not exists attendee_phone text,
  add column if not exists ticket_type text,
  add column if not exists price numeric not null default 0,
  add column if not exists status text default 'confirmed',
  add column if not exists ticket_id text,
  add column if not exists qr_data text,
  add column if not exists checked_in boolean not null default false,
  add column if not exists checked_in_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

create unique index if not exists registrations_ticket_id_key
  on public.registrations (ticket_id) where ticket_id is not null;
create index if not exists registrations_event_idx on public.registrations (event_id);
create index if not exists registrations_user_idx on public.registrations (user_id);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  checked_in boolean not null default false,
  checked_in_time timestamptz,
  created_at timestamptz not null default now()
);
alter table public.attendance
  add column if not exists registration_id uuid references public.registrations(id) on delete cascade,
  add column if not exists checked_in boolean not null default false,
  add column if not exists checked_in_time timestamptz,
  add column if not exists created_at timestamptz not null default now();
create unique index if not exists attendance_registration_id_key on public.attendance (registration_id);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  registration_id uuid references public.registrations(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  event_title text,
  attendee_name text,
  attendee_email text,
  attendee_phone text,
  ticket_type text,
  price numeric not null default 0,
  qr_data text,
  created_at timestamptz not null default now()
);
alter table public.tickets
  add column if not exists ticket_id text,
  add column if not exists registration_id uuid references public.registrations(id) on delete cascade,
  add column if not exists event_id uuid references public.events(id) on delete cascade,
  add column if not exists event_title text,
  add column if not exists attendee_name text,
  add column if not exists attendee_email text,
  add column if not exists attendee_phone text,
  add column if not exists ticket_type text,
  add column if not exists price numeric not null default 0,
  add column if not exists qr_data text,
  add column if not exists created_at timestamptz not null default now();

-- Profiles are read by useAuth. The trigger copies sign-up metadata so a
-- missing profile row cannot make a new account lose its selected role.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text not null default 'attendee' check (role in ('attendee', 'organizer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill accounts that were created before the profile trigger existed.
insert into public.profiles (id, full_name, email, phone, role)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  u.email,
  u.raw_user_meta_data ->> 'phone',
  case when u.raw_user_meta_data ->> 'role' = 'organizer' then 'organizer' else 'attendee' end
from auth.users u
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    case when new.raw_user_meta_data ->> 'role' = 'organizer' then 'organizer' else 'attendee' end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.attendance enable row level security;
alter table public.tickets enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "public can view events" on public.events;
create policy "public can view events" on public.events for select using (true);
drop policy if exists "organizers can create events" on public.events;
create policy "organizers can create events" on public.events for insert to authenticated
  with check (
    organizer_id = auth.uid()::text
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('organizer', 'admin'))
  );
drop policy if exists "organizers can update own events" on public.events;
create policy "organizers can update own events" on public.events for update to authenticated
  using (organizer_id = auth.uid()::text)
  with check (
    organizer_id = auth.uid()::text
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('organizer', 'admin'))
  );
drop policy if exists "organizers can delete own events" on public.events;
create policy "organizers can delete own events" on public.events for delete to authenticated
  using (
    organizer_id = auth.uid()::text
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('organizer', 'admin'))
  );

drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "users can view own registrations" on public.registrations;
create policy "users can view own registrations" on public.registrations for select to authenticated
  using (user_id = auth.uid()::text);
drop policy if exists "users can create own registrations" on public.registrations;
create policy "users can create own registrations" on public.registrations for insert to authenticated
  with check (user_id = auth.uid()::text);
drop policy if exists "users can view own tickets" on public.tickets;
create policy "users can view own tickets" on public.tickets for select to authenticated
  using (exists (select 1 from public.registrations r where r.id = tickets.registration_id and r.user_id = auth.uid()::text));
