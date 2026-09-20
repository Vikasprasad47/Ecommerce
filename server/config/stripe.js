import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

const Stripe = stripe(stripeSecretKey);

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
export default Stripe;
