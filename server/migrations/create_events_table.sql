-- Run this in your Supabase SQL editor to create the events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  short_description text,
  description text,
  full_description text,
  category text,
  venue text,
  city text,
  state text,
  country text,
  start_date date,
  end_date date,
  start_time time,
  end_time time,
  registration_deadline date,
  ticket_type text,
  price text,
  capacity integer,
  tags text[],
  banner_url text,
  image text,
  organizer_name text,
  contact_email text,
  contact_phone text,
  website text,
  facebook text,
  instagram text,
  organizer_id text,
  creator text,
  status text,
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS events_created_at_idx ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS events_start_date_idx ON public.events (start_date);
CREATE INDEX IF NOT EXISTS events_city_idx ON public.events (city);
