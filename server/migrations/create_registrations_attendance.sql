-- Run in Supabase SQL editor
CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text,
  user_id text,
  event_id uuid,
  ticket_type text,
  price numeric,
  status text,
  name text,
  email text,
  phone text,
  college_company text,
  occupation text,
  address text,
  city text,
  state text,
  emergency_contact_name text,
  emergency_contact_phone text,
  dietary_preference text,
  tshirt_size text,
  notes text,
  ticket_id text,
  qr_data text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES public.registrations(id),
  checked_in boolean DEFAULT false,
  checked_in_time timestamp with time zone
);

CREATE INDEX IF NOT EXISTS registrations_event_idx ON public.registrations (event_id);
CREATE INDEX IF NOT EXISTS registrations_user_idx ON public.registrations (user_id);
CREATE INDEX IF NOT EXISTS attendance_reg_idx ON public.attendance (registration_id);
