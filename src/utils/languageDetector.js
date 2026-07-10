const LANG_MAP = {
  hi: { code: 'hi-IN', name: 'Hindi',    label: 'हिंदी'   },
  bn: { code: 'bn-IN', name: 'Bengali',  label: 'বাংলা'   },
  pa: { code: 'pa-IN', name: 'Punjabi',  label: 'ਪੰਜਾਬੀ'  },
  gu: { code: 'gu-IN', name: 'Gujarati', label: 'ગુજરાતી' },
  en: { code: 'en-IN', name: 'English',  label: 'English'  },
};

export const DEFAULT_LANG = LANG_MAP.hi;

export function detectLanguage(text) {
  if (!text) return DEFAULT_LANG;

  const counts = { hi: 0, bn: 0, pa: 0, gu: 0, en: 0 };
  for (const char of text) {
    const cp = char.codePointAt(0);
    if (cp >= 0x0900 && cp <= 0x097F) counts.hi++;
    else if (cp >= 0x0980 && cp <= 0x09FF) counts.bn++;
    else if (cp >= 0x0A00 && cp <= 0x0A7F) counts.pa++;
    else if (cp >= 0x0A80 && cp <= 0x0AFF) counts.gu++;
    else if ((cp >= 0x41 && cp <= 0x5A) || (cp >= 0x61 && cp <= 0x7A)) counts.en++;
  }

  const indicTotal = counts.hi + counts.bn + counts.pa + counts.gu;
  // If there are Indic chars, they win over Latin regardless of count
  if (indicTotal === 0 && counts.en === 0) return DEFAULT_LANG;

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return LANG_MAP[dominant] || DEFAULT_LANG;
}
