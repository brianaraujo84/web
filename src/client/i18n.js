import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18n instance by passing i18n down to react-i18next
const i18Instance = i18n.use(initReactI18next);

/**
 * Helper function to configure the i18n instance with language code and 
 * translations
 * @param {string} languageCode the language code e.g en-US
 * @param {Map[string]string} translation map of key/value pairs of translations
 */
const setupI18n = (languageCode, translation) => {
  i18Instance.init({
    resources: {
      [languageCode]: { translation },
    },
    lng: languageCode,
    fallbackLng: 'en-US',
    keySeparator: '|',
    nsSeparator: '~',
    interpolation: {
      escapeValue: false
    }
  });
};

// Grab locale data rendered by nodejs server (see src/server/express.js:113)
const localeEl = document.getElementById('language-translations-data');
const { locale, data } = { ...(JSON.parse(localeEl.innerHTML) || {}) };
setupI18n(locale, data);

export default i18n;

