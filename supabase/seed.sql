-- ============================================================
-- LOCAL EXPERIENCES MVP — SEED DATA
-- Run AFTER schema.sql in the Supabase SQL editor.
-- All demo passwords: password123
-- ============================================================

-- ============================================================
-- TALENT CATEGORIES
-- ============================================================
insert into public.talent_categories (id, name, slug, icon, description) values
  ('cat-0000-0001-0000-000000000001', 'Musician',      'musician',      '🎵', 'Live music performers: acoustic, jazz, classical, and more'),
  ('cat-0000-0002-0000-000000000002', 'Influencer',    'influencer',    '📱', 'Social media creators who drive foot traffic and content for local venues'),
  ('cat-0000-0003-0000-000000000003', 'Popup Chef',    'popup-chef',    '👨‍🍳', 'Private dining and popup food experience hosts'),
  ('cat-0000-0004-0000-000000000004', 'Workshop Host', 'workshop-host', '🎨', 'Creatives who run hands-on experiences: ceramics, cocktails, floristry, and more');

-- ============================================================
-- AUTH USERS
-- Password for all: password123
-- These inserts work in the Supabase SQL editor (superuser context).
-- ============================================================
insert into auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at, aud, role
) values

  -- TALENT: Musicians
  ('usr-00000001-0000-0000-0000-000000000001',
   'maya@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Maya Chen"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000002-0000-0000-0000-000000000002',
   'luca@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Luca Moretti"}',
   now(), now(), 'authenticated', 'authenticated'),

  -- TALENT: Influencers
  ('usr-00000003-0000-0000-0000-000000000003',
   'zara@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Zara Okafor"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000004-0000-0000-0000-000000000004',
   'mia@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Mia Santos"}',
   now(), now(), 'authenticated', 'authenticated'),

  -- TALENT: Popup Chefs
  ('usr-00000005-0000-0000-0000-000000000005',
   'sofia@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Sofia Nguyen"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000006-0000-0000-0000-000000000006',
   'james@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"James Park"}',
   now(), now(), 'authenticated', 'authenticated'),

  -- TALENT: Workshop Hosts
  ('usr-00000007-0000-0000-0000-000000000007',
   'priya@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Priya Mehta"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000008-0000-0000-0000-000000000008',
   'dan@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"talent","full_name":"Dan Walsh"}',
   now(), now(), 'authenticated', 'authenticated'),

  -- BUSINESSES
  ('usr-00000009-0000-0000-0000-000000000009',
   'theroastery@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"business","full_name":"The Roastery"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000010-0000-0000-0000-000000000010',
   'cellar@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"business","full_name":"Cellar 21"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000011-0000-0000-0000-000000000011',
   'thegrand@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"business","full_name":"The Grand Boutique Hotel"}',
   now(), now(), 'authenticated', 'authenticated'),

  ('usr-00000012-0000-0000-0000-000000000012',
   'nodework@demo.com',
   '$2a$10$PX3A0b.tVuUv2Y.KQ9fhFe4.7jy3EXkc1E7H.NVlzLv3G4Uh8u6aG',
   now(), '{"user_type":"business","full_name":"Nodework Co"}',
   now(), now(), 'authenticated', 'authenticated');

-- ============================================================
-- PROFILES (auto-created by trigger, but needed when seeding directly)
-- ============================================================
insert into public.profiles (id, user_type, full_name) values
  ('usr-00000001-0000-0000-0000-000000000001', 'talent',   'Maya Chen'),
  ('usr-00000002-0000-0000-0000-000000000002', 'talent',   'Luca Moretti'),
  ('usr-00000003-0000-0000-0000-000000000003', 'talent',   'Zara Okafor'),
  ('usr-00000004-0000-0000-0000-000000000004', 'talent',   'Mia Santos'),
  ('usr-00000005-0000-0000-0000-000000000005', 'talent',   'Sofia Nguyen'),
  ('usr-00000006-0000-0000-0000-000000000006', 'talent',   'James Park'),
  ('usr-00000007-0000-0000-0000-000000000007', 'talent',   'Priya Mehta'),
  ('usr-00000008-0000-0000-0000-000000000008', 'talent',   'Dan Walsh'),
  ('usr-00000009-0000-0000-0000-000000000009', 'business', 'The Roastery'),
  ('usr-00000010-0000-0000-0000-000000000010', 'business', 'Cellar 21'),
  ('usr-00000011-0000-0000-0000-000000000011', 'business', 'The Grand Boutique Hotel'),
  ('usr-00000012-0000-0000-0000-000000000012', 'business', 'Nodework Co');

