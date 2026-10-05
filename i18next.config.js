const { i18n } = require('./next-i18next.config')

module.exports = {
  locales: i18n.locales,
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'common',
    primaryLanguage: i18n.defaultLocale,
    defaultValue: (key, _namespace, language) => (language === i18n.defaultLocale ? key : ''),
    keySeparator: false,
    nsSeparator: false,
    pluralSeparator: '——',
    contextSeparator: '——',
    sort: true,
    removeUnusedKeys: false,
  },
}
