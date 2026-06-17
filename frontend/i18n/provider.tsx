"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { dictionaries } from "./dictionaries";
import { Language } from "./types";

interface I18nContextData {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: (typeof dictionaries)[Language];
  isReady: boolean;
}

const I18nContext = createContext({} as I18nContextData);

const isValidLanguage = (value: string | null): value is Language => {
  return value === "en" || value === "pt";
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    const savedLanguage = localStorage.getItem("language");
    let nextLanguage: Language = "en";

    if (isValidLanguage(savedLanguage)) {
      nextLanguage = savedLanguage;
    } else {
      const browserLanguage = navigator.language.toLowerCase();

      if (browserLanguage.startsWith("pt")) {
        nextLanguage = "pt";
      }
    }

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      setLanguageState(nextLanguage);
      setIsReady(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    document.documentElement.lang = language;
  }, [isReady, language]);

  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000`;
    document.documentElement.lang = newLanguage;
    setLanguageState(newLanguage);
  };

  const dictionary = useMemo(() => dictionaries[language], [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dictionary,
        isReady,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
