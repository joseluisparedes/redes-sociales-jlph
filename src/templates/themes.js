/**
 * ==============================================================================
 * SISTEMA DE TEMAS VISUALES DINÁMICOS & PALETAS EJECUTIVAS
 * ==============================================================================
 * Define 6 estilos cromáticos diferenciados para garantizar que ninguna
 * publicación tenga el mismo fondo o apariencia visual.
 */

const THEMES = {
  midnight_cyan: {
    id: "midnight_cyan",
    name: "Midnight Cyan (Estándar Tech)",
    bgDark: "#030712",
    bgCard: "rgba(15, 23, 42, 0.85)",
    bgCardElevated: "rgba(30, 41, 59, 0.7)",
    primaryAccent: "#06B6D4",      // Cyan
    secondaryAccent: "#3B82F6",    // Blue
    accentGlow: "rgba(6, 182, 212, 0.25)",
    textMain: "#F8FAFC",
    textMuted: "#94A3B8",
    gradientHero: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #0B1120 100%)",
    badgeColor: "#06B6D4",
    badgeBg: "rgba(6, 182, 212, 0.12)"
  },
  cyber_emerald: {
    id: "cyber_emerald",
    name: "Cyber Emerald (Arquitectura & Cloud)",
    bgDark: "#020B06",
    bgCard: "rgba(6, 28, 18, 0.85)",
    bgCardElevated: "rgba(10, 46, 30, 0.7)",
    primaryAccent: "#10B981",      // Emerald
    secondaryAccent: "#06B6D4",    // Cyan
    accentGlow: "rgba(16, 185, 129, 0.25)",
    textMain: "#F0FDF4",
    textMuted: "#86EFAC",
    gradientHero: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), linear-gradient(180deg, #020B06 0%, #071E12 100%)",
    badgeColor: "#10B981",
    badgeBg: "rgba(16, 185, 129, 0.14)"
  },
  obsidian_gold: {
    id: "obsidian_gold",
    name: "Obsidian Gold (Liderazgo & Enterprise)",
    bgDark: "#0B0904",
    bgCard: "rgba(28, 22, 10, 0.85)",
    bgCardElevated: "rgba(45, 36, 16, 0.7)",
    primaryAccent: "#F59E0B",      // Amber / Gold
    secondaryAccent: "#E11D48",    // Rose
    accentGlow: "rgba(245, 158, 11, 0.25)",
    textMain: "#FFFBEB",
    textMuted: "#FDE68A",
    gradientHero: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16) 0%, transparent 50%), linear-gradient(180deg, #0B0904 0%, #1A1408 100%)",
    badgeColor: "#F59E0B",
    badgeBg: "rgba(245, 158, 11, 0.14)"
  },
  quantum_violet: {
    id: "quantum_violet",
    name: "Quantum Violet (IA & Deep Tech)",
    bgDark: "#06030F",
    bgCard: "rgba(22, 12, 42, 0.85)",
    bgCardElevated: "rgba(38, 20, 72, 0.7)",
    primaryAccent: "#A855F7",      // Purple
    secondaryAccent: "#EC4899",    // Pink
    accentGlow: "rgba(168, 85, 247, 0.25)",
    textMain: "#FAF5FF",
    textMuted: "#D8B4FE",
    gradientHero: "linear-gradient(135deg, #A855F7 0%, #EC4899 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), linear-gradient(180deg, #06030F 0%, #140828 100%)",
    badgeColor: "#A855F7",
    badgeBg: "rgba(168, 85, 247, 0.14)"
  },
  graphite_titanium: {
    id: "graphite_titanium",
    name: "Graphite Titanium (Minimalista Industrial)",
    bgDark: "#0A0D14",
    bgCard: "rgba(20, 27, 40, 0.85)",
    bgCardElevated: "rgba(35, 47, 70, 0.7)",
    primaryAccent: "#38BDF8",      // Sky Blue
    secondaryAccent: "#94A3B8",    // Slate
    accentGlow: "rgba(56, 189, 248, 0.25)",
    textMain: "#FFFFFF",
    textMuted: "#CBD5E1",
    gradientHero: "linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0A0D14 0%, #141C2E 100%)",
    badgeColor: "#38BDF8",
    badgeBg: "rgba(56, 189, 248, 0.14)"
  },
  crimson_defense: {
    id: "crimson_defense",
    name: "Crimson Defense (Ciberseguridad & Resiliencia)",
    bgDark: "#0D0406",
    bgCard: "rgba(32, 10, 16, 0.85)",
    bgCardElevated: "rgba(54, 16, 26, 0.7)",
    primaryAccent: "#F43F5E",      // Rose / Crimson
    secondaryAccent: "#FB7185",    // Light Rose
    accentGlow: "rgba(244, 63, 94, 0.25)",
    textMain: "#FFF1F2",
    textMuted: "#FECDD3",
    gradientHero: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.18) 0%, transparent 50%), linear-gradient(180deg, #0D0406 0%, #200810 100%)",
    badgeColor: "#F43F5E",
    badgeBg: "rgba(244, 63, 94, 0.14)"
  }
};

const THEME_KEYS = Object.keys(THEMES);

function getTheme(themeKey) {
  return THEMES[themeKey] || THEMES.midnight_cyan;
}

function getRandomTheme() {
  const randomKey = THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
  return THEMES[randomKey];
}

function getAllThemes() {
  return THEMES;
}

module.exports = {
  THEMES,
  THEME_KEYS,
  getTheme,
  getRandomTheme,
  getAllThemes
};
