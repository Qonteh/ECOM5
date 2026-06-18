// Theme definitions for Soko Tanzania E-commerce
// Each theme has completely different visual styles and layouts
export type ThemeId = 'safari' | 'ocean' | 'kilimanjaro' | 'serengeti';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
  // Visual style configurations
  styles: {
    cardStyle: 'rounded' | 'sharp' | 'soft' | 'glass';
    headerStyle: 'minimal' | 'bold' | 'classic' | 'modern';
    buttonStyle: 'rounded' | 'pill' | 'square' | 'soft';
    layoutStyle: 'grid' | 'masonry' | 'list' | 'cards';
    heroStyle: 'centered' | 'split' | 'fullwidth' | 'minimal';
    fontStyle: 'modern' | 'classic' | 'bold' | 'elegant';
  };
}

export const themes: ThemeConfig[] = [
  {
    id: 'safari',
    name: 'Safari',
    description: 'Warm earth tones with rounded, friendly design',
    preview: {
      primary: '#8B5A2B',
      secondary: '#D4A574',
      accent: '#4A7C59',
    },
    styles: {
      cardStyle: 'rounded',
      headerStyle: 'modern',
      buttonStyle: 'rounded',
      layoutStyle: 'grid',
      heroStyle: 'centered',
      fontStyle: 'modern',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blues with glass morphism effects',
    preview: {
      primary: '#1E6091',
      secondary: '#A8D8EA',
      accent: '#2E8B8B',
    },
    styles: {
      cardStyle: 'glass',
      headerStyle: 'minimal',
      buttonStyle: 'pill',
      layoutStyle: 'masonry',
      heroStyle: 'split',
      fontStyle: 'elegant',
    },
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    description: 'Bold and modern with sharp contrasts',
    preview: {
      primary: '#C41E3A',
      secondary: '#FFD700',
      accent: '#E8A317',
    },
    styles: {
      cardStyle: 'sharp',
      headerStyle: 'bold',
      buttonStyle: 'square',
      layoutStyle: 'cards',
      heroStyle: 'fullwidth',
      fontStyle: 'bold',
    },
  },
  {
    id: 'serengeti',
    name: 'Serengeti',
    description: 'Vibrant African colors with soft, organic shapes',
    preview: {
      primary: '#228B22',
      secondary: '#FFB347',
      accent: '#DAA520',
    },
    styles: {
      cardStyle: 'soft',
      headerStyle: 'classic',
      buttonStyle: 'soft',
      layoutStyle: 'list',
      heroStyle: 'minimal',
      fontStyle: 'classic',
    },
  },
];

export const themeDataAttributes: Record<ThemeId, string | null> = {
  safari: null,
  ocean: 'ocean',
  kilimanjaro: 'kilimanjaro',
  serengeti: 'serengeti',
};

export function getThemeById(id: ThemeId): ThemeConfig | undefined {
  return themes.find((t) => t.id === id);
}

export function getThemeStyles(id: ThemeId) {
  const theme = getThemeById(id);
  return theme?.styles || themes[0].styles;
}
