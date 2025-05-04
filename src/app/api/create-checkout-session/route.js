// app/api/create-checkout-session/route.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { origin } = new URL(req.headers.get('referer'));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: 'price_1RLA7HIhGIAZVWvkD9V3Y3ZB', // replace with your Stripe Price ID
        quantity: 1,
      }],
      success_url: `${origin}/?paid=true`,
      cancel_url: `${origin}/`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
