// SQLite online backup: safe with a running WAL database. Destination must be private.
import { DatabaseSync, backup } from 'node:sqlite';
import { mkdir, chmod } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const source=process.env.BOOKING_DB;
const destination=process.env.BACKUP_DIR;
if(!source||!destination)throw new Error('Defina BOOKING_DB e BACKUP_DIR.');
const dir=resolve(destination);await mkdir(dir,{recursive:true,mode:0o700});
const output=join(dir,`furna-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);
const db=new DatabaseSync(resolve(source),{readOnly:true});
try{await backup(db,output);await chmod(output,0o600);const verify=new DatabaseSync(output,{readOnly:true});try{if(verify.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw new Error('Cópia inválida');}finally{verify.close();}console.log('Cópia criada e verificada:',output);}finally{db.close();}
