/** POST /api/mokejimas/stripe – Stripe webhook (Stripe → Developers → Webhooks → šis adresas) */
import { json, loadCatalog, type Ctx } from '../../../src/server/shop/env.ts';
import { notifyPaid } from '../../../src/server/shop/notify.ts';
import { verifyStripeSignature } from '../../../src/server/shop/stripe.ts';

interface StripeEvent {
  type: string;
  livemode: boolean;
  data: {
    object: {
      payment_status?: string;
      amount_total?: number;
      client_reference_id?: string;
      metadata?: { order_no?: string };
      customer_email?: string;
      customer_details?: { email?: string };
    };
  };
}

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!env.STRIPE_WEBHOOK_SECRET) return new Response('Not configured', { status: 404 });
  const body = await request.text();
  if (!(await verifyStripeSignature(env.STRIPE_WEBHOOK_SECRET, request.headers.get('stripe-signature'), body))) {
    return new Response('Bad signature', { status: 400 });
  }
  const event = JSON.parse(body) as StripeEvent;
  const s = event.data?.object ?? {};
  const paid =
    (event.type === 'checkout.session.completed' && s.payment_status === 'paid') || event.type === 'checkout.session.async_payment_succeeded';

  if (paid) {
    try {
      const catalog = await loadCatalog(request, env);
      await notifyPaid(env, catalog, {
        orderNo: s.metadata?.order_no ?? s.client_reference_id ?? '?',
        amount: s.amount_total ?? 0,
        provider: 'Stripe',
        email: s.customer_details?.email ?? s.customer_email,
        test: !event.livemode,
      });
    } catch (e) {
      console.error('Stripe pranešimo klaida', e);
      return new Response('Retry', { status: 500 });
    }
  }
  return json({ received: true });
};
