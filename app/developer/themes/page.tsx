"use client";

import { useState } from "react";
import {
  Palette,
  Check,
  Moon,
  Sun,
  Eye,
  Settings2,
  Paintbrush,
  LayoutGrid,
  Type,
  Sparkles,
  Save,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/lib/store";
import { themes, ThemeId, ThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Extended theme design options
interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "modern" | "classic" | "minimal" | "bold";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "small" | "medium" | "large";
  };
  layout: {
    cardStyle: string;
    buttonStyle: string;
    spacing: string;
    borderRadius: string;
  };
}

const designTemplates: DesignTemplate[] = [
  {
    id: "tanzania-safari",
    name: "Tanzania Safari",
    description: "Warm earth tones inspired by the African savanna",
    preview: "/themes/safari-preview.jpg",
    category: "modern",
    colors: {
      primary: "#8B5A2B",
      secondary: "#D4A574",
      accent: "#4A7C59",
      background: "#FDFBF7",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "medium",
    },
    layout: {
      cardStyle: "rounded",
      buttonStyle: "rounded",
      spacing: "comfortable",
      borderRadius: "12px",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Cool coastal blues with glass morphism effects",
    preview: "/themes/ocean-preview.jpg",
    category: "modern",
    colors: {
      primary: "#1E6091",
      secondary: "#A8D8EA",
      accent: "#2E8B8B",
      background: "#F0F8FF",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "medium",
    },
    layout: {
      cardStyle: "glass",
      buttonStyle: "pill",
      spacing: "relaxed",
      borderRadius: "16px",
    },
  },
  {
    id: "kilimanjaro-bold",
    name: "Kilimanjaro Bold",
    description: "High contrast dark theme with bold accents",
    preview: "/themes/kili-preview.jpg",
    category: "bold",
    colors: {
      primary: "#C41E3A",
      secondary: "#FFD700",
      accent: "#E8A317",
      background: "#1A1A1A",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "large",
    },
    layout: {
      cardStyle: "sharp",
      buttonStyle: "square",
      spacing: "tight",
      borderRadius: "0px",
    },
  },
  {
    id: "serengeti-natural",
    name: "Serengeti Natural",
    description: "Organic greens with soft, natural shapes",
    preview: "/themes/serengeti-preview.jpg",
    category: "classic",
    colors: {
      primary: "#228B22",
      secondary: "#FFB347",
      accent: "#DAA520",
      background: "#FFFEF7",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "medium",
    },
    layout: {
      cardStyle: "soft",
      buttonStyle: "soft",
      spacing: "comfortable",
      borderRadius: "20px",
    },
  },
  {
    id: "zanzibar-tropical",
    name: "Zanzibar Tropical",
    description: "Vibrant tropical colors with island vibes",
    preview: "/themes/zanzibar-preview.jpg",
    category: "bold",
    colors: {
      primary: "#00A693",
      secondary: "#FF6B6B",
      accent: "#FFE66D",
      background: "#FFFFFF",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "medium",
    },
    layout: {
      cardStyle: "rounded",
      buttonStyle: "pill",
      spacing: "comfortable",
      borderRadius: "16px",
    },
  },
  {
    id: "stone-town",
    name: "Stone Town Heritage",
    description: "Elegant heritage design with classic typography",
    preview: "/themes/stone-preview.jpg",
    category: "classic",
    colors: {
      primary: "#5D4E37",
      secondary: "#C4A77D",
      accent: "#8B7355",
      background: "#FAF8F5",
    },
    typography: {
      headingFont: "Geist",
      bodyFont: "Geist",
      scale: "medium",
    },
    layout: {
      cardStyle: "soft",
      buttonStyle: "rounded",
      spacing: "relaxed",
      borderRadius: "8px",
    },
  },
];

export default function ThemeDesignPage() {
  const { themeId, setThemeId, darkMode, setDarkMode } = useThemeStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(themeId);
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Custom theme state
  const [customColors, setCustomColors] = useState({
    primary: "#8B5A2B",
    secondary: "#D4A574",
    accent: "#4A7C59",
    background: "#FFFFFF",
  });

  const [customLayout, setCustomLayout] = useState({
    cardStyle: "rounded",
    buttonStyle: "rounded",
    spacing: "comfortable",
    borderRadius: "12",
  });

  const currentTheme = themes.find((t) => t.id === themeId);
  const selectedDesign = designTemplates.find((t) => t.id === selectedTemplate);

  const handleApplyTheme = async (templateId: string) => {
    setIsSaving(true);

    // Map template to theme ID
    const themeMapping: Record<string, ThemeId> = {
      "tanzania-safari": "safari",
      "ocean-breeze": "ocean",
      "kilimanjaro-bold": "kilimanjaro",
      "serengeti-natural": "serengeti",
      "zanzibar-tropical": "safari", // Map to closest
      "stone-town": "serengeti", // Map to closest
    };

    const newThemeId = themeMapping[templateId] || "safari";
    setThemeId(newThemeId);
    setSelectedTemplate(templateId);

    // Simulate API call to save theme preference
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    toast.success(
      `Theme "${designTemplates.find((t) => t.id === templateId)?.name}" applied successfully!`,
    );
  };

  const handleSaveCustomTheme = async () => {
    setIsSaving(true);

    // In production, this would save to the database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    toast.success("Custom theme saved successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Design & Theme Management
          </h1>
          <p className="text-muted-foreground">
            Customize your marketplace appearance with different design themes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            {isCustomizing ? "View Themes" : "Customize"}
          </Button>
        </div>
      </div>

      {/* Current Theme Status */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {currentTheme &&
                  Object.values(currentTheme.preview).map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
              <div>
                <p className="font-semibold">
                  Current Theme: {currentTheme?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTheme?.description}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Design Templates
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Paintbrush className="w-4 h-4 mr-2" />
            Custom Design
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Live Preview
          </TabsTrigger>
        </TabsList>

        {/* Design Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              All
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              Modern
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              Classic
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              Minimal
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              Bold
            </Badge>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designTemplates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg overflow-hidden",
                  selectedTemplate === template.id && "ring-2 ring-primary",
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Theme Preview */}
                <div
                  className="h-32 relative"
                  style={{ backgroundColor: template.colors.background }}
                >
                  {/* Mini Preview UI */}
                  <div
                    className="absolute inset-4 rounded-lg shadow-sm overflow-hidden"
                    style={{ backgroundColor: template.colors.background }}
                  >
                    {/* Header bar */}
                    <div
                      className="h-6 px-2 flex items-center gap-1"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      <div
                        className="w-8 h-2 rounded"
                        style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                      />
                      <div className="flex-1" />
                      <div
                        className="w-4 h-2 rounded"
                        style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                      />
                    </div>
                    {/* Content area */}
                    <div className="p-2 flex gap-2">
                      <div
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <div className="flex-1 space-y-1">
                        <div
                          className="h-2 w-3/4 rounded"
                          style={{
                            backgroundColor: template.colors.primary + "40",
                          }}
                        />
                        <div
                          className="h-2 w-1/2 rounded"
                          style={{
                            backgroundColor: template.colors.accent + "40",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.category}
                    </Badge>
                  </div>

                  {/* Color swatches */}
                  <div className="flex gap-1 mt-3">
                    {Object.values(template.colors)
                      .slice(0, 3)
                      .map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                          title={Object.keys(template.colors)[i]}
                        />
                      ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={
                      selectedTemplate === template.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyTheme(template.id);
                    }}
                    disabled={isSaving}
                  >
                    {isSaving && selectedTemplate === template.id ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : selectedTemplate === template.id ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {selectedTemplate === template.id
                      ? "Applied"
                      : "Apply Theme"}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Create Custom Theme Card */}
            <Card className="cursor-pointer border-dashed hover:border-primary hover:bg-primary/5 transition-all">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Create Custom Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Design your own unique marketplace appearance
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Design Tab */}
        <TabsContent value="customize" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="w-5 h-5" />
                  Colors
                </CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            primary: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customColors.primary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            primary: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            secondary: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customColors.secondary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            secondary: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            accent: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customColors.accent}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            accent: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={customColors.background}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            background: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={customColors.background}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            background: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-3">Preview</p>
                  <div className="flex gap-2">
                    <div
                      className="flex-1 h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: customColors.primary }}
                    >
                      Primary
                    </div>
                    <div
                      className="flex-1 h-16 rounded-lg flex items-center justify-center text-sm font-medium"
                      style={{ backgroundColor: customColors.secondary }}
                    >
                      Secondary
                    </div>
                    <div
                      className="flex-1 h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: customColors.accent }}
                    >
                      Accent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layout Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  Layout & Style
                </CardTitle>
                <CardDescription>Customize component styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Style</Label>
                  <Select
                    value={customLayout.cardStyle}
                    onValueChange={(value) =>
                      setCustomLayout((prev) => ({ ...prev, cardStyle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="sharp">Sharp</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Button Style</Label>
                  <Select
                    value={customLayout.buttonStyle}
                    onValueChange={(value) =>
                      setCustomLayout((prev) => ({
                        ...prev,
                        buttonStyle: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="pill">Pill</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Spacing</Label>
                  <Select
                    value={customLayout.spacing}
                    onValueChange={(value) =>
                      setCustomLayout((prev) => ({ ...prev, spacing: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tight">Tight</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius: {customLayout.borderRadius}px</Label>
                  <Input
                    type="range"
                    min="0"
                    max="24"
                    value={customLayout.borderRadius}
                    onChange={(e) =>
                      setCustomLayout((prev) => ({
                        ...prev,
                        borderRadius: e.target.value,
                      }))
                    }
                    className="cursor-pointer"
                  />
                </div>

                <Button
                  onClick={handleSaveCustomTheme}
                  className="w-full mt-4"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Custom Theme
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    See how your theme looks on different devices
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={
                      previewDevice === "desktop" ? "secondary" : "ghost"
                    }
                    size="sm"
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "tablet" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className={cn(
                    "border rounded-xl overflow-hidden bg-background transition-all",
                    previewDevice === "desktop" && "w-full max-w-4xl",
                    previewDevice === "tablet" && "w-[768px]",
                    previewDevice === "mobile" && "w-[375px]",
                  )}
                >
                  {/* Browser Chrome */}
                  <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-background rounded-md px-3 py-1 text-sm text-center text-muted-foreground">
                        soko-tanzania.vercel.app
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div
                    className="p-6 min-h-[500px]"
                    style={{
                      background: selectedDesign
                        ? selectedDesign.colors.background
                        : "#fff",
                    }}
                  >
                    {/* Mock Header */}
                    <div
                      className="rounded-lg p-4 mb-6"
                      style={{
                        backgroundColor: selectedDesign?.colors.primary,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/20" />
                          <div className="text-white font-bold">
                            Soko Tanzania
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-20 h-8 rounded bg-white/20" />
                          <div className="w-8 h-8 rounded bg-white/20" />
                        </div>
                      </div>
                    </div>

                    {/* Mock Hero */}
                    <div className="text-center mb-8">
                      <h2
                        className="text-2xl font-bold mb-2"
                        style={{ color: selectedDesign?.colors.primary }}
                      >
                        Buy & Sell Anything in Tanzania
                      </h2>
                      <p className="text-muted-foreground mb-4">
                        {`Tanzania's largest online marketplace`}
                      </p>
                      <div className="flex justify-center gap-2">
                        <div
                          className="px-6 py-2 rounded-lg text-white"
                          style={{
                            backgroundColor: selectedDesign?.colors.primary,
                          }}
                        >
                          Start Selling
                        </div>
                        <div
                          className="px-6 py-2 rounded-lg border"
                          style={{
                            borderColor: selectedDesign?.colors.primary,
                            color: selectedDesign?.colors.primary,
                          }}
                        >
                          Browse
                        </div>
                      </div>
                    </div>

                    {/* Mock Product Grid */}
                    <div
                      className={cn(
                        "grid gap-4",
                        previewDevice === "mobile"
                          ? "grid-cols-2"
                          : "grid-cols-4",
                      )}
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="bg-card rounded-xl p-3 shadow-sm"
                          style={{
                            borderRadius: selectedDesign?.layout.borderRadius,
                            backgroundColor: "#fff",
                          }}
                        >
                          <div
                            className="aspect-square rounded-lg mb-2"
                            style={{
                              backgroundColor:
                                selectedDesign?.colors.secondary + "40",
                            }}
                          />
                          <div
                            className="text-sm font-semibold"
                            style={{ color: selectedDesign?.colors.primary }}
                          >
                            TZS 150,000
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Product {i}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
