CREATE TABLE IF NOT EXISTS dining_tables (id INTEGER PRIMARY KEY, seats INTEGER NOT NULL CHECK(seats > 0), active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, date TEXT NOT NULL, time TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, people INTEGER NOT NULL, children INTEGER NOT NULL DEFAULT 0, babies INTEGER NOT NULL DEFAULT 0, chair INTEGER NOT NULL DEFAULT 0, message TEXT NOT NULL DEFAULT '', status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','cancelled')), table_ids TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS reservations_by_date ON reservations(date,time,status);
INSERT OR IGNORE INTO dining_tables (id,seats) VALUES (1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4),(9,4),(10,4),(11,4),(12,4);
