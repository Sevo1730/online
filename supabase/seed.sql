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
