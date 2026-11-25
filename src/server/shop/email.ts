/**
 * El. laiškai per Resend (https://resend.com – nemokamai iki 3000 laiškų per mėnesį).
 * Reikia: RESEND_API_KEY ir ORDER_EMAIL_FROM (siuntėjo domenas patvirtinamas Resend → Domains).
 */
import { emailEnabled, type Env } from './env.ts';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const html = (text: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0a2233;white-space:pre-wrap">${text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')}</div>`;

export async function sendMail(env: Env, mail: Mail): Promise<void> {
  if (!emailEnabled(env)) throw new Error('El. laiškai neįjungti');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.ORDER_EMAIL_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: html(mail.text),
      ...(mail.replyTo && { reply_to: mail.replyTo }),
    }),
  });
  if (!res.ok) throw new Error(`Resend klaida ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
