export const requiredEnv = [
  'MONGODB_URI',
  'PORT',
  'FRONTED_URL',
  'SECRET_KEY_ACCESS_TOKEN',
  'SECRET_KEY_REFRESH_TOKEN',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NODE_ENV',
];

export const validateRequiredEnv = (envNames = requiredEnv) => {
  const missing = envNames.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default validateRequiredEnv;
