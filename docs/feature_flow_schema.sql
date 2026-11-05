-- =====================================================================
-- Feature Flow: database schema (final, "lite" version)
-- Run top to bottom in the Supabase SQL editor on a FRESH project.
--
-- Tables : profile, feedback, comment, vote, feedback_embeddings
-- View   : vw_feedback_details
-- Func   : match_similar_feedback
-- Rules  : Row Level Security (RLS) is ON for every table (section 6)
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Extension: pgvector (used for AI duplicate search)
-- ---------------------------------------------------------------------
create extension if not exists vector with schema extensions;


-- ---------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------

-- One row per user. id is the same id as auth.users.
create table public.profile (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  avatar_url text,
  role       text not null default 'USER' check (role in ('ADMIN', 'USER')),
  created_at timestamptz not null default now()
);

-- Ideas and bug reports. Soft delete: rows are marked, never removed.
-- tags / ai_flagged / ai_flag_reason are filled by the AI step.
create table public.feedback (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profile (id) on delete cascade,
  title            text not null check (char_length(title) between 5 and 150),
  description      text not null check (char_length(description) between 5 and 5000),
  category         text not null check (category in ('FEATURE', 'BUG', 'UI')),
  status           text not null default 'UNDER_REVIEW'
                   check (status in ('UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED')),
  is_deleted       boolean not null default false,
  deleted_by_admin boolean not null default false,
  deleted_at       timestamptz,
  tags             text[] not null default '{}',
  ai_flagged       boolean not null default false,
  ai_flag_reason   text,
  created_at       timestamptz not null default now()
);

-- Comments (soft delete too).
create table public.comment (
  id               uuid primary key default gen_random_uuid(),
  feedback_id      uuid not null references public.feedback (id) on delete cascade,
  user_id          uuid not null references public.profile (id) on delete cascade,
  content          text not null check (char_length(content) between 5 and 2000),
  is_deleted       boolean not null default false,
  deleted_by_admin boolean not null default false,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now()
);

-- One row = one upvote. The unique pair makes a double vote impossible.
create table public.vote (
  id          uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback (id) on delete cascade,
  user_id     uuid not null references public.profile (id) on delete cascade,
  created_at  timestamptz default now(),
  constraint votes_one_per_user unique (feedback_id, user_id)
);

-- One 768-number vector per post (AI duplicate search).
-- Written only by server code (service role), so it has no insert policy.
-- model = which embedding model made the vector (vectors from different
-- models cannot be compared).
create table public.feedback_embeddings (
  feedback_id uuid primary key references public.feedback (id) on delete cascade,
  embedding   extensions.vector(768) not null,
  model       text not null
);


-- ---------------------------------------------------------------------
-- 3. Indexes (primary keys and the unique pair already have indexes)
-- ---------------------------------------------------------------------
create index feedback_created_at_idx on public.feedback (created_at desc);
create index feedback_status_idx     on public.feedback (status);
create index feedback_category_idx   on public.feedback (category);
create index feedback_user_idx       on public.feedback (user_id);
create index comment_feedback_idx    on public.comment (feedback_id, created_at);
create index votes_user_idx          on public.vote (user_id);
-- No vector index on purpose: exact search is fast for a few hundred rows.


-- ---------------------------------------------------------------------
-- 4. View: feed data with counts computed in SQL (one query per page)
--    security_invoker = on  ->  the caller's RLS applies to the view
-- ---------------------------------------------------------------------
create view public.vw_feedback_details
with (security_invoker = on)
as
select
  f.id,
  f.title,
  f.description,
  f.category,
  f.status,
  f.tags,
  f.user_id,
  f.is_deleted,
  f.deleted_by_admin,
  f.deleted_at,
  f.created_at,
  (select count(*)::int from public.vote v where v.feedback_id = f.id) as vote_count,
  (select count(*)::int from public.comment c
     where c.feedback_id = f.id and c.is_deleted = false) as comment_count,
  json_build_object('full_name', p.full_name, 'avatar_url', p.avatar_url) as profile
from public.feedback f
left join public.profile p on p.id = f.user_id;

grant select on public.vw_feedback_details to anon, authenticated;


