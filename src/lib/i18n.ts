export type Lang = 'en' | 'ro' | 'ru'

const translations = {
  // Nav & Global
  'app.name': { en: 'MindVox', ro: 'MindVox', ru: 'MindVox' },
  'app.tagline': { en: 'Therapeutic Audio', ro: 'Audio Terapeutic', ru: '\u0422\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0430\u0443\u0434\u0438\u043e' },
  'nav.signIn': { en: 'Sign In', ro: 'Autentificare', ru: '\u0412\u043e\u0439\u0442\u0438' },
  'nav.getStarted': { en: 'Get Started', ro: '\u00CEncepe', ru: '\u041d\u0430\u0447\u0430\u0442\u044c' },
  'nav.signOut': { en: 'Sign out', ro: 'Deconectare', ru: '\u0412\u044b\u0439\u0442\u0438' },
  'nav.sessions': { en: 'Sessions', ro: 'Sesiuni', ru: '\u0421\u0435\u0441\u0441\u0438\u0438' },
  'nav.progress': { en: 'Progress', ro: 'Progres', ru: '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441' },
  'nav.settings': { en: 'Settings', ro: 'Set\u0103ri', ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438' },
  'nav.overview': { en: 'Overview', ro: 'Prezentare', ru: '\u041e\u0431\u0437\u043e\u0440' },
  'nav.patients': { en: 'Patients', ro: 'Pacien\u021bi', ru: '\u041f\u0430\u0446\u0438\u0435\u043d\u0442\u044b' },
  'nav.programs': { en: 'Programs', ro: 'Programe', ru: '\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b' },

  // Landing
  'landing.badge': { en: 'Post-treatment therapeutic audio platform', ro: 'Platform\u0103 audio terapeutic\u0103 post-tratament', ru: '\u041f\u043e\u0441\u0442-\u043b\u0435\u0447\u0435\u0431\u043d\u0430\u044f \u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0430\u0443\u0434\u0438\u043e \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430' },
  'landing.h1a': { en: 'Consolidate treatment gains', ro: 'Consolideaz\u0103 rezultatele tratamentului', ru: '\u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u0435 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043b\u0435\u0447\u0435\u043d\u0438\u044f' },
  'landing.h1b': { en: 'with guided audio therapy', ro: 'cu terapie audio ghidat\u0103', ru: '\u0441 \u0430\u0443\u0434\u0438\u043e \u0442\u0435\u0440\u0430\u043f\u0438\u0435\u0439' },
  'landing.desc': {
    en: 'MindVox helps therapists prescribe structured audio programs for patients after TMS, CBT, or other treatments. 8-week programs with mood tracking, progress analytics, and offline mobile support.',
    ro: 'MindVox ajut\u0103 terapeut\u0163ii s\u0103 prescrie programe audio structurate pentru pacien\u021bi dup\u0103 TMS, CBT sau alte tratamente. Programe de 8 s\u0103pt\u0103m\u00e2ni cu monitorizarea dispozi\u021biei, analiz\u0103 a progresului \u0219i suport mobil offline.',
    ru: 'MindVox \u043f\u043e\u043c\u043e\u0433\u0430\u0435\u0442 \u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0430\u043c \u043d\u0430\u0437\u043d\u0430\u0447\u0430\u0442\u044c \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0430\u0443\u0434\u0438\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b \u0434\u043b\u044f \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432 \u043f\u043e\u0441\u043b\u0435 TMS, CBT \u0438\u043b\u0438 \u0434\u0440\u0443\u0433\u0438\u0445 \u043f\u0440\u043e\u0446\u0435\u0434\u0443\u0440. 8-\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b \u0441 \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u043d\u0438\u0435\u043c \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u044f \u0438 \u043e\u0444\u0444\u043b\u0430\u0439\u043d-\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u043e\u0439.'
  },
  'landing.cta': { en: 'Start Free Trial', ro: '\u00CEncepe gratuit', ru: '\u041d\u0430\u0447\u0430\u0442\u044c \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e' },
  'landing.learn': { en: 'Learn more', ro: 'Afl\u0103 mai mult', ru: '\u0423\u0437\u043d\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435' },
  'landing.program': { en: 'Structured 8-Week Program', ro: 'Program structurat de 8 s\u0103pt\u0103m\u00e2ni', ru: '\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0430\u044f 8-\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430' },
  'landing.clinical': { en: 'Built for Clinical Use', ro: 'Construit pentru uz clinic', ru: '\u0414\u043b\u044f \u043a\u043b\u0438\u043d\u0438\u0447\u0435\u0441\u043a\u043e\u0433\u043e \u043f\u0440\u0438\u043c\u0435\u043d\u0435\u043d\u0438\u044f' },
  'landing.ctaTitle': { en: 'Ready to prescribe audio therapy?', ro: 'Gata s\u0103 prescrii terapie audio?', ru: '\u0413\u043e\u0442\u043e\u0432\u044b \u043d\u0430\u0437\u043d\u0430\u0447\u0438\u0442\u044c \u0430\u0443\u0434\u0438\u043e \u0442\u0435\u0440\u0430\u043f\u0438\u044e?' },
  'landing.ctaDesc': { en: 'Create your therapist account and assign your first patient program in minutes.', ro: 'Creeaz\u0103-\u021bi contul de terapeut \u0219i asigneaz\u0103 primul program \u00een c\u00e2teva minute.', ru: '\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0430 \u0438 \u043d\u0430\u0437\u043d\u0430\u0447\u044c\u0442\u0435 \u043f\u0435\u0440\u0432\u0443\u044e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0443 \u0437\u0430 \u043c\u0438\u043d\u0443\u0442\u044b.' },
  'landing.ctaBtn': { en: 'Create Therapist Account', ro: 'Creeaz\u0103 cont terapeut', ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442' },
  'landing.footer': { en: 'MindVox \u00a9 {year} \u2014 Therapeutic audio for treatment consolidation', ro: 'MindVox \u00a9 {year} \u2014 Audio terapeutic pentru consolidarea tratamentului', ru: 'MindVox \u00a9 {year} \u2014 \u0422\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0430\u0443\u0434\u0438\u043e \u0434\u043b\u044f \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u044f \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432' },
  'landing.preview': { en: 'See how patients use MindVox', ro: 'Vezi cum folosesc pacien\u021bii MindVox', ru: '\u041a\u0430\u043a \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044e\u0442 MindVox' },

  // Phases
  'phase.regulation': { en: 'Regulation', ro: 'Reglare', ru: '\u0420\u0435\u0433\u0443\u043b\u044f\u0446\u0438\u044f' },
  'phase.regulation.desc': { en: 'Nervous system regulation through breathing and body scanning', ro: 'Reglarea sistemului nervos prin respira\u021bie \u0219i scanare corporal\u0103', ru: '\u0420\u0435\u0433\u0443\u043b\u044f\u0446\u0438\u044f \u043d\u0435\u0440\u0432\u043d\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0447\u0435\u0440\u0435\u0437 \u0434\u044b\u0445\u0430\u043d\u0438\u0435 \u0438 \u0441\u043a\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u043b\u0430' },
  'phase.restructuring': { en: 'Restructuring', ro: 'Restructurare', ru: '\u0420\u0435\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0438\u0437\u0430\u0446\u0438\u044f' },
  'phase.restructuring.desc': { en: 'Cognitive defusion, ACT metaphors, anti-spectatoring', ro: 'Defuziune cognitiv\u0103, metafore ACT, anti-spectatoring', ru: '\u041a\u043e\u0433\u043d\u0438\u0442\u0438\u0432\u043d\u0430\u044f \u0434\u0435\u0444\u0443\u0437\u0438\u044f, \u043c\u0435\u0442\u0430\u0444\u043e\u0440\u044b ACT' },
  'phase.consolidation': { en: 'Consolidation', ro: 'Consolidare', ru: '\u041a\u043e\u043d\u0441\u043e\u043b\u0438\u0434\u0430\u0446\u0438\u044f' },
  'phase.consolidation.desc': { en: 'Values-based living, self-compassion, identity separation', ro: 'Via\u021b\u0103 bazat\u0103 pe valori, auto-compasiune, separarea identit\u0103\u021bii', ru: '\u0416\u0438\u0437\u043d\u044c \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u0446\u0435\u043d\u043d\u043e\u0441\u0442\u0435\u0439, \u0441\u0430\u043c\u043e\u0441\u043e\u0441\u0442\u0440\u0430\u0434\u0430\u043d\u0438\u0435' },
  'phase.maintenance': { en: 'Maintenance', ro: '\u00centre\u021binere', ru: '\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430' },
  'phase.maintenance.desc': { en: 'Integration, shorter sessions, gradual independence', ro: 'Integrare, sesiuni mai scurte, independen\u021b\u0103 gradual\u0103', ru: '\u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f, \u043a\u043e\u0440\u043e\u0442\u043a\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438, \u043f\u043e\u0441\u0442\u0435\u043f\u0435\u043d\u043d\u0430\u044f \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c' },

  // Features
  'feat.audio': { en: 'Guided Audio Sessions', ro: 'Sesiuni audio ghidate', ru: '\u0410\u0443\u0434\u0438\u043e \u0441\u0435\u0441\u0441\u0438\u0438 \u0441 \u0433\u0438\u0434\u043e\u043c' },
  'feat.audio.desc': { en: 'Professionally crafted therapeutic audio with research-backed male voices. Morning, visualization, and evening sessions tailored to each treatment phase.', ro: 'Audio terapeutic profesional cu voci masculine validate \u0219tiin\u021bific. Sesiuni de diminea\u021b\u0103, vizualizare \u0219i sear\u0103 adaptate fiec\u0103rei faze de tratament.', ru: '\u041f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0430\u0443\u0434\u0438\u043e. \u0423\u0442\u0440\u0435\u043d\u043d\u0438\u0435, \u0432\u0438\u0437\u0443\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0435 \u0438 \u0432\u0435\u0447\u0435\u0440\u043d\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438.' },
  'feat.techniques': { en: 'Evidence-Based Techniques', ro: 'Tehnici bazate pe dovezi', ru: '\u041c\u0435\u0442\u043e\u0434\u044b \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u0434\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432' },
  'feat.techniques.desc': { en: 'ACT, MBSR, CBT, and polyvagal theory integrated into an 8-week progressive program.', ro: 'ACT, MBSR, CBT \u0219i teoria polyvagal\u0103 integrate \u00eentr-un program progresiv de 8 s\u0103pt\u0103m\u00e2ni.', ru: 'ACT, MBSR, CBT \u0438 \u043f\u043e\u043b\u0438\u0432\u0430\u0433\u0430\u043b\u044c\u043d\u0430\u044f \u0442\u0435\u043e\u0440\u0438\u044f \u0432 8-\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u043e\u0439 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0435.' },
  'feat.mood': { en: 'Mood Tracking & Analytics', ro: 'Monitorizare \u0219i analiz\u0103', ru: '\u041e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u044f' },
  'feat.mood.desc': { en: 'Patients report tension, rumination, and mood after each session. Therapists see real-time trends.', ro: 'Pacien\u021bii raporteaz\u0103 tensiunea, ruminarea \u0219i dispozi\u021bia dup\u0103 fiecare sesiune. Terapeut\u0163ii v\u0103d tendin\u021bele \u00een timp real.', ru: '\u041f\u0430\u0446\u0438\u0435\u043d\u0442\u044b \u043e\u0442\u043c\u0435\u0447\u0430\u044e\u0442 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0435, \u0440\u0443\u043c\u0438\u043d\u0430\u0446\u0438\u044e \u0438 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 \u043f\u043e\u0441\u043b\u0435 \u043a\u0430\u0436\u0434\u043e\u0439 \u0441\u0435\u0441\u0441\u0438\u0438.' },
  'feat.secure': { en: 'Private & Secure', ro: 'Privat \u0219i sigur', ru: '\u041a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e \u0438 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e' },
  'feat.secure.desc': { en: 'Patient data is isolated with row-level security. No data sharing, no tracking.', ro: 'Datele pacien\u021bilor sunt izolate cu securitate la nivel de r\u00e2nd. F\u0103r\u0103 partajare, f\u0103r\u0103 tracking.', ru: '\u0414\u0430\u043d\u043d\u044b\u0435 \u043f\u0430\u0446\u0438\u0435\u043d\u0442\u043e\u0432 \u0438\u0437\u043e\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u044b. \u0411\u0435\u0437 \u043e\u0431\u043c\u0435\u043d\u0430 \u0434\u0430\u043d\u043d\u044b\u043c\u0438, \u0431\u0435\u0437 \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u043d\u0438\u044f.' },
  'feat.dashboard': { en: 'Therapist Dashboard', ro: 'Panou terapeut', ru: '\u041f\u0430\u043d\u0435\u043b\u044c \u0442\u0435\u0440\u0430\u043f\u0435\u0432\u0442\u0430' },
  'feat.dashboard.desc': { en: 'Assign programs to patients, monitor adherence, view mood trajectories.', ro: 'Asigneaz\u0103 programe pacien\u021bilor, monitorizeaz\u0103 complian\u021ba, vezi traiectoriile dispozi\u021biei.', ru: '\u041d\u0430\u0437\u043d\u0430\u0447\u0430\u0439\u0442\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b, \u043e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u0439\u0442\u0435 \u0441\u043e\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435, \u0441\u043c\u043e\u0442\u0440\u0438\u0442\u0435 \u0442\u0440\u0435\u043d\u0434\u044b.' },
  'feat.offline': { en: 'Works Offline', ro: 'Func\u021bioneaz\u0103 offline', ru: '\u0420\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043e\u0444\u0444\u043b\u0430\u0439\u043d' },
  'feat.offline.desc': { en: 'Installs as a native app. Audio cached for offline playback. Mood data syncs when back online.', ro: 'Se instaleaz\u0103 ca aplica\u021bie nativ\u0103. Audio cache-uit offline. Datele se sincronizeaz\u0103 la reconectare.', ru: '\u0423\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043a\u0430\u043a \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435. \u0410\u0443\u0434\u0438\u043e \u043a\u044d\u0448\u0438\u0440\u0443\u0435\u0442\u0441\u044f. \u0414\u0430\u043d\u043d\u044b\u0435 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u043f\u0440\u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0438.' },

  // Auth
  'auth.welcome': { en: 'Welcome back', ro: 'Bine ai revenit', ru: '\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c' },
  'auth.create': { en: 'Create Account', ro: 'Creeaz\u0103 cont', ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442' },
  'auth.email': { en: 'Email', ro: 'Email', ru: 'Email' },
  'auth.password': { en: 'Password', ro: 'Parol\u0103', ru: '\u041f\u0430\u0440\u043e\u043b\u044c' },
  'auth.name': { en: 'Full Name', ro: 'Nume complet', ru: '\u041f\u043e\u043b\u043d\u043e\u0435 \u0438\u043c\u044f' },
  'auth.therapist': { en: 'Therapist', ro: 'Terapeut', ru: '\u0422\u0435\u0440\u0430\u043f\u0435\u0432\u0442' },
  'auth.patient': { en: 'Patient', ro: 'Pacient', ru: '\u041f\u0430\u0446\u0438\u0435\u043d\u0442' },
  'auth.signIn': { en: 'Sign In', ro: 'Autentificare', ru: '\u0412\u043e\u0439\u0442\u0438' },
  'auth.signingIn': { en: 'Signing in...', ro: 'Se autentific\u0103...', ru: '\u0412\u0445\u043e\u0434...' },
  'auth.creating': { en: 'Creating...', ro: 'Se creeaz\u0103...', ru: '\u0421\u043e\u0437\u0434\u0430\u043d\u0438\u0435...' },
  'auth.noAccount': { en: 'No account?', ro: 'Nu ai cont?', ru: '\u041d\u0435\u0442 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430?' },
  'auth.haveAccount': { en: 'Have an account?', ro: 'Ai cont?', ru: '\u0415\u0441\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?' },
  'auth.register': { en: 'Register', ro: '\u00cenregistrare', ru: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f' },

  // Patient
  'patient.today': { en: "Today's Sessions", ro: 'Sesiunile de azi', ru: '\u0421\u0435\u0433\u043e\u0434\u043d\u044f\u0448\u043d\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438' },
  'patient.morning': { en: 'Morning Session', ro: 'Sesiune diminea\u021b\u0103', ru: '\u0423\u0442\u0440\u0435\u043d\u043d\u044f\u044f \u0441\u0435\u0441\u0441\u0438\u044f' },
  'patient.visualization': { en: 'Visualization', ro: 'Vizualizare', ru: '\u0412\u0438\u0437\u0443\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f' },
  'patient.evening': { en: 'Evening Session', ro: 'Sesiune sear\u0103', ru: '\u0412\u0435\u0447\u0435\u0440\u043d\u044f\u044f \u0441\u0435\u0441\u0441\u0438\u044f' },
  'patient.completed': { en: 'completed', ro: 'completate', ru: '\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e' },
  'patient.howFeel': { en: 'How do you feel?', ro: 'Cum te sim\u021bi?', ru: '\u041a\u0430\u043a \u0432\u044b \u0441\u0435\u0431\u044f \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442\u0435?' },
  'patient.rateState': { en: 'Rate your current state after the session', ro: 'Evalueaz\u0103-\u021bi starea actual\u0103 dup\u0103 sesiune', ru: '\u041e\u0446\u0435\u043d\u0438\u0442\u0435 \u0441\u0432\u043e\u0451 \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u043f\u043e\u0441\u043b\u0435 \u0441\u0435\u0441\u0441\u0438\u0438' },
  'patient.tension': { en: 'Internal Tension', ro: 'Tensiune intern\u0103', ru: '\u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435\u0435 \u043d\u0430\u043f\u0440\u044f\u0436\u0435\u043d\u0438\u0435' },
  'patient.rumination': { en: 'Rumination', ro: 'Ruminare', ru: '\u0420\u0443\u043c\u0438\u043d\u0430\u0446\u0438\u044f' },
  'patient.mood': { en: 'Mood', ro: 'Dispozi\u021bie', ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435' },
  'patient.relaxed': { en: 'Relaxed', ro: 'Relaxat', ru: '\u0420\u0430\u0441\u0441\u043b\u0430\u0431\u043b\u0435\u043d' },
  'patient.tense': { en: 'Tense', ro: '\u00cencordat', ru: '\u041d\u0430\u043f\u0440\u044f\u0436\u0451\u043d' },
  'patient.clearMind': { en: 'Clear mind', ro: 'Minte limpede', ru: '\u042f\u0441\u043d\u044b\u0439 \u0443\u043c' },
  'patient.overthinking': { en: 'Overthinking', ro: 'Supra-g\u00e2ndire', ru: '\u0418\u0437\u043b\u0438\u0448\u043d\u0435\u0435 \u043e\u0431\u0434\u0443\u043c\u044b\u0432\u0430\u043d\u0438\u0435' },
  'patient.low': { en: 'Low', ro: 'Sc\u0103zut', ru: '\u041d\u0438\u0437\u043a\u043e\u0435' },
  'patient.great': { en: 'Great', ro: 'Excelent', ru: '\u041e\u0442\u043b\u0438\u0447\u043d\u043e' },
  'patient.save': { en: 'Save & Complete', ro: 'Salveaz\u0103', ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c' },
  'patient.sessionComplete': { en: 'Session Complete', ro: 'Sesiune complet\u0103', ru: '\u0421\u0435\u0441\u0441\u0438\u044f \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u0430' },
  'patient.backSessions': { en: 'Back to sessions', ro: '\u00cenapoi la sesiuni', ru: '\u041d\u0430\u0437\u0430\u0434 \u043a \u0441\u0435\u0441\u0441\u0438\u044f\u043c' },
  'patient.week': { en: 'Week', ro: 'S\u0103pt\u0103m\u00e2na', ru: '\u041d\u0435\u0434\u0435\u043b\u044f' },
  'patient.day': { en: 'Day', ro: 'Ziua', ru: '\u0414\u0435\u043d\u044c' },
} as const

type TransKey = keyof typeof translations

let currentLang: Lang = (typeof localStorage !== 'undefined' && localStorage.getItem('mindvox_lang') as Lang) || 'en'

export function setLang(lang: Lang) {
  currentLang = lang
  if (typeof localStorage !== 'undefined') localStorage.setItem('mindvox_lang', lang)
}

export function getLang(): Lang {
  return currentLang
}

export function t(key: TransKey, vars?: Record<string, string>): string {
  const entry = translations[key]
  if (!entry) return key
  let text: string = entry[currentLang] || entry.en
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v)
    }
  }
  return text
}
