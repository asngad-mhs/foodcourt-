export interface CulinaryVisualTheme {
  bgClass: string;
  accentColor: string;
  codeLabel: string;
  emojiIcon: string;
}

// Built-in resilient theme presets with zero external binary dependencies
// Guarantees 100% successful Cloudflare builds without 404 or missing static file errors
export const MENU_VISUAL_THEMES: Record<string, CulinaryVisualTheme> = {
  ayam_geprek: {
    bgClass: 'from-amber-900/90 via-stone-900/80 to-stone-950',
    accentColor: '#f59e0b',
    codeLabel: 'GEPREK KOREK',
    emojiIcon: '🍗',
  },
  mie_ayam_bakso: {
    bgClass: 'from-orange-900/90 via-stone-900/80 to-stone-950',
    accentColor: '#ea580c',
    codeLabel: 'MIE & BAKSO',
    emojiIcon: '🍜',
  },
  soto_lamongan: {
    bgClass: 'from-yellow-900/90 via-stone-900/80 to-stone-950',
    accentColor: '#eab308',
    codeLabel: 'SOTO KOYA',
    emojiIcon: '🍲',
  },
  kopi_gula_aren: {
    bgClass: 'from-stone-800 via-amber-950 to-stone-950',
    accentColor: '#d97706',
    codeLabel: 'KOPI AREN',
    emojiIcon: '☕',
  },
  nasi_pecel_mendoan: {
    bgClass: 'from-emerald-900 via-teal-950 to-slate-950',
    accentColor: '#10b981',
    codeLabel: 'PECEL KESUGIHAN',
    emojiIcon: '🥗',
  },
  paket_hemat_skripsi: {
    bgClass: 'from-emerald-800 via-emerald-950 to-slate-950',
    accentColor: '#34d399',
    codeLabel: 'PAKET SKRIPSI',
    emojiIcon: '🍱',
  },
  seblak_prasmanan: {
    bgClass: 'from-rose-900 via-red-950 to-stone-950',
    accentColor: '#f43f5e',
    codeLabel: 'SEBLAK PEDAS',
    emojiIcon: '🌶️',
  },
  es_teh_kampus: {
    bgClass: 'from-amber-800 via-stone-900 to-slate-950',
    accentColor: '#fbbf24',
    codeLabel: 'ES TEH JUMBO',
    emojiIcon: '🧊',
  },
  tempe_mendoan_hangat: {
    bgClass: 'from-yellow-800 via-amber-950 to-stone-950',
    accentColor: '#facc15',
    codeLabel: 'MENDOAN HANGAT',
    emojiIcon: '🥢',
  },
  nasi_goreng_kampus: {
    bgClass: 'from-orange-800 via-amber-950 to-stone-950',
    accentColor: '#fb923c',
    codeLabel: 'NASGOR MAWUT',
    emojiIcon: '🍳',
  },
  matcha_latte_dingin: {
    bgClass: 'from-teal-800 via-emerald-950 to-slate-950',
    accentColor: '#2dd4bf',
    codeLabel: 'MATCHA LATTE',
    emojiIcon: '🍵',
  },
  tahu_crispy_balado: {
    bgClass: 'from-amber-700 via-stone-900 to-stone-950',
    accentColor: '#f59e0b',
    codeLabel: 'TAHU CRISPY',
    emojiIcon: '🧆',
  },
};
