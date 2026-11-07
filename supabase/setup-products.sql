-- Supabase → SQL Editor: энэ файлын БҮХ агуулгыг хуулж буулгаад Run дарна (нэг удаа).

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


-- Одоогийн 16 барааг DB руу оруулна (schema.sql-ийн дараа нэг удаа ажиллуулна)
insert into public.products (slug, name, price, was, is_new, category, colors, sizes, sold_out, rank, tone, description, material, created_at) values
  ('tsagaan-maalingan-daashinz', 'Цагаан маалинган даашинз', 149000, null, true, 'dress', array['white','beige']::text[], array['XS','S','M','L','XL']::text[], array['L']::text[], 1, 2, 'Нимгэн, агаар нэвтрүүлдэг маалинган даашинз. Бэлхүүсээрээ бүстэй, өвдөг доогуур урттай. Ганцаар нь эсвэл ноолууран свитертэй давхарлаж өмсөнө.', '100% маалинга
30°C-т зөөлөн горимоор угаана
Дунд халуунаар индүүдэнэ', now() - interval '0 minutes'),
  ('khongor-torgon-daashinz', 'Хонгор торгон даашинз', 189000, null, false, 'dress', array['brown','black']::text[], array['S','M','L']::text[], array[]::text[], 3, 1, null, null, now() - interval '1 minutes'),
  ('urt-khantsuitai-suljmel-daashinz', 'Урт ханцуйтай сүлжмэл даашинз', 169000, null, false, 'dress', array['grey','green']::text[], array['XS','S','M','L','XL']::text[], array[]::text[], 6, 3, null, null, now() - interval '2 minutes'),
  ('khar-trikotazh-daashinz', 'Хар трикотаж даашинз', 99000, 129000, false, 'dress', array['black']::text[], array['S','M','L','XL']::text[], array[]::text[], 2, 2, null, null, now() - interval '3 minutes'),
  ('plisse-torgon-daashinz', 'Плиссе торгон даашинз', 209000, null, true, 'dress', array['green','black']::text[], array['XS','S','M']::text[], array[]::text[], 9, 1, null, null, now() - interval '4 minutes'),
  ('undur-zakhtai-nooluuran-daashinz', 'Өндөр захтай ноолууран даашинз', 289000, null, true, 'dress', array['beige','grey']::text[], array['S','M','L','XL']::text[], array[]::text[], 5, 3, null, null, now() - interval '5 minutes'),
  ('nooson-tsamts-daashinz', 'Ноосон цамц-даашинз', 159000, null, false, 'dress', array['grey']::text[], array['M','L','XL']::text[], array[]::text[], 10, 2, null, null, now() - interval '6 minutes'),
  ('bustei-khuvun-daashinz', 'Бүстэй хөвөн даашинз', 119000, null, false, 'dress', array['white','black']::text[], array['XS','S','M','L']::text[], array[]::text[], 4, 1, null, null, now() - interval '7 minutes'),
  ('maalingan-urt-daashinz', 'Маалинган урт даашинз', 159000, null, false, 'dress', array['beige']::text[], array['S','M','L','XL']::text[], array[]::text[], 7, 3, null, null, now() - interval '8 minutes'),
  ('tsetsegtei-shifon-daashinz', 'Цэцэгтэй шифон даашинз', 139000, null, false, 'dress', array['black','white']::text[], array['XS','S','M']::text[], array[]::text[], 8, 2, null, null, now() - interval '9 minutes'),
  ('torgon-tsamts-suudr', 'Торгон цамц «Сүүдэр»', 89000, null, false, 'top', array['black','white']::text[], array['XS','S','M','L','XL']::text[], array[]::text[], 11, 1, null, null, now() - interval '10 minutes'),
  ('urgun-shuluun-umd', 'Өргөн шулуун өмд', 119000, null, false, 'pants', array['beige','black']::text[], array['XS','S','M','L','XL']::text[], array[]::text[], 12, 3, null, null, now() - interval '11 minutes'),
  ('nooluuran-palto', 'Ноолууран пальто «Үүрийн гэгээ»', 489000, null, false, 'outerwear', array['beige','grey']::text[], array['S','M','L']::text[], array[]::text[], 13, 3, null, null, now() - interval '12 minutes'),
  ('suljmel-nooluuran-oroolt', 'Сүлжмэл ноолууран ороолт', 79000, null, false, 'accessories', array['beige','grey']::text[], array[]::text[], array[]::text[], 14, 1, null, null, now() - interval '13 minutes'),
  ('tsemben-kurtik', 'Цэмбэн куртик', 229000, null, false, 'outerwear', array['brown']::text[], array['XS','S','M','L']::text[], array[]::text[], 15, 2, null, null, now() - interval '14 minutes'),
  ('arisan-narin-bus', 'Арьсан нарийн бүс', 59000, null, false, 'accessories', array['black','brown']::text[], array[]::text[], array[]::text[], 16, 3, null, null, now() - interval '15 minutes')
on conflict (slug) do nothing;


-- ТУРШИЛТЫН зураг (Unsplash). Жинхэнэ зургаа admin-аас оруулаад эдгээрийг солино.
-- Supabase → SQL Editor дээр нэг удаа ажиллуулна (seed.sql-ийн дараа).
update public.products set images = array['https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format']::text[] where slug = 'tsagaan-maalingan-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1562151270-c7d22ceb586a?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format']::text[] where slug = 'khongor-torgon-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1645996830739-8fe3df27c33f?w=1200&q=80&auto=format']::text[] where slug = 'urt-khantsuitai-suljmel-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format']::text[] where slug = 'khar-trikotazh-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format']::text[] where slug = 'plisse-torgon-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format']::text[] where slug = 'undur-zakhtai-nooluuran-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format']::text[] where slug = 'nooson-tsamts-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1645996830739-8fe3df27c33f?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=1200&q=80&auto=format']::text[] where slug = 'bustei-khuvun-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1562151270-c7d22ceb586a?w=1200&q=80&auto=format']::text[] where slug = 'maalingan-urt-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=1200&q=80&auto=format']::text[] where slug = 'tsetsegtei-shifon-daashinz';
update public.products set images = array['https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format']::text[] where slug = 'torgon-tsamts-suudr';
update public.products set images = array['https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format']::text[] where slug = 'urgun-shuluun-umd';
update public.products set images = array['https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format']::text[] where slug = 'nooluuran-palto';
update public.products set images = array['https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format']::text[] where slug = 'suljmel-nooluuran-oroolt';
update public.products set images = array['https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format']::text[] where slug = 'tsemben-kurtik';
update public.products set images = array['https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format','https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format']::text[] where slug = 'arisan-narin-bus';
