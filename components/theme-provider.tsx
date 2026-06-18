'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/store';
import { themes, getThemeById, ThemeId, ThemeConfig, getThemeStyles } from '@/lib/themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Moon, Sun, Palette } from 'lucide-react';

// Theme context for accessing current theme config throughout the app
interface ThemeContextValue {
  themeId: ThemeId;
  config: ThemeConfig;
  styles: ThemeConfig['styles'];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { themeId: 'safari' as ThemeId, config: themes[0], styles: themes[0].styles };
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeId, darkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const config = getThemeById(themeId) || themes[0];
  const styles = getThemeStyles(themeId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;

    // Remove all theme data attributes
    html.removeAttribute('data-theme');

    // Apply current theme
    if (themeId !== 'safari') {
      html.setAttribute('data-theme', themeId);
    }

    // Apply dark mode
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Set theme style data attributes for CSS targeting
    html.setAttribute('data-card-style', styles.cardStyle);
    html.setAttribute('data-header-style', styles.headerStyle);
    html.setAttribute('data-button-style', styles.buttonStyle);
    html.setAttribute('data-layout-style', styles.layoutStyle);
    html.setAttribute('data-hero-style', styles.heroStyle);
    html.setAttribute('data-font-style', styles.fontStyle);
  }, [themeId, darkMode, mounted, styles]);

  const contextValue: ThemeContextValue = {
    themeId,
    config,
    styles,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Compact Theme switcher for header
export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { themeId, setThemeId, darkMode, toggleDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themeList: { id: ThemeId; name: string; colors: string[] }[] = [
    { id: 'safari', name: 'Safari', colors: ['#8B5A2B', '#4A7C59'] },
    { id: 'ocean', name: 'Ocean', colors: ['#1E6091', '#2E8B8B'] },
    { id: 'kilimanjaro', name: 'Kilimanjaro', colors: ['#C41E3A', '#E8A317'] },
    { id: 'serengeti', name: 'Serengeti', colors: ['#228B22', '#DAA520'] },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {themeList.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setThemeId(theme.id)}
            title={theme.name}
            className={cn(
              'flex gap-0.5 p-1.5 rounded-md border transition-all',
              themeId === theme.id
                ? 'border-primary bg-primary/10'
                : 'border-transparent hover:border-border'
            )}
          >
            {theme.colors.map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </button>
        ))}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-md border border-transparent hover:border-border transition-all"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {themeList.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setThemeId(theme.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
            themeId === theme.id
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          )}
        >
          <div className="flex gap-1">
            {theme.colors.map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{theme.name}</span>
        </button>
      ))}
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-all"
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        <span className="text-sm font-medium">{darkMode ? 'Light' : 'Dark'}</span>
      </button>
    </div>
  );
}

// Full Developer Theme Panel with all controls
export function DeveloperThemePanel() {
  const { themeId, setThemeId, darkMode, setDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const currentTheme = getThemeById(themeId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div>
            <h4 className="font-medium mb-3">Select Theme Design</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Each theme has completely different visual styles, layouts, and design patterns
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all text-left',
                    themeId === theme.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {/* Preview colors */}
                  <div className="flex gap-2 mb-3">
                    {Object.entries(theme.preview).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-8 h-8 rounded-lg mb-1"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {key}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Theme info */}
                  <p className="font-semibold">{theme.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {theme.description}
                  </p>

                  {/* Style badges */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {theme.styles.cardStyle} cards
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {theme.styles.buttonStyle} buttons
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {theme.styles.heroStyle} hero
                    </Badge>
                  </div>

                  {themeId === theme.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode */}
          <div>
            <h4 className="font-medium mb-3">Color Mode</h4>
            <div className="flex gap-2">
              <Button
                variant={!darkMode ? 'default' : 'outline'}
                onClick={() => setDarkMode(false)}
                className="flex-1 gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={darkMode ? 'default' : 'outline'}
                onClick={() => setDarkMode(true)}
                className="flex-1 gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>

          {/* Current Theme Details */}
          {currentTheme && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Current Theme Styles</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Cards:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.cardStyle}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Header:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.headerStyle}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Buttons:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.buttonStyle}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Layout:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.layoutStyle}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Hero:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.heroStyle}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Font:</span>
                  <span className="font-medium capitalize">{currentTheme.styles.fontStyle}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