-- ============================================================
-- TALENT PROFILES
-- ============================================================
insert into public.talent_profiles
  (user_id, category_id, bio, location, hourly_rate, media_urls, is_available)
values
  -- Musicians
  ('usr-00000001-0000-0000-0000-000000000001',
   'cat-0000-0001-0000-000000000001',
   'Acoustic guitarist and vocalist with 8 years performing in cafes and intimate venues across Sydney. Specialises in bossa nova, folk, and original compositions that create a warm, welcoming atmosphere.',
   'Surry Hills, Sydney', 120.00,
   array['https://soundcloud.com/mayachen', 'https://www.instagram.com/mayachenmusic'],
   true),

  ('usr-00000002-0000-0000-0000-000000000002',
   'cat-0000-0001-0000-000000000001',
   'Jazz pianist and composer. Regular performer at wine bars and hotel lounges. Repertoire spans classic standards, smooth jazz, and ambient piano. Available for solo or duo sets. Brings his own portable keyboard.',
   'Fitzroy, Melbourne', 150.00,
   array['https://youtube.com/@lucamoretti', 'https://open.spotify.com/artist/lucamoretti'],
   true),

  -- Influencers
  ('usr-00000003-0000-0000-0000-000000000003',
   'cat-0000-0002-0000-000000000002',
   'Lifestyle and food content creator with 42k engaged Instagram followers. Specialises in venue features, new openings, and event coverage across Sydney. Average post reach: 18k. Packages include reels, stories, and grid posts.',
   'Paddington, Sydney', 300.00,
   array['https://www.instagram.com/zaraokafor', 'https://www.tiktok.com/@zaraokafor'],
   true),

  ('usr-00000004-0000-0000-0000-000000000004',
   'cat-0000-0002-0000-000000000002',
   'Melbourne local culture and events creator. 28k TikTok followers with strong Gen Z engagement. Known for "hidden gem" venue content and event day vlogs. Packages start at half-day coverage with 2 deliverables.',
   'Fitzroy, Melbourne', 250.00,
   array['https://www.tiktok.com/@miasantos', 'https://www.instagram.com/miasantos'],
   true),

  -- Popup Chefs
  ('usr-00000005-0000-0000-0000-000000000005',
   'cat-0000-0003-0000-000000000003',
   'Former head chef at a hatted Melbourne restaurant. Now runs intimate popup dinners. Cuisine: modern Vietnamese-Australian fusion. Handles all prep, service, and cleanup. Menus available for 10–40 guests. Dietary accommodations available.',
   'Richmond, Melbourne', 200.00,
   array['https://www.instagram.com/sofianguyenkitchen'],
   true),

  ('usr-00000006-0000-0000-0000-000000000006',
   'cat-0000-0003-0000-000000000003',
   'Korean BBQ specialist and private dining host. Brings the full experience: tabletop grills, house-made banchan, premium wagyu. Ideal for groups of 8–30. Based in Sydney but available for Melbourne events with notice.',
   'Newtown, Sydney', 180.00,
   array['https://www.instagram.com/jamespark.bbq', 'https://jamespark.com.au'],
   true),

  -- Workshop Hosts
  ('usr-00000007-0000-0000-0000-000000000007',
   'cat-0000-0004-0000-000000000004',
   'Ceramics artist and mindfulness facilitator. Runs hand-building pottery workshops and guided clay sessions for groups of 6–20. All materials included. Great for team events, member experiences, and brand activations. Based in Sydney.',
   'Newtown, Sydney', 160.00,
   array['https://www.instagram.com/priyamehta.clay', 'https://priyamehta.com.au'],
   true),

  ('usr-00000008-0000-0000-0000-000000000008',
   'cat-0000-0004-0000-000000000004',
   'Cocktail educator and bartender with 10 years experience at some of Melbourne''s best bars. Runs 90-minute cocktail masterclasses for groups of 8–30. All spirits, mixers, and glassware provided. Corporate groups welcome.',
   'Collingwood, Melbourne', 180.00,
   array['https://www.instagram.com/danwalshcocktails'],
   false);

