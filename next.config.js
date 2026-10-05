const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  reactStrictMode: true,
  // next-i18next loads these files at runtime, so ensure Vercel includes them
  // in every server-rendered function produced by output file tracing.
  outputFileTracingIncludes: {
    '/*': ['./next-i18next.config.js', './public/locales/**/*.json'],
  },
  // Required by Next i18n with API routes, otherwise API routes 404 when fetching without trailing slash
  trailingSlash: true
}
