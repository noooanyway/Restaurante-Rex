CREATE TABLE IF NOT EXISTS gmail_outbox (
 id INTEGER PRIMARY KEY AUTOINCREMENT, reservation_id TEXT NOT NULL, event TEXT NOT NULL,
 payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()), next_attempt_at INTEGER NOT NULL DEFAULT (unixepoch()),
 sent_at INTEGER, last_error TEXT
);
CREATE INDEX IF NOT EXISTS gmail_outbox_queue ON gmail_outbox(state,next_attempt_at,id);
DROP TRIGGER IF EXISTS outbox_reservation_created;
DROP TRIGGER IF EXISTS outbox_reservation_status;
DROP TRIGGER IF EXISTS outbox_reservation_changed;
CREATE TRIGGER IF NOT EXISTS gmail_created AFTER INSERT ON reservations WHEN NEW.status='pending' BEGIN
 INSERT INTO gmail_outbox(reservation_id,event,payload) SELECT NEW.id,'pending',json_object('id',NEW.id,'date',NEW.date,'time',NEW.time,'people',NEW.people,'email',NEW.email,'status',NEW.status) WHERE 1=1;
 INSERT INTO gmail_outbox(reservation_id,event,payload) SELECT NEW.id,'receipt',json_object('id',NEW.id,'date',NEW.date,'time',NEW.time,'people',NEW.people,'email',NEW.email,'status',NEW.status) WHERE NEW.email IS NOT NULL AND NEW.email<>'';
END;
CREATE TRIGGER IF NOT EXISTS gmail_status AFTER UPDATE OF status ON reservations WHEN OLD.status<>NEW.status AND NEW.status IN ('approved','rejected','cancelled') BEGIN
 INSERT INTO gmail_outbox(reservation_id,event,payload) SELECT NEW.id,NEW.status,json_object('id',NEW.id,'date',NEW.date,'time',NEW.time,'people',NEW.people,'email',NEW.email,'status',NEW.status) WHERE NEW.email IS NOT NULL AND NEW.email<>'';
END;
CREATE TRIGGER IF NOT EXISTS gmail_changed AFTER UPDATE OF date,time,people ON reservations WHEN NEW.status IN ('pending','approved') AND (OLD.date<>NEW.date OR OLD.time<>NEW.time OR OLD.people<>NEW.people) BEGIN
 INSERT INTO gmail_outbox(reservation_id,event,payload) SELECT NEW.id,'changed',json_object('id',NEW.id,'date',NEW.date,'time',NEW.time,'people',NEW.people,'email',NEW.email,'status',NEW.status) WHERE NEW.email IS NOT NULL AND NEW.email<>'';
END;
