-- Supabase → SQL Editor дээр нэг удаа ажиллуулна.
create table if not exists public.orders (
  order_no      text primary key,
  status        text not null default 'pending_payment'
                check (status in ('pending_payment', 'paid', 'shipped', 'cancelled')),
  pay_method    text not null,
  ship_method   text not null,
  customer_name text not null,
  phone         text not null,
  district      text,
  khoroo        text,
  address       text,
  slot          text,
  items         jsonb not null,
  subtotal      integer not null,
  shipping_fee  integer not null,
  total         integer not null,
  created_at    timestamptz not null default now()
);

-- Зөвхөн server (service_role key) хандана. Browser-оос шууд хандах эрхгүй.
alter table public.orders enable row level security;

-- ── Бүтээгдэхүүн ──
create table if not exists public.products (
  slug        text primary key,
  name        text not null,
  price       integer not null check (price >= 0),
  was         integer,                       -- хуучин үнэ (хямдралтай үед)
  is_new      boolean not null default false,
  category    text not null check (category in ('dress', 'top', 'pants', 'outerwear', 'accessories')),
  colors      text[] not null default '{}',
  sizes       text[] not null default '{}',  -- хоосон = нэг хэмжээ
  sold_out    text[] not null default '{}',
  rank        integer not null default 100,  -- "Их захиалагдсан" эрэмбэ (бага = эхэнд)
  tone        smallint not null default 1 check (tone between 1 and 3),
  description text,
  material    text,
  images      text[] not null default '{}',  -- Storage public URL-ууд
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.products enable row level security;

-- ── Зургийн сан (public bucket) ──
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;
