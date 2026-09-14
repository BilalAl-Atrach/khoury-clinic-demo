-- Khoury Clinic Demo — fictional seed data
-- Run AFTER schema.sql. Safe to re-run against an empty database; re-running
-- against a populated one will create duplicates (truncate first if needed).

do $$
declare
  v_clinic_id uuid;
  v_doctor_id uuid;

  svc_acne uuid; svc_pigmentation uuid; svc_skin_rejuv uuid; svc_skin_health uuid; svc_hair uuid;
  svc_botox uuid; svc_fillers uuid; svc_boosters uuid; svc_facial_rejuv uuid; svc_non_invasive uuid;

  pat_ids uuid[10];
  pat_names text[10] := array['Sarah Haddad','Maya Saleh','Lina Khoury','Nour Farhat','Emma Mansour',
                               'Yara Abou Chacra','Rania Fakhoury','Layla Chami','Zeina Nassar','Christelle Aoun'];
  i int;
begin
  -- Clinic
  insert into clinics (name, city, country, address_line, phone, whatsapp, email, hours, map_label)
  values (
    'Khoury Dermatology & Aesthetic Clinic', 'Beirut', 'Lebanon', 'Clemenceau Street, Beirut, Lebanon',
    '+961 1 234 567', '+961 76 123 456', 'hello@khouryclinic.demo',
    '[{"day":"Monday – Friday","hours":"9:00 AM – 6:00 PM"},{"day":"Saturday","hours":"10:00 AM – 3:00 PM"},{"day":"Sunday","hours":"Closed"}]',
    'Clemenceau, Beirut, Lebanon'
  )
  returning id into v_clinic_id;

  -- Doctor
  insert into doctors (clinic_id, name, title, specialty, bio, education, certifications, experience_years, specialties)
  values (
    v_clinic_id, 'Dr. Nadine Khoury', 'MD', 'Dermatologist & Aesthetic Medicine Specialist',
    'Dr. Nadine Khoury combines medical dermatology with refined aesthetic technique to help patients achieve healthy, natural-looking results.',
    '["M.D., American University of Beirut (fictional, demo)","Residency in Dermatology, Hôtel-Dieu de France (fictional, demo)","Fellowship in Aesthetic Medicine, Paris (fictional, demo)"]',
    '["Board Certified Dermatologist (demo)","Certified in Advanced Injectables (demo)","Member, Lebanese Society of Dermatology (demo)"]',
    12,
    '["Medical Dermatology","Botox & Fillers","Skin Rejuvenation","Acne & Scar Therapy"]'
  )
  returning id into v_doctor_id;

  -- Services
  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq, featured)
  values (v_clinic_id, 'acne-acne-scars', 'dermatology', 'Acne & Acne Scars', 'Targeted therapy for active acne and scar remodeling.',
    'A structured program combining medical-grade treatments to control active breakouts and progressively improve the appearance of acne scarring.',
    '["Reduces active breakouts","Improves skin texture over time","Personalized treatment plan","Minimal downtime options"]', 45, 90,
    '[{"question":"How many sessions will I need?","answer":"Most patients see visible improvement after 4–6 sessions (demo answer)."}]', true)
  returning id into svc_acne;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'pigmentation', 'dermatology', 'Pigmentation Correction', 'Even out tone and reduce sun spots or melasma.',
    'A gentle, progressive approach to correcting uneven pigmentation, sun damage, and melasma.',
    '["Brighter, even skin tone","Reduces dark spots","Safe for most skin types"]', 40, 100,
    '[{"question":"Will results be permanent?","answer":"Results are long-lasting with sun protection (demo answer)."}]')
  returning id into svc_pigmentation;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'skin-rejuvenation', 'dermatology', 'Skin Rejuvenation Therapy', 'Restore radiance and improve overall skin health.',
    'A medical skin rejuvenation protocol designed to improve texture, hydration, and radiance.',
    '["Improved radiance","Smoother texture","Boosted hydration"]', 50, 120,
    '[{"question":"When will I see results?","answer":"Many patients notice a glow within days (demo answer)."}]')
  returning id into svc_skin_rejuv;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq, featured)
  values (v_clinic_id, 'skin-health-consultation', 'dermatology', 'Skin Health Consultation', 'A full assessment of your skin with a personalized plan.',
    'A comprehensive consultation to assess your skin''s health and build a personalized roadmap.',
    '["Full skin assessment","Personalized roadmap","No obligation plan"]', 30, 60,
    '[{"question":"Do I need this before other treatments?","answer":"Recommended for new patients (demo answer)."}]', true)
  returning id into svc_skin_health;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'hair-scalp-treatments', 'dermatology', 'Hair & Scalp Treatments', 'Support healthy hair growth and scalp balance.',
    'Evidence-informed treatments to support scalp health and reduce hair thinning.',
    '["Supports healthy growth","Improves scalp condition","Tailored programs"]', 40, 110,
    '[{"question":"Is this suitable for both men and women?","answer":"Yes, programs are tailored individually (demo answer)."}]')
  returning id into svc_hair;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq, featured)
  values (v_clinic_id, 'botox', 'aesthetic-medicine', 'Botox', 'Smooth expression lines with a natural-looking result.',
    'Precision Botox treatment to soften fine lines and wrinkles while preserving natural facial expression.',
    '["Softens expression lines","Quick appointment","Natural-looking results"]', 30, 250,
    '[{"question":"How long do results last?","answer":"Typically 3–4 months (demo answer)."}]', true)
  returning id into svc_botox;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq, featured)
  values (v_clinic_id, 'dermal-fillers', 'aesthetic-medicine', 'Dermal Fillers', 'Restore volume and enhance facial contours.',
    'Carefully placed dermal fillers to restore volume, refine contours, and achieve balanced, natural results.',
    '["Restores volume","Enhances contours","Immediate visible results"]', 45, 350,
    '[{"question":"Is the treatment painful?","answer":"A topical numbing cream is used for comfort (demo answer)."}]', true)
  returning id into svc_fillers;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'skin-boosters', 'aesthetic-medicine', 'Skin Boosters', 'Deep hydration for a luminous, healthy glow.',
    'Micro-injections of hyaluronic acid to deeply hydrate skin from within.',
    '["Deep hydration","Improved elasticity","Subtle, natural glow"]', 35, 220,
    '[{"question":"How many sessions are recommended?","answer":"A course of 3 sessions is typical (demo answer)."}]')
  returning id into svc_boosters;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'facial-rejuvenation', 'aesthetic-medicine', 'Facial Rejuvenation', 'A comprehensive approach to a refreshed appearance.',
    'A combination protocol addressing volume, texture, and tone for a refreshed, well-rested appearance.',
    '["Comprehensive results","Customized combination plan","Natural refresh"]', 60, 400,
    '[{"question":"Can this be combined with other treatments?","answer":"Yes, plans are fully customized (demo answer)."}]')
  returning id into svc_facial_rejuv;

  insert into services (clinic_id, slug, category, name, short_description, description, benefits, duration_minutes, price_from, faq)
  values (v_clinic_id, 'non-invasive-skin-treatments', 'aesthetic-medicine', 'Non-invasive Skin Treatments', 'Gentle technology-driven treatments with no downtime.',
    'A range of non-invasive treatments using advanced technology to refresh skin with no downtime required.',
    '["No downtime","Comfortable sessions","Progressive visible results"]', 40, 150,
    '[{"question":"Can I return to work after?","answer":"Yes, immediately in most cases (demo answer)."}]')
  returning id into svc_non_invasive;

  -- Patients
  for i in 1..10 loop
    insert into patients (clinic_id, name, phone, email, communication_status, created_at)
    values (
      v_clinic_id, pat_names[i],
      '+961 3 ' || (100 + i)::text || ' ' || (200 + i)::text,
      lower(replace(pat_names[i], ' ', '.')) || '@demo.com',
      'opted-in',
      now() - ((30 + i * 7) || ' days')::interval
    )
    returning id into pat_ids[i];
  end loop;

  -- Appointments (spread across past / today / future, various statuses)
  insert into appointments (clinic_id, patient_id, service_id, date, time, status, source, created_at) values
    (v_clinic_id, pat_ids[1], svc_acne,          current_date - 14, '09:00', 'completed', 'website', now() - interval '17 days'),
    (v_clinic_id, pat_ids[2], svc_pigmentation,  current_date - 10, '10:30', 'completed', 'website', now() - interval '13 days'),
    (v_clinic_id, pat_ids[3], svc_skin_rejuv,    current_date - 7,  '11:30', 'completed', 'website', now() - interval '10 days'),
    (v_clinic_id, pat_ids[4], svc_skin_health,   current_date - 5,  '13:00', 'completed', 'website', now() - interval '8 days'),
    (v_clinic_id, pat_ids[5], svc_hair,          current_date - 3,  '14:00', 'completed', 'website', now() - interval '6 days'),
    (v_clinic_id, pat_ids[6], svc_botox,         current_date - 2,  '15:00', 'completed', 'website', now() - interval '5 days'),
    (v_clinic_id, pat_ids[7], svc_fillers,       current_date - 1,  '16:00', 'completed', 'website', now() - interval '4 days'),
    (v_clinic_id, pat_ids[8], svc_boosters,      current_date,      '17:00', 'confirmed', 'website', now() - interval '3 days'),
    (v_clinic_id, pat_ids[9], svc_facial_rejuv,  current_date,      '09:00', 'confirmed', 'website', now() - interval '3 days'),
    (v_clinic_id, pat_ids[10],svc_non_invasive,  current_date,      '10:30', 'pending',   'website', now() - interval '3 days'),
    (v_clinic_id, pat_ids[1], svc_acne,          current_date + 1,  '11:30', 'confirmed', 'website', now() - interval '2 days'),
    (v_clinic_id, pat_ids[2], svc_pigmentation,  current_date + 1,  '13:00', 'confirmed', 'website', now() - interval '2 days'),
    (v_clinic_id, pat_ids[3], svc_skin_rejuv,    current_date + 2,  '14:00', 'confirmed', 'website', now() - interval '2 days'),
    (v_clinic_id, pat_ids[4], svc_skin_health,   current_date + 3,  '15:00', 'pending',   'website', now() - interval '1 days'),
    (v_clinic_id, pat_ids[5], svc_hair,          current_date + 4,  '16:00', 'confirmed', 'website', now() - interval '1 days'),
    (v_clinic_id, pat_ids[6], svc_botox,         current_date + 5,  '17:00', 'confirmed', 'website', now()),
    (v_clinic_id, pat_ids[7], svc_fillers,       current_date + 7,  '09:00', 'confirmed', 'website', now()),
    (v_clinic_id, pat_ids[8], svc_boosters,      current_date + 9,  '10:30', 'confirmed', 'website', now()),
    (v_clinic_id, pat_ids[9], svc_facial_rejuv,  current_date + 12, '11:30', 'pending',   'website', now()),
    (v_clinic_id, pat_ids[10],svc_non_invasive,  current_date + 14, '13:00', 'confirmed', 'website', now()),
    (v_clinic_id, pat_ids[1], svc_acne,          current_date + 18, '14:00', 'cancelled', 'website', now());

  -- Follow-ups
  insert into follow_ups (clinic_id, patient_id, treatment, last_visit, due_date, status) values
    (v_clinic_id, pat_ids[1], 'Skin Consultation',            current_date - 30, current_date - 2,  'overdue'),
    (v_clinic_id, pat_ids[2], 'Botox Touch-up',                current_date - 25, current_date,      'due'),
    (v_clinic_id, pat_ids[3], 'Acne Follow-up',                 current_date - 20, current_date + 1,  'due'),
    (v_clinic_id, pat_ids[4], 'Filler Review',                  current_date - 18, current_date + 5,  'upcoming'),
    (v_clinic_id, pat_ids[5], 'Pigmentation Recheck',           current_date - 35, current_date - 5,  'overdue'),
    (v_clinic_id, pat_ids[6], 'Skin Booster Series',            current_date - 15, current_date + 10, 'upcoming'),
    (v_clinic_id, pat_ids[7], 'Facial Rejuvenation Review',     current_date - 28, current_date + 2,  'due'),
    (v_clinic_id, pat_ids[8], 'Hair & Scalp Recheck',           current_date - 40, current_date - 10, 'overdue'),
    (v_clinic_id, pat_ids[9], 'Skin Health Recheck',            current_date - 12, current_date + 14, 'upcoming'),
    (v_clinic_id, pat_ids[10],'Non-invasive Follow-up',         current_date - 22, current_date + 3,  'due');

  -- Testimonials
  insert into testimonials (clinic_id, patient_name, service_id, rating, quote) values
    (v_clinic_id, 'Sarah H.', svc_acne, 5, 'Dr. Khoury and her team made me feel comfortable from the first visit. My skin has never looked better. (Demo testimonial)'),
    (v_clinic_id, 'Maya S.', svc_botox, 5, 'Natural results and such a professional, calming experience. Booking online was effortless. (Demo testimonial)'),
    (v_clinic_id, 'Lina K.', svc_fillers, 5, 'The WhatsApp reminders meant I never missed an appointment. Such a well-run clinic. (Demo testimonial)'),
    (v_clinic_id, 'Nour F.', svc_skin_rejuv, 4, 'Warm, attentive, and genuinely expert care. Highly recommend the consultation. (Demo testimonial)'),
    (v_clinic_id, 'Emma M.', svc_boosters, 5, 'The clinic feels premium from the website to the follow-up messages. Five stars. (Demo testimonial)'),
    (v_clinic_id, 'Yara A.', svc_pigmentation, 5, 'My pigmentation has visibly improved. Grateful for such a thoughtful treatment plan. (Demo testimonial)');

  -- Gallery
  insert into gallery_items (clinic_id, category, title, accent) values
    (v_clinic_id, 'clinic', 'Reception & Lounge', 'gold'),
    (v_clinic_id, 'clinic', 'Consultation Room', 'navy'),
    (v_clinic_id, 'clinic', 'Treatment Suite', 'beige'),
    (v_clinic_id, 'skin-treatments', 'Skin Rejuvenation Session', 'gold'),
    (v_clinic_id, 'skin-treatments', 'Pigmentation Therapy', 'navy'),
    (v_clinic_id, 'aesthetic', 'Precision Injectables', 'beige'),
    (v_clinic_id, 'aesthetic', 'Facial Contouring', 'gold'),
    (v_clinic_id, 'environment', 'Beirut Clinic Exterior', 'navy'),
    (v_clinic_id, 'environment', 'Private Waiting Area', 'beige'),
    (v_clinic_id, 'aesthetic', 'Skin Booster Application', 'gold');

  -- Automation rules
  insert into automation_rules (clinic_id, name, trigger_description, action_description, timing, enabled) values
    (v_clinic_id, 'Booking Confirmation', 'Appointment booked', 'Send WhatsApp confirmation instantly', 'Immediately', true),
    (v_clinic_id, '24-Hour Reminder', '24 hours before appointment', 'Send WhatsApp reminder', '24h before', true),
    (v_clinic_id, '2-Hour Reminder', '2 hours before appointment', 'Send WhatsApp reminder', '2h before', true),
    (v_clinic_id, 'Post-Visit Thank You', 'Appointment marked completed', 'Send thank-you message', 'Immediately after visit', true),
    (v_clinic_id, 'Follow-up Recall', '30 days after appointment', 'Send follow-up reminder', '30 days after', true),
    (v_clinic_id, 'Cancellation Notice', 'Appointment cancelled', 'Send cancellation confirmation & release slot', 'Immediately', true);

  -- Website settings (single row per clinic)
  insert into website_settings (clinic_id) values (v_clinic_id);

end $$;
