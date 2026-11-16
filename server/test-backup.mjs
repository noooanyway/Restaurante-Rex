import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
const root=mkdtempSync(join(tmpdir(),'furna-backup-'));const file=join(root,'live.sqlite');const db=new DatabaseSync(file);db.exec('CREATE TABLE example (value TEXT); INSERT INTO example VALUES (\'reserva-teste\');');db.close();
const child=spawn(process.execPath,['server/backup.mjs'],{env:{...process.env,BOOKING_DB:file,BACKUP_DIR:join(root,'backups')},stdio:'pipe'});const code=await new Promise(r=>child.on('exit',r));assert.equal(code,0);const saved=join(root,'backups',readdirSync(join(root,'backups'))[0]);const restored=new DatabaseSync(saved,{readOnly:true});assert.equal(restored.prepare('SELECT value FROM example').get().value,'reserva-teste');restored.close();rmSync(root,{recursive:true,force:true});console.log('PASS: backup e leitura da cópia restaurada.');
