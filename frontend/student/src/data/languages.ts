export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  // { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  // { code: "brx", name: "Bodo", nativeName: "बोड़ो" },
  // { code: "doi", name: "Dogri", nativeName: "डोगरी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  // { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
  // { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
  // { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  // { code: "mni", name: "Manipuri (Meitei)", nativeName: "মৈতৈলোন্" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  // { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  // { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  // { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
  // { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
];

export type LanguageCode = (typeof languages)[number]["code"];
