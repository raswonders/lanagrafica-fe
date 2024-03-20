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
          login: {
            title: "Sign in",
            username: "Username",
            password: "Password",
            submit: "Sign in",
          },
          newMember: {
            trigger: "Add new member",
            title: "New member",
            submit: "Create member",
            nameFieldLabel: "First name",
            surnameFieldLabel: "Surname",
            dateFieldLabel: "Place of birth",
            docIdFieldLabel: "Document ID",
            emailFieldLabel: "Email",
            countryFieldLabel: "Country of origin",
            cityFieldLabel: "Place of birth",
            docTypeFieldLabel: "Document type",
          },
          validation: {
            required: "is required",
          },
          combobox: {
            noItems: "No item found.",
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
          login: {
            title: "Accedi",
            username: "Nome utente",
            password: "Password",
            submit: "Accedi",
          },
          newMember: {
            trigger: "Aggiungi nuovo membro",
            title: "Nuovo membro",
            submit: "Crea membro",
            nameFieldLabel: "Nome",
            surnameFieldLabel: "Cognome",
            dateFieldLabel: "Luogo di nascita",
            docIdFieldLabel: "ID documento",
            emailFieldLabel: "Email",
            countryFieldLabel: "Paese di origine",
            cityFieldLabel: "Luogo di nascita",
            docTypeFieldLabel: "Tipo di documento",
          },
          validation: {
            required: "è richiesto",
          },
          combobox: {
            noItems: "No item found.",
          },
        },
      },
    },
  });

export default i18n;
