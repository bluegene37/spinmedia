-- SPIN Media TV Philippines — Initial Supabase Schema, RLS & Storage
-- Run this idempotent migration once in your Supabase SQL Editor.

-- 1. Admin allowlist (controls write access across all tables and storage)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_spin_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- 2. Live Broadcast override (single primary row toggled from /admin)
create table if not exists public.live_broadcasts (
  id text primary key default 'primary',
  is_live boolean not null default false,
  platform text not null default 'youtube' check (platform in ('youtube', 'facebook', 'custom')),
  title text not null default '',
  subtitle text not null default '',
  stream_url text not null default '',
  embed_url text not null default '',
  show_slug text,
  show_banner boolean not null default true,
  auto_embed_on_home boolean not null default true,
  started_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.live_broadcasts (id, is_live, platform, title, subtitle, stream_url, embed_url)
values ('primary', false, 'youtube', '', '', '', '')
on conflict (id) do nothing;

-- 3. Structured site sections (site, about, public_info, initiatives, gallery_meta, leader_levels)
create table if not exists public.site_sections (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

-- 4. Weekly broadcast shows
create table if not exists public.shows (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  hosts text[] not null default '{}',
  director text,
  day_of_week integer[] not null default '{}',
  day_label text not null default '',
  time_label text not null default '',
  start_hour_pht integer not null default 19,
  end_hour_pht integer not null default 20,
  summary text not null default '',
  accent_color text not null default 'crimson',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- 5. Media Hub items (YouTube videos, Shorts, Facebook posts)
create table if not exists public.media_items (
  id text primary key,
  platform text not null check (platform in ('youtube', 'facebook')),
  format text not null check (format in ('episode', 'short', 'report', 'post')),
  title text not null,
  summary text not null default '',
  published_at timestamptz not null default now(),
  show_slug text not null default 'breaking-news',
  show_label text not null default 'Daily & Global Dispatches',
  video_id text,
  external_url text not null,
  embed_url text,
  thumbnail_url text,
  views integer,
  featured boolean not null default false,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists idx_media_items_published_at on public.media_items (published_at desc);

-- 6. Good News PH stories
create table if not exists public.positive_news (
  id text primary key,
  category text not null check (category in ('community', 'ofw', 'family', 'progress')),
  category_label text not null,
  title text not null,
  summary text not null default '',
  body text not null default '',
  location text not null default '',
  published_at timestamptz not null default now(),
  read_time text not null default '3 min read',
  highlight_tag text not null default '',
  accent_color text not null default 'crimson' check (accent_color in ('crimson', 'ochre', 'civic')),
  related_show_slug text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists idx_positive_news_published_at on public.positive_news (published_at desc);

-- 7. Key Leaders Directory entries
create table if not exists public.leaders (
  id text primary key,
  level_id text not null check (level_id in ('national', 'regional', 'provincial', 'district', 'municipal')),
  name text not null,
  role text not null,
  area_label text not null default '',
  region_code text,
  island_group text check (island_group is null or island_group in ('mindanao-command', 'luzon', 'visayas', 'mindanao')),
  role_tier text not null default 'director' check (role_tier in ('executive', 'overall', 'director', 'spin-media', 'deputy', 'placeholder')),
  photo_url text,
  status text not null default 'confirmed' check (status in ('confirmed', 'placeholder')),
  bio text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_leaders_level_sort on public.leaders (level_id, sort_order);

-- 8. SPIN Gallery albums & slides
create table if not exists public.gallery_albums (
  id text primary key,
  slot_number text not null default '01',
  title text not null,
  category text not null check (category in ('gawad', 'studio', 'community', 'chapters')),
  category_label text not null,
  description text not null default '',
  location_label text not null default '',
  date_label text not null default '',
  cover_image_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_slides (
  id text primary key,
  album_id text not null references public.gallery_albums(id) on delete cascade,
  slide_number integer not null default 1,
  title text not null,
  caption text not null default '',
  category text not null check (category in ('gawad', 'studio', 'community', 'chapters')),
  image_url text not null,
  tag text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_slides_album_sort on public.gallery_slides (album_id, sort_order);

-- 9. SPIN Jobs openings
create table if not exists public.spin_jobs (
  id text primary key,
  title text not null,
  department text not null default '',
  location text not null default '',
  employment_type text not null default 'Full-Time',
  summary text not null default '',
  apply_url text,
  is_open boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Row-Level Security (RLS)
alter table public.admin_users enable row level security;
alter table public.live_broadcasts enable row level security;
alter table public.site_sections enable row level security;
alter table public.shows enable row level security;
alter table public.media_items enable row level security;
alter table public.positive_news enable row level security;
alter table public.leaders enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_slides enable row level security;
alter table public.spin_jobs enable row level security;

-- admin_users: users can read only their own row; no client writes
drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id);

-- live_broadcasts
drop policy if exists "live_broadcasts_public_read" on public.live_broadcasts;
create policy "live_broadcasts_public_read"
  on public.live_broadcasts
  for select
  using (true);

drop policy if exists "live_broadcasts_admin_write" on public.live_broadcasts;
create policy "live_broadcasts_admin_write"
  on public.live_broadcasts
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- site_sections
drop policy if exists "site_sections_public_read" on public.site_sections;
create policy "site_sections_public_read"
  on public.site_sections
  for select
  using (true);

drop policy if exists "site_sections_admin_write" on public.site_sections;
create policy "site_sections_admin_write"
  on public.site_sections
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- shows
drop policy if exists "shows_public_read" on public.shows;
create policy "shows_public_read"
  on public.shows
  for select
  using (is_active = true or public.is_spin_admin());

drop policy if exists "shows_admin_write" on public.shows;
create policy "shows_admin_write"
  on public.shows
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- media_items
drop policy if exists "media_items_public_read" on public.media_items;
create policy "media_items_public_read"
  on public.media_items
  for select
  using (is_published = true or public.is_spin_admin());

drop policy if exists "media_items_admin_write" on public.media_items;
create policy "media_items_admin_write"
  on public.media_items
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- positive_news
drop policy if exists "positive_news_public_read" on public.positive_news;
create policy "positive_news_public_read"
  on public.positive_news
  for select
  using (is_published = true or public.is_spin_admin());

drop policy if exists "positive_news_admin_write" on public.positive_news;
create policy "positive_news_admin_write"
  on public.positive_news
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- leaders
drop policy if exists "leaders_public_read" on public.leaders;
create policy "leaders_public_read"
  on public.leaders
  for select
  using (true);

drop policy if exists "leaders_admin_write" on public.leaders;
create policy "leaders_admin_write"
  on public.leaders
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- gallery_albums
drop policy if exists "gallery_albums_public_read" on public.gallery_albums;
create policy "gallery_albums_public_read"
  on public.gallery_albums
  for select
  using (true);

drop policy if exists "gallery_albums_admin_write" on public.gallery_albums;
create policy "gallery_albums_admin_write"
  on public.gallery_albums
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- gallery_slides
drop policy if exists "gallery_slides_public_read" on public.gallery_slides;
create policy "gallery_slides_public_read"
  on public.gallery_slides
  for select
  using (true);

drop policy if exists "gallery_slides_admin_write" on public.gallery_slides;
create policy "gallery_slides_admin_write"
  on public.gallery_slides
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- spin_jobs
drop policy if exists "spin_jobs_public_read" on public.spin_jobs;
create policy "spin_jobs_public_read"
  on public.spin_jobs
  for select
  using (is_open = true or public.is_spin_admin());

drop policy if exists "spin_jobs_admin_write" on public.spin_jobs;
create policy "spin_jobs_admin_write"
  on public.spin_jobs
  for all
  to authenticated
  using (public.is_spin_admin())
  with check (public.is_spin_admin());

-- 11. Public Storage Bucket for admin-uploaded branding, portraits, and gallery slides
insert into storage.buckets (id, name, public)
values ('spin-media', 'spin-media', true)
on conflict (id) do nothing;

drop policy if exists "spin_media_storage_public_read" on storage.objects;
create policy "spin_media_storage_public_read"
  on storage.objects
  for select
  using (bucket_id = 'spin-media');

drop policy if exists "spin_media_storage_admin_insert" on storage.objects;
create policy "spin_media_storage_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'spin-media' and public.is_spin_admin());

drop policy if exists "spin_media_storage_admin_update" on storage.objects;
create policy "spin_media_storage_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'spin-media' and public.is_spin_admin())
  with check (bucket_id = 'spin-media' and public.is_spin_admin());

drop policy if exists "spin_media_storage_admin_delete" on storage.objects;
create policy "spin_media_storage_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'spin-media' and public.is_spin_admin());

-- 12. First Admin Setup (run AFTER creating your admin user in Supabase Authentication -> Users)
-- Replace 'admin@example.com' with your admin account email:
--
-- insert into public.admin_users (user_id, email, display_name, role)
-- select id, email, 'SPIN Media Admin', 'super_admin'
-- from auth.users
-- where email = 'admin@example.com'
-- on conflict (user_id) do nothing;
