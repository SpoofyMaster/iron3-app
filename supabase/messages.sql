-- Real-time chat table for Iron3
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  text text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create index if not exists idx_messages_sender_receiver_created
  on public.messages(sender_id, receiver_id, created_at desc);

create index if not exists idx_messages_receiver_created
  on public.messages(receiver_id, created_at desc);

alter table public.messages enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'Users can view their conversations'
  ) then
    create policy "Users can view their conversations"
      on public.messages
      for select
      using (auth.uid() = sender_id or auth.uid() = receiver_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'Users can send messages'
  ) then
    create policy "Users can send messages"
      on public.messages
      for insert
      with check (auth.uid() = sender_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'Receivers can mark as read'
  ) then
    create policy "Receivers can mark as read"
      on public.messages
      for update
      using (auth.uid() = receiver_id)
      with check (auth.uid() = receiver_id);
  end if;
end $$;
