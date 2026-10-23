-- ============================================================================
--  FIX ADMIN AUTH FOR CURRENT PROJECT
--  Run this in Supabase SQL Editor on wrjksvfhwukyxezjlchz
-- ============================================================================

-- Ensure store_admins table exists
create table if not exists public.store_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.store_admins enable row level security;
revoke all on public.store_admins from anon, authenticated;

-- Create/replace function with correct signature (no params)
create or replace function public.is_store_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.store_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_store_admin() from public;
grant execute on function public.is_store_admin() to authenticated;

-- Add your admin email if not present
insert into public.store_admins (email)
values ('ravshanbekovrasul11@gmail.com')
on conflict (email) do nothing;

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
