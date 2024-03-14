import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          navbar: {
            home: "Home",
            members: "Members",
            cards: "Cards",
          },
          account: {
            logout: "Log out",
            language: "Language",
            lang: {
              it: "Italian",
              en: "English",
            },
          },
        },
      },
      it: {
        translation: {
          navbar: {
            home: "Casa",
            members: "Membri",
            cards: "Carte",
          },
          account: {
            logout: "Esci",
            language: "Lingua",
            lang: {
              it: "Italiano",
              en: "Inglese",
            },
          },
        },
      },
    },
  });

export default i18n;
