-- Restore developers if the table is emptied.
-- Safe to re-run: upserts by primary key.

INSERT INTO developers (
  id,
  developer_name,
  title,
  image_path,
  point_one,
  point_two,
  point_three,
  sort_order,
  created_at,
  updated_at
) VALUES
  (
    '1b5b38a9-fba7-4c98-80bc-cf0f9028f08b',
    'Emaar',
    'Emaar Properties',
    'developers/b500bdae-4a65-413b-9b4d-1f7e93d588b2.png',
    'Iconic Dubai Communities',
    'Off-Plan & Ready Properties',
    'Apartments, Villas & Townhouses',
    0,
    '2026-09-26 07:03:14.018087+00',
    '2026-09-30 13:18:23.797+00'
  ),
  (
    'd98eeab8-1b15-4599-884a-8207514cc1b2',
    'Nakheel',
    'Nakheel Properties',
    'developers/6fff5a2d-6ac9-4fcd-a551-1deffce65968.png',
    'Landmark Waterfront Communities',
    'Off-Plan & Ready Properties',
    'Apartments, Villas & Townhouses',
    1,
    '2026-09-26 07:02:42.227975+00',
    '2026-09-30 13:19:24.057+00'
  ),
  (
    'f781c7b9-dd08-4e9d-8c0f-767f039948f9',
    'Meraas',
    'Meraas Properties',
    'developers/8cdf5bb1-7933-4bf2-a141-9757a95a6f7b.png',
    'Lifestyle-Focused Destinations',
    'Residential & Off-Plan Projects',
    'Apartments & Waterfront Residences',
    2,
    '2026-09-26 07:01:12.301414+00',
    '2026-09-30 13:20:03.553+00'
  ),
  (
    '97083471-f6c2-40cf-b12d-8c969b2438f4',
    'Dubai Properties',
    'Dubai Properties',
    'developers/f7ba578e-867a-4a30-90cf-7771fd46f86f.png',
    'Established Dubai Communities',
    'Residential & Waterfront Developments',
    'Apartments, Villas & Townhouses',
    3,
    '2026-09-26 07:00:05.370148+00',
    '2026-09-30 13:20:52.228+00'
  ),
  (
    'bf6bb0d4-8847-486c-a4c6-8bc1facb2293',
    'Sobha',
    'Sobha Properties',
    'developers/582493ad-446a-493b-a5ef-848db6829f0d.png',
    'Premium Residential Communities',
    'Off-Plan & Ready Properties',
    'Apartments, Villas & Penthouses',
    4,
    '2026-09-26 06:59:11.289976+00',
    '2026-09-30 13:22:09.603+00'
  ),
  (
    '28cdb790-8d43-4a5f-a35d-cf2c6237fef6',
    'Damac',
    'Damac Properties',
    'developers/1ea6012e-c50e-42a5-bf35-849e91168421.png',
    'Luxury Residential Communities',
    'Off-Plan & Ready Properties',
    'Apartments, Villas & Townhouses',
    5,
    '2026-09-26 06:58:31.008608+00',
    '2026-09-30 13:22:46.218+00'
  ),
  (
    'bd298a3f-d90b-429a-9794-fbfe3beacf68',
    'Elington',
    'Elington Properties',
    'developers/2f28d3a0-671b-4a82-ae19-46f15059f721.png',
    'Design-Led Residential Communities',
    'Design-Led Residential Communities',
    'Design-Led Residential Communities',
    6,
    '2026-09-26 06:57:27.882242+00',
    '2026-09-30 13:23:26.201+00'
  ),
  (
    '0e845a20-da41-4aee-994c-dd9638484170',
    'Omniyat',
    'Omniyat Properties',
    'developers/2b9db40c-dfe3-4c37-a136-6dd6c4f84dbf.png',
    'Luxury Dubai Residences',
    'High-End Residential Projects',
    'Apartments, Penthouses & Villas',
    7,
    '2026-09-26 06:56:38.267341+00',
    '2026-09-30 13:24:07.534+00'
  ),
  (
    '00819595-d430-44f7-ab98-7a872593825a',
    'Binghatti',
    'Binghatti Properties',
    'developers/24009c14-78f1-4f16-96dc-e321b7ba4236.png',
    'Modern Dubai Developments',
    'Off-Plan & Branded Properties',
    'Apartments, Villas & Penthouses',
    8,
    '2026-09-26 06:55:01.734844+00',
    '2026-09-30 13:24:52.242+00'
  ),
  (
    '184bcdfa-7f06-4c9c-a4c0-3f2e447776f3',
    'Al Dar',
    'Al Dar Properties',
    'developers/01577d5a-a7fa-46ee-a38e-45928830f686.png',
    'Leading UAE Communities',
    'Off-Plan & Ready Properties',
    'Apartments, Villas & Townhouses',
    9,
    '2026-09-26 06:54:02.539499+00',
    '2026-09-30 13:25:22.088+00'
  )
ON CONFLICT (id) DO UPDATE SET
  developer_name = EXCLUDED.developer_name,
  title = EXCLUDED.title,
  image_path = EXCLUDED.image_path,
  point_one = EXCLUDED.point_one,
  point_two = EXCLUDED.point_two,
  point_three = EXCLUDED.point_three,
  sort_order = EXCLUDED.sort_order,
  updated_at = EXCLUDED.updated_at;