-- ============================================================
-- BUSINESS PROFILES
-- ============================================================
insert into public.business_profiles
  (user_id, business_name, business_type, location, description, logo_url)
values
  ('usr-00000009-0000-0000-0000-000000000009',
   'The Roastery', 'Cafe', 'Paddington, Sydney',
   'Third-wave specialty coffee roaster with a 60-seat courtyard. We host monthly live music evenings and food events on the last Friday of every month. Our crowd is creative professionals who love good coffee and great atmosphere.',
   'https://placehold.co/200x200/e8d5b7/5c3d1e?text=TR'),

  ('usr-00000010-0000-0000-0000-000000000010',
   'Cellar 21', 'Wine Bar', 'East Melbourne',
   'Intimate natural wine bar with 35 covers. We pair great wine with curated live music — jazz, acoustic, and classical. Strong focus on local producers and local artists. Saturday nights are our flagship experience nights.',
   'https://placehold.co/200x200/2c1810/f5e6d3?text=C21'),

  ('usr-00000011-0000-0000-0000-000000000011',
   'The Grand Boutique Hotel', 'Boutique Hotel', 'Fitzroy, Melbourne',
   'A 22-room design hotel in a converted warehouse. Our lobby bar hosts quarterly chef residencies and live music for guests. We''re looking for talent that can elevate our guest experience and fit our aesthetic.',
   'https://placehold.co/200x200/1a1a2e/e8c4a0?text=GBH'),

  ('usr-00000012-0000-0000-0000-000000000012',
   'Nodework Co', 'Coworking Space', 'Surry Hills, Sydney',
   'Premium coworking space for creatives and founders. We host monthly member events: happy hours, skill shares, and popup experiences. 180 active members who love discovering new things.',
   'https://placehold.co/200x200/2d4a22/c8e6c9?text=NW');

-- ============================================================
-- EVENT REQUESTS
-- ============================================================
insert into public.event_requests
  (id, business_id, category_id, title, description,
   event_date, start_time, duration_hours, budget_min, budget_max, location, status)
