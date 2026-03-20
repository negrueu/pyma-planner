# Workflow-uri n8n — Planner Casablanca

## Credențiale necesare (pyma.ke2.in)
- **Notion**: D6qP687CXFnJ59C8 (PYMA)
- **Telegram**: IhU3cGTl1F9Qv4Sk (CSB_bot)

## Workflow-uri de creat manual în n8n:

### 1. Reminder Planificare (zilnic 08:00)
- Schedule Trigger → 08:00 zilnic
- Notion Query: Data < azi+30 zile AND Fază IN (Cerere nouă, Ofertă trimisă, Contract semnat)
- IF rezultate > 0 → Telegram: listă evenimente neplanificate

### 2. Reminder Confirmare (zilnic 08:00)
- Schedule Trigger → 08:00 zilnic
- Notion Query: Data < azi+7 zile AND nrPersConfirmate is_empty
- IF rezultate > 0 → Telegram: listă evenimente neconfirmate

### 3. Raport Săptămânal (luni 07:00)
- Schedule Trigger → luni 07:00
- Notion Query: evenimente săptămâna curentă
- Notion Query: count per fază (pipeline)
- Telegram: tabel formatat

### 4. Alertă Avans (zilnic)
- Schedule Trigger → 09:00 zilnic
- Notion Query: Fază = Contract semnat AND Avans = 0 sau gol
- IF rezultate > 0 → Telegram: listă fără avans

### 5. Briefing Zilnic (zilnic 07:00)
- Schedule Trigger → 07:00 zilnic
- Notion Query: evenimente azi + mâine
- Telegram: rezumat formatat

### 6. Google Calendar Sync (webhook)
- Webhook Trigger → apelat din app la creare/update
- Google Calendar: create/update event

## Chat ID Telegram
- Necesar: chat ID-ul lui Paul pe Telegram (se obține cu /getUpdates pe bot)

## Configurare
Toate workflow-urile se creează manual în https://pyma.ke2.in
Credențialele Telegram (CSB_bot) și Notion (PYMA) sunt deja configurate.