-- ---------------------------------------------------------------------
-- 5. Function: find similar posts (AI duplicate check)
--    <=> is cosine distance, so 1 - distance = similarity (1 = identical).
--    Exact search over every stored vector; capped at 20 results.
-- ---------------------------------------------------------------------
create or replace function public.match_similar_feedback(
  query_embedding extensions.vector(768),
  match_threshold float,
  match_count int
)
returns table (id uuid, title text, vote_count int, similarity float)
language sql
stable
security invoker
as $$
  select
    v.id,
    v.title,
    v.vote_count,
    1 - (fe.embedding <=> query_embedding) as similarity
  from public.feedback_embeddings fe
  join public.vw_feedback_details v on v.id = fe.feedback_id
  where v.is_deleted = false
    and 1 - (fe.embedding <=> query_embedding) > match_threshold
  order by fe.embedding <=> query_embedding asc
  limit least(match_count, 20);
$$;


-- ---------------------------------------------------------------------
-- 6. Row Level Security: turn it on for every table
-- ---------------------------------------------------------------------
alter table public.profile             enable row level security;
alter table public.feedback            enable row level security;
alter table public.comment             enable row level security;
alter table public.vote                enable row level security;
alter table public.feedback_embeddings enable row level security;


-- ---------------------------------------------------------------------
-- 7. Policies
--    Admin check used below:
--      exists (select 1 from public.profile
--              where id = auth.uid() and role = 'ADMIN')
--    Known limit: RLS controls rows, not columns. An owner can update any
--    column of their own post or comment. The server actions only send
--    the allowed fields.
-- ---------------------------------------------------------------------

-- ---- profile ----
create policy "profile: everyone can read"
  on public.profile for select
  using (true);

create policy "profile: user can create own profile but as USER only"
  on public.profile for insert to authenticated
  with check (id = auth.uid() and role = 'USER');

create policy "profile: user can change its own row, except ROLE"
  on public.profile for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select p.role from public.profile as p where p.id = auth.uid())
  );

create policy "admin: admin can change anything in profile"
  on public.profile for update to authenticated
  using (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'))
  with check (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'));

-- ---- feedback ----
create policy "feedback: everyone can see feedbacks"
  on public.feedback for select
  using (true);

create policy "feedback: insert your feedbacks"
  on public.feedback for insert to authenticated
  with check (user_id = auth.uid());

-- owner updates are used for soft delete
create policy "feedback: owner can update fields for soft deletion"
  on public.feedback for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "admin: admin can update anything in feedback"
  on public.feedback for update to authenticated
  using (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'))
  with check (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'));

-- ---- comment ----
create policy "comment: anyone can view comments"
  on public.comment for select
  using (true);

create policy "comment: user can post comments"
  on public.comment for insert to authenticated
  with check (user_id = auth.uid());

create policy "comment: user can soft delete their comment"
  on public.comment for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "admin: admin can soft delete comment"
  on public.comment for update to authenticated
  using (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'))
  with check (exists (select 1 from public.profile where id = auth.uid() and role = 'ADMIN'));

-- ---- vote ----
create policy "vote: anyone can see votes"
  on public.vote for select
  using (true);

create policy "vote: user can vote"
  on public.vote for insert to authenticated
  with check (user_id = auth.uid());

create policy "vote: user can down vote"
  on public.vote for delete to authenticated
  using (user_id = auth.uid());

-- ---- feedback_embeddings ----
-- Signed-in users may read (the similarity function needs it).
-- No insert/update policy: only the server (service role) writes vectors.
create policy "embeddings: signed-in users can read"
  on public.feedback_embeddings for select to authenticated
  using (true);


-- ---------------------------------------------------------------------
-- 8. Make yourself admin (run once, after you have signed up)
--    Find your id: Authentication -> Users, or
--    select id, full_name from public.profile;
-- ---------------------------------------------------------------------
-- update public.profile set role = 'ADMIN' where id = 'YOUR-USER-UUID';


-- ---------------------------------------------------------------------
-- 9. Checks (safe to run any time)
-- ---------------------------------------------------------------------

-- RLS must be on for every table (rowsecurity = true)
select tablename, rowsecurity from pg_tables where schemaname = 'public';

-- the view works and the counts look right
select id, title, tags, vote_count, comment_count
from public.vw_feedback_details
limit 3;

-- embeddings column must be vector(768)
select format_type(a.atttypid, a.atttypmod)
from pg_attribute a
where a.attrelid = 'public.feedback_embeddings'::regclass and a.attname = 'embedding';