values

  -- OPEN EVENTS
  ('evt-00000001-0000-0000-0000-000000000001',
   'usr-00000009-0000-0000-0000-000000000009',
   'cat-0000-0001-0000-000000000001',
   'Friday Evening Acoustic Set',
   'Looking for an acoustic guitarist or singer-songwriter for our monthly courtyard music night. Vibe: relaxed, warm, approachable. We provide a PA system and a meal. Expected audience: 50–60 coffee lovers.',
   '2026-03-27', '18:30', 3, 150, 250, 'Paddington, Sydney', 'open'),

  ('evt-00000002-0000-0000-0000-000000000002',
   'usr-00000010-0000-0000-0000-000000000010',
   'cat-0000-0001-0000-000000000001',
   'Saturday Jazz Night — April',
   'Seeking a jazz duo or solo pianist for our intimate Saturday sessions. We seat 35 people and the music moves from background to foreground as the night builds. Complimentary wine and dinner included.',
   '2026-04-05', '19:00', 3.5, 200, 350, 'East Melbourne', 'open'),

  ('evt-00000003-0000-0000-0000-000000000003',
   'usr-00000011-0000-0000-0000-000000000011',
   'cat-0000-0003-0000-000000000003',
   'Chef Residency — Lobby Bar Weekend',
   'Looking for a popup chef to take over our lobby bar kitchen for one weekend evening. 5-course sharing menu for approximately 20 guests. We handle front-of-house; you own the kitchen. Budget includes produce costs.',
   '2026-04-12', '18:00', 5, 800, 1500, 'Fitzroy, Melbourne', 'open'),

  ('evt-00000004-0000-0000-0000-000000000004',
   'usr-00000012-0000-0000-0000-000000000012',
   'cat-0000-0002-0000-000000000002',
   'Member Drinks Night — Content Creator',
   'Need a content creator for our quarterly member drinks. ~3 hours, 180 attendees. We want reels and stories for Instagram and TikTok, plus candid photo coverage. Fast turnaround appreciated — we post the recap within 48 hours.',
   '2026-03-20', '17:30', 3, 350, 600, 'Surry Hills, Sydney', 'open'),

  ('evt-00000005-0000-0000-0000-000000000005',
   'usr-00000012-0000-0000-0000-000000000012',
   'cat-0000-0004-0000-000000000004',
   'Cocktail Masterclass for Members',
   'Looking for a cocktail educator to run a 90-minute masterclass for 20 of our members. All spirits and mixers provided by us or can be sourced by you. Skill level: beginners. Fun and social atmosphere.',
   '2026-04-18', '18:00', 2, 400, 700, 'Surry Hills, Sydney', 'open'),

  ('evt-00000006-0000-0000-0000-000000000006',
   'usr-00000011-0000-0000-0000-000000000011',
   'cat-0000-0002-0000-000000000002',
   'Hotel Relaunch — Instagram & TikTok Coverage',
   'We are relaunching our lobby bar after a renovation and want a content creator to cover the event. Deliverables: 2 reels, 5+ stories, 10+ photos. Must have demonstrated hospitality/venue content.',
   '2026-04-25', '17:00', 4, 500, 900, 'Fitzroy, Melbourne', 'open'),

  -- CLOSED EVENTS
  ('evt-00000007-0000-0000-0000-000000000007',
   'usr-00000009-0000-0000-0000-000000000009',
   'cat-0000-0001-0000-000000000001',
   'Valentine''s Weekend Duo',
   'Intimate Valentine''s weekend set — looking for a duo (guitar + vocals, or piano + vocals). Romantic, easy-listening repertoire. Two 45-minute sets with a break in between.',
   '2026-02-14', '18:00', 2.5, 300, 450, 'Paddington, Sydney', 'closed'),

  ('evt-00000008-0000-0000-0000-000000000008',
   'usr-00000010-0000-0000-0000-000000000010',
   'cat-0000-0002-0000-000000000002',
   'Venue Relaunch — Social Content',
   'We refreshed our interior and needed a creator to document it. Half-day shoot: interior spaces, wine styling, and candid guest shots. Delivered two reels and a photo set.',
   '2026-02-28', '10:00', 4, 400, 700, 'East Melbourne', 'closed');

-- ============================================================
-- APPLICATIONS
-- ============================================================
insert into public.applications
  (event_request_id, talent_id, message, proposed_rate, status)
