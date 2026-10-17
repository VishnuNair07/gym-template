export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Enterprise",
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
  NODE_ENV: process.env.NODE_ENV,
};
