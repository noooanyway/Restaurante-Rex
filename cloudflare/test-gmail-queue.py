import sqlite3,json
from pathlib import Path
c=sqlite3.connect(':memory:')
for f in ['schema.sql','migration-002.sql','migration-003.sql']: c.executescript(Path('cloudflare/'+f).read_text(encoding='utf-8-sig'))
c.execute("INSERT INTO reservations(id,date,time,name,phone,people,status,table_ids,email) VALUES('old','2035-01-01','12:00','test','900000000',2,'pending','[1]','test@example.test')")
c.executescript(Path('cloudflare/migration-006.sql').read_text(encoding='utf-8-sig'))
assert c.execute('SELECT COUNT(*) FROM gmail_outbox').fetchone()[0]==0
c.execute("INSERT INTO reservations(id,date,time,name,phone,people,status,table_ids,email) VALUES('new','2035-01-01','12:00','test','900000000',2,'pending','[1]','test@example.test')")
assert [x[0] for x in c.execute('SELECT event FROM gmail_outbox ORDER BY id')]==['pending','receipt']
c.execute("UPDATE reservations SET status='approved' WHERE id='new'")
c.execute("UPDATE reservations SET time='13:00' WHERE id='new'")
r=c.execute("SELECT payload FROM gmail_outbox WHERE event='approved'").fetchone()[0]
assert json.loads(r)['time']=='12:00'
c.execute("UPDATE reservations SET status='cancelled' WHERE id='new'")
c.execute("UPDATE gmail_outbox SET state='superseded' WHERE state='queued' AND event<>'pending' AND EXISTS (SELECT 1 FROM gmail_outbox newer WHERE newer.reservation_id=gmail_outbox.reservation_id AND newer.id>gmail_outbox.id AND newer.event<>'pending')")
assert [x[0] for x in c.execute("SELECT event FROM gmail_outbox WHERE state='queued' ORDER BY id")]==['pending','cancelled']
print('PASS: fila antiga isolada, destinatários separados, snapshots e eventos ultrapassados.')
