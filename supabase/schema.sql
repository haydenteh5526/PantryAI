-- PantryAI Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  is_premium boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Cooking History
create table public.cooking_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  steps jsonb not null default '[]',
  rating smallint check (rating between 0 and 5) default 0,
  notes text default '',
  photo_url text,
  completed_at timestamptz default now()
);

alter table public.cooking_history enable row level security;

create policy "Users can CRUD own history"
  on public.cooking_history for all using (auth.uid() = user_id);

create index idx_history_user on public.cooking_history (user_id, completed_at desc);

-- 3. Saved Recipes (Favorites)
create table public.saved_recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  calories integer,
  ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  vibe text,
  cuisine text,
  safety_rules jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.saved_recipes enable row level security;

create policy "Users can CRUD own saved recipes"
  on public.saved_recipes for all using (auth.uid() = user_id);

create index idx_saved_user on public.saved_recipes (user_id, created_at desc);

-- 4. Social Posts (shared recipes)
create table public.social_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  photo_url text not null,
  rating smallint default 0,
  notes text default '',
  likes_count integer default 0,
  posted_at timestamptz default now()
);

alter table public.social_posts enable row level security;

-- Anyone authenticated can read social posts
create policy "Authenticated users can read posts"
  on public.social_posts for select using (auth.role() = 'authenticated');

create policy "Users can insert own posts"
  on public.social_posts for insert with check (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.social_posts for delete using (auth.uid() = user_id);

create index idx_social_recent on public.social_posts (posted_at desc);
