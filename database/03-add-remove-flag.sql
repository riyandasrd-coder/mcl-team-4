-- 03-add-remove-flag.sql : lets the tool "Remove" a record WITHOUT deleting it.
-- One small change: a Yes/No column called is_void. Removed records are hidden
-- from the pages and reports but stay safe in the database.
-- Paste this whole block in the Supabase SQL Editor and click Run. Run it once.

alter table public.production_log
  add column if not exists is_void boolean not null default false;
