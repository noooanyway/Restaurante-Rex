import { TOTP, Secret } from 'otpauth';
import { SignJWT, jwtVerify } from 'jose';
const encoder = new TextEncoder();
export async function issueAdminSession(env, code) {
 if (!env.ADMIN_TOTP_SECRET || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32 || !/^\d{6}$/.test(code || '')) return null;
 try {
  const totp = new TOTP({secret: Secret.fromBase32(env.ADMIN_TOTP_SECRET), algorithm:'SHA1', digits:6, period:30});
  if (totp.validate({token:code,window:1}) === null) return null;
  return await new SignJWT({scope:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuer('furna-admin').setAudience('furna-admin').setIssuedAt().setExpirationTime('15m').sign(encoder.encode(env.ADMIN_SESSION_SECRET));
 } catch { return null; }
}
export async function validAdminSession(env, token) {
 if (!env.ADMIN_TOTP_SECRET || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32 || !token) return false;
 try { const {payload} = await jwtVerify(token,encoder.encode(env.ADMIN_SESSION_SECRET),{algorithms:['HS256'],issuer:'furna-admin',audience:'furna-admin',maxTokenAge:'15m'}); return payload.scope==='admin'; } catch { return false; }
}