values

  -- Event 1: Friday Acoustic (open) — 2 applicants
  ('evt-00000001-0000-0000-0000-000000000001',
   'usr-00000001-0000-0000-0000-000000000001',
   'Hi! I''d love to play your courtyard evening. I play a mix of bossa nova and original acoustic pieces — perfect for a relaxed coffee crowd. I''ve played similar events at Grounds of Alexandria and Paramount Coffee Project. Happy to send a set list.',
   200.00, 'shortlisted'),

  ('evt-00000001-0000-0000-0000-000000000001',
   'usr-00000002-0000-0000-0000-000000000002',
   'Keen to bring some jazz piano to your space. I can do a solo acoustic piano set or bring a bassist for a fuller sound. Either works within your budget. I carry a portable keyboard so no piano needed on your end.',
   220.00, 'pending'),

  -- Event 2: Saturday Jazz Night (open) — 2 applicants
  ('evt-00000002-0000-0000-0000-000000000002',
   'usr-00000002-0000-0000-0000-000000000002',
   'Jazz piano is exactly what I do. I''d suggest a laid-back standards set for early evening that builds into something more engaging as the night goes on. I know Cellar 21 well — it''s acoustically great for piano.',
   300.00, 'shortlisted'),

  ('evt-00000002-0000-0000-0000-000000000002',
   'usr-00000001-0000-0000-0000-000000000001',
   'I''d bring my acoustic guitar and can adapt the vibe from background to foreground depending on crowd energy. Happy to discuss the repertoire beforehand and tailor it to your wine list theme.',
   180.00, 'pending'),

  -- Event 3: Chef Residency (open) — 1 applicant
  ('evt-00000003-0000-0000-0000-000000000003',
   'usr-00000005-0000-0000-0000-000000000005',
   'This sounds like exactly the kind of collaboration I''ve been looking for. My Vietnamese-Australian tasting menu would fit beautifully with a boutique hotel aesthetic. I have run similar residencies at two Melbourne hotels. Happy to do a tasting session beforehand.',
   1200.00, 'pending'),

  -- Event 4: Member Drinks Content (open) — 2 applicants
  ('evt-00000004-0000-0000-0000-000000000004',
   'usr-00000003-0000-0000-0000-000000000003',
   'I cover a lot of coworking and startup events — the energy is my favourite to capture. I can deliver a reel, 5 stories, and 15 edited photos within 24 hours. My Sydney audience skews exactly towards your member demographic.',
   500.00, 'shortlisted'),

  ('evt-00000004-0000-0000-0000-000000000004',
   'usr-00000004-0000-0000-0000-000000000004',
   'Happy to cover this. I focus on authentic, candid content — no overly staged shots. I can do reels and stories on the night and deliver edited content within 48 hours. Can travel from Melbourne for the right project.',
   420.00, 'pending'),

  -- Event 5: Cocktail Masterclass (open) — 1 applicant
  ('evt-00000005-0000-0000-0000-000000000005',
   'usr-00000008-0000-0000-0000-000000000008',
   'Cocktail masterclasses for coworking groups are a specialty of mine. I keep it fun, educational, and social — participants leave knowing how to make 3 cocktails. I bring all spirits, syrups, and tools. Just need a prep surface and running water.',
   600.00, 'pending'),

  -- Event 7: Valentine''s (closed) — 1 shortlisted
  ('evt-00000007-0000-0000-0000-000000000007',
   'usr-00000001-0000-0000-0000-000000000001',
   'A Valentine''s duo sounds beautiful. I paired with a violinist for a similar event last February — we did a mix of romantic classics and modern acoustic covers. Happy to share a recording. We came in at the lower end of your budget.',
   380.00, 'shortlisted'),

  -- Event 8: Cellar 21 Venue Relaunch (closed) — 1 shortlisted, 1 rejected
  ('evt-00000008-0000-0000-0000-000000000008',
   'usr-00000003-0000-0000-0000-000000000003',
   'Venue relaunches are my favourite content to make. I''d suggest splitting the day: empty venue detail shots in the morning and lifestyle/guest shots during soft launch in the afternoon. I have worked with two Melbourne wine bars on similar briefs.',
   600.00, 'shortlisted'),

  ('evt-00000008-0000-0000-0000-000000000008',
   'usr-00000004-0000-0000-0000-000000000004',
   'Happy to cover the relaunch. I specialise in venue and hospitality content and can deliver a full gallery plus vertical cuts for socials.',
   500.00, 'rejected');
