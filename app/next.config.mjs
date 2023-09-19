/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["zh_Hant_HK"],
    defaultLocale: "zh_Hant_HK",
  },

  images: {
    domains: ["bhfxofyfiivgltozmejg.supabase.co"],
  },

  env: {
    SUPABASE_URL: process.env.SUPABASE_URL ?? '',
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY ?? '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
  }
};

export default config;
