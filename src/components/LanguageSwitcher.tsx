import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../utils/LanguageContext";
import { languageNames, Language } from "../utils/translations";

const languageFlags: Record<Language, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  nl: "🇳🇱",
  es: "🇪🇸",
  pt: "🇵🇹",
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition shadow-sm"
      >
        <span className="text-2xl">{languageFlags[language]}</span>
        <span className="text-sm font-semibold text-gray-700">
          {languageNames[language]}
        </span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[180px]">
          {Object.entries(languageNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code as Language)}
              className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition ${
                language === code ? "bg-blue-50" : ""
              }`}
            >
              <span className="text-2xl">{languageFlags[code as Language]}</span>
              <span className="text-sm font-medium text-gray-700">{name}</span>
              {language === code && (
                <svg
                  className="w-4 h-4 text-blue-600 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

