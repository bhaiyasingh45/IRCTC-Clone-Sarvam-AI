// Sends the booking / cancellation e-mails through Gmail SMTP (nodemailer).
// Credentials live only here (GMAIL_USER, GMAIL_APP_PASSWORD — see the example env file). The RECIPIENT is fixed
// by server config (MAIL_TO), never taken from the browser, so this endpoint cannot be used to mail other people.
// MAIL_DRY_RUN=1 writes the message to ./mail-outbox/ instead of sending, to preview the formatting.

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { bookingEmail, cancellationEmail } from './mailTemplates.js';

const str = (v, max = 80) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const num = (v) => (v !== null && v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) < 1e7 ? Math.round(Number(v)) : null);
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');

// Only these fields, only these shapes, ever reach a template.
function cleanCommon(p) {
  if (!p || typeof p !== 'object') throw new Error('bad payload');
  const t = p.train || {};
  const out = {
    pnr: str(p.pnr, 10),
    train: { number: str(t.number, 8), name: str(t.name), source: str(t.source), destination: str(t.destination), departure: str(t.departure, 8), arrival: str(t.arrival, 8), duration: str(t.duration, 12) },
    travelDate: str(p.travelDate, 10),
    class: str(p.class, 3),
    quota: str(p.quota, 20),
    bookedAt: str(p.bookedAt, 40),
    passengers: (Array.isArray(p.passengers) ? p.passengers : []).slice(0, 6).map((x) => ({ name: str(x?.name, 60), age: num(x?.age), gender: str(x?.gender, 1), berth: str(x?.berth, 2) })),
  };
  if (!/^\d{10}$/.test(out.pnr) || !out.train.name || !out.train.source || !out.train.destination || !isDate(out.travelDate) || out.passengers.length === 0 || out.passengers.some((x) => !x.name || x.age === null)) {
    throw new Error('invalid booking data');
  }
  return out;
}

export function cleanBooking(p) {
  const out = cleanCommon(p);
  const f = p.fare || {};
  out.fare = { base: num(f.base), reservation: num(f.reservation), gst: num(f.gst), total: num(f.total) };
  if (Object.values(out.fare).some((x) => x === null)) throw new Error('invalid fare');
  out.contact = /^\d{10}$/.test(p.contact || '') ? p.contact : '';
  return out;
}

export function cleanCancellation(p) {
  const out = cleanCommon(p);
  const r = p.refund || {};
  out.refund = { paid: num(r.paid), reservationFee: num(r.reservationFee), charge: num(r.charge), refund: num(r.refund), chargeReason: str(r.chargeReason, 200) };
  if (Object.values(out.refund).some((x) => x === null)) throw new Error('invalid refund');
  out.cancelledAt = str(p.cancelledAt, 40);
  return out;
}

const user = () => (process.env.GMAIL_USER || '').trim();
const pass = () => (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, ''); // Google shows it as "abcd efgh ijkl mnop"
// MAIL_TO is optional. A value that is not an e-mail address (a leftover placeholder, a typo) must not stop the
// mail: it is ignored and the message goes to GMAIL_USER, with a one-time warning in the log.
const EMAIL_OK = /^[^\s@"'<>,;]+@[^\s@"'<>,;]+\.[^\s@"'<>,;]+$/;
let warnedBadMailTo = false;
const recipient = () => {
  const to = (process.env.MAIL_TO || '').trim();
  if (to && EMAIL_OK.test(to)) return to;
  if (to && !warnedBadMailTo) { warnedBadMailTo = true; console.warn('[mail] MAIL_TO is not a valid e-mail address — ignoring it and sending to GMAIL_USER. Delete the MAIL_TO line to silence this.'); }
  return user();
};
const dryRun = () => /^(1|true|yes)$/i.test(process.env.MAIL_DRY_RUN || '');

const EMAIL_RE = /^[^\s@"'<>,;]+@[^\s@"'<>,;]+\.[^\s@"'<>,;]+$/;

// Yes/no facts only — never the values — so a misconfiguration can be diagnosed without exposing secrets.
export const mailStatus = () => ({
  configured: Boolean((user() && pass()) || dryRun()),
  dryRun: dryRun(),
  checks: {
    gmailUserSet: Boolean(user()),
    gmailUserLooksLikeEmail: EMAIL_RE.test(user()),
    appPasswordSet: Boolean(pass()),
    appPasswordLooksLike16Letters: /^[a-z]{16}$/i.test(pass()), // Google app passwords are 16 letters
    mailToSet: Boolean((process.env.MAIL_TO || '').trim()),
    mailToIgnoredBecauseInvalid: Boolean((process.env.MAIL_TO || '').trim()) && !EMAIL_OK.test((process.env.MAIL_TO || '').trim()),
    recipientLooksLikeEmail: EMAIL_RE.test(recipient()),
  },
});

// Plain-language reason for an SMTP failure (code only — nothing from the credentials).
export function mailFailureHint(err) {
  const c = mailStatus().checks;
  if (err.code === 'EAUTH') return 'Gmail rejected the login. Use a 16-letter App Password (2-Step Verification must be on), not your normal password.';
  if (err.code === 'EENVELOPE') {
    if (!c.gmailUserLooksLikeEmail) return 'GMAIL_USER is not a valid e-mail address.';
    return 'The mail server refused the sender or recipient address.';
  }
  if (['ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EDNS'].includes(err.code)) return 'Could not reach smtp.gmail.com (network/firewall).';
  return 'Could not send the e-mail.';
}

const mask = (email) => email.replace(/^(.).*(@.*)$/, (_, a, d) => `${a}***${d}`);

let transport;
function getTransport() {
  const port = Number(process.env.SMTP_PORT || 465);
  transport ??= nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465, auth: { user: user(), pass: pass() } });
  return transport;
}

export async function sendMail(kind, data) {
  const { subject, html, text } = kind === 'booking' ? bookingEmail(data) : cancellationEmail(data);
  const to = recipient();
  if (dryRun()) {
    const dir = fileURLToPath(new URL('../mail-outbox/', import.meta.url));
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}${kind}-${data.pnr}.html`, html);
    await writeFile(`${dir}${kind}-${data.pnr}.txt`, `Subject: ${subject}\nTo: ${to || '(MAIL_TO not set)'}\n\n${text}`);
    return { to: to ? mask(to) : '(dry run)', dryRun: true };
  }
  if (!user() || !pass()) throw Object.assign(new Error('mail not configured'), { status: 503 });
  await getTransport().sendMail({ from: { name: process.env.MAIL_FROM_NAME || 'IRCTC Demo', address: user() }, to, subject, text, html });
  return { to: mask(to), dryRun: false };
}
