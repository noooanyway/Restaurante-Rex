INSERT INTO reservations(id,date,time,name,phone,people,children,babies,chair,message,status,table_ids) VALUES
('teste-aprovar','2030-01-08','12:00','Cliente Teste','900000001',4,0,0,0,'','pending','[1]'),
('teste-recusar','2030-01-08','12:00','Cliente Teste','900000002',4,0,0,0,'','pending','[2]'),
('teste-cancelar','2030-01-08','12:00','Cliente Teste','900000003',4,0,0,0,'','approved','[3]');

UPDATE reservations SET expires_at=unixepoch()+3600 WHERE status='pending';
