# Supabase Local API Setup

This project includes a small Express backend proxying Supabase calls. To successfully create and update rows in Supabase, the backend must use a service role key.

## Required Environment Variables

Create a `.env` file at the project root with these values:

```env
VITE_SUPABASE_URL=https://rpnczosrvbwuyjbnoqku.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_E7cwux6DDgeIsrh4s4KmVA_cmR0jOo5
SUPABASE_SERVICE_KEY=your-service-role-key
VITE_SERVER_API_KEY=your-local-server-api-key
```

## Notes

- `VITE_SUPABASE_ANON_KEY` is safe for public reads.
- `SUPABASE_SERVICE_KEY` is required for backend write operations because the Supabase tables currently enforce row-level security.
- The backend loads `.env` automatically via `dotenv`.
- Do not commit your real `SUPABASE_SERVICE_KEY` to git.

## Running the server

```bash
npm run server
```

If you see a log like:

```
[server] SUPABASE_SERVICE_KEY not set; write operations will be blocked by row-level security
```

then the `.env` file is missing or does not include `SUPABASE_SERVICE_KEY`.
