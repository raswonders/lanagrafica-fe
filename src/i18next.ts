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
            addMember: "Add member",
          },
          account: {
            logout: "Log out",
            language: "Language",
            lang: {
              it: "Italian",
              en: "English",
            },
            theme: "Theme",
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
            dateFieldLabel: "Date of birth",
            docIdFieldLabel: "Document ID",
            emailFieldLabel: "Email",
            countryFieldLabel: "Country of origin",
            cityFieldLabel: "Place of birth",
            docTypeFieldLabel: "Document type",
          },
          members: {
            title: "Members",
          },
          home: {
            title: "Home",
          },
          validation: {
            required: "is required",
            wrongDate: "is invalid date",
            notAdult: "not an adult",
            notInRange: "cannot be less than 0 or more than 120 years old",
          },
          combobox: {
            noItems: "No item found.",
            commandPlaceholder: "Search items...",
            buttonPlaceholder: "Select city",
          },
          dateField: {
            day: "day",
            month: "month",
            year: "year",
          },
          selectField: {
            placeholder: "Select document",
          },
          membersTable: {
            name: "Name",
            email: "Email",
            birthDate: "Date of birth",
            suspendedTill: "Suspended till",
            cardNumber: "Card no.",
            expirationDate: "Expires",
            status: "Status",
            active: "active",
            inactive: "inactive",
          },
        },
      },
      it: {
        translation: {
          navbar: {
            home: "Casa",
            members: "Membri",
            cards: "Carte",
            addMember: "Aggiungi membro",
          },
          account: {
            logout: "Esci",
            language: "Lingua",
            lang: {
              it: "Italiano",
              en: "Inglese",
            },
            theme: "Tema",
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
            dateFieldLabel: "Data di nascita",
            docIdFieldLabel: "ID documento",
            emailFieldLabel: "Email",
            countryFieldLabel: "Paese di origine",
            cityFieldLabel: "Luogo di nascita",
            docTypeFieldLabel: "Tipo di documento",
          },
          members: {
            title: "Membri",
          },
          home: {
            title: "Casa",
          },
          validation: {
            required: "è richiesto",
            wrongDate: "è una data non valida",
            notAdult: "non un adulto",
            notInRange: "non può essere inferiore a 0 o superiore a 120 anni",
          },
          combobox: {
            noItems: "Nessun elemento trovato.",
            commandPlaceholder: "Cerca elementi...",
            buttonPlaceholder: "Seleziona posto",
          },
          dateField: {
            day: "giorno",
            month: "mese",
            year: "anno",
          },
          selectField: {
            placeholder: "Seleziona documento",
          },
          membersTable: {
            name: "Nome",
            email: "Email",
            birthDate: "Data di nascita",
            suspendedTill: "Sospeso fino a",
            cardNumber: "No. carta",
            expirationDate: "Scade",
            status: "Stato",
            active: "Attivo",
            inactive: "Inattivo",
          },
        },
      },
    },
  });

export default i18n;
