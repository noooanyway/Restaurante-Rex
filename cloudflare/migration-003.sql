CREATE TABLE IF NOT EXISTS notification_outbox (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 reservation_id TEXT NOT NULL,
 event TEXT NOT NULL CHECK(event IN ('pending','approved','rejected','cancelled','changed')),
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 sent_at INTEGER,
 attempts INTEGER NOT NULL DEFAULT 0,
 next_attempt_at INTEGER NOT NULL DEFAULT (unixepoch()),
 last_error TEXT
);
CREATE INDEX IF NOT EXISTS outbox_pending ON notification_outbox(sent_at,next_attempt_at);
CREATE TRIGGER IF NOT EXISTS outbox_reservation_created AFTER INSERT ON reservations WHEN NEW.status='pending' BEGIN INSERT INTO notification_outbox(reservation_id,event) VALUES(NEW.id,'pending'); END;
CREATE TRIGGER IF NOT EXISTS outbox_reservation_status AFTER UPDATE OF status ON reservations WHEN OLD.status<>NEW.status AND NEW.status IN ('approved','rejected','cancelled') BEGIN INSERT INTO notification_outbox(reservation_id,event) VALUES(NEW.id,NEW.status); END;
CREATE TRIGGER IF NOT EXISTS outbox_reservation_changed AFTER UPDATE OF date,time,people ON reservations WHEN OLD.date<>NEW.date OR OLD.time<>NEW.time OR OLD.people<>NEW.people BEGIN INSERT INTO notification_outbox(reservation_id,event) VALUES(NEW.id,'changed'); END;
