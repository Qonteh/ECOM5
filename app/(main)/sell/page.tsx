"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  X,
  MapPin,
  DollarSign,
  FileText,
  Tag,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { categories, regions } from "@/lib/data";
import { useThemeStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Step = "category" | "details" | "images" | "location" | "review";

interface FormData {
  categoryId: string;
  subcategoryId: string;
  title: string;
  description: string;
  price: string;
  negotiable: boolean;
  condition: "new" | "used" | "refurbished";
  images: string[];
  region: string;
  district: string;
  location: string;
}

const initialFormData: FormData = {
  categoryId: "",
  subcategoryId: "",
  title: "",
  description: "",
  price: "",
  negotiable: true,
  condition: "used",
  images: [],
  region: "",
  district: "",
  location: "",
};

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: "category", title: "Category", icon: <Tag className="w-5 h-5" /> },
  { id: "details", title: "Details", icon: <FileText className="w-5 h-5" /> },
  { id: "images", title: "Photos", icon: <Camera className="w-5 h-5" /> },
  { id: "location", title: "Location", icon: <MapPin className="w-5 h-5" /> },
  { id: "review", title: "Review", icon: <CheckCircle className="w-5 h-5" /> },
];

export default function SellPage() {
  const router = useRouter();
  const { themeId } = useThemeStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (currentStep) {
      case "category":
        if (!formData.categoryId)
          newErrors.categoryId = "Please select a category";
        break;
      case "details":
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (formData.title.length < 10)
          newErrors.title = "Title must be at least 10 characters";
        if (!formData.description.trim())
          newErrors.description = "Description is required";
        if (formData.description.length < 20)
          newErrors.description = "Description must be at least 20 characters";
        if (!formData.price) newErrors.price = "Price is required";
        if (isNaN(Number(formData.price)) || Number(formData.price) < 0)
          newErrors.price = "Please enter a valid price";
        break;
      case "images":
        // Images are optional for now
        break;
      case "location":
        if (!formData.region) newErrors.region = "Please select a region";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would call the API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: user?.id || "demo-user",
          category_id: formData.categoryId,
          subcategory_id: formData.subcategoryId || null,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          condition: formData.condition,
          price_negotiable: formData.negotiable,
          region: formData.region,
          district: formData.district,
          location_address: formData.location,
          images: formData.images,
        }),
      });

      if (response.ok) {
        // Redirect to success page or listing
        router.push("/seller?posted=true");
      } else {
        throw new Error("Failed to create listing");
      }
    } catch {
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDemoImage = () => {
    const demoImages = [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    ];
    if (formData.images.length < 10) {
      const randomImage =
        demoImages[Math.floor(Math.random() * demoImages.length)];
      setFormData({ ...formData, images: [...formData.images, randomImage] });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div
        className={cn(
          "border-b border-border",
          themeId === "safari" && "bg-muted/30",
          themeId === "ocean" &&
            "bg-gradient-to-r from-primary/5 via-background to-accent/5",
          themeId === "kilimanjaro" && "bg-foreground text-background",
          themeId === "serengeti" &&
            "bg-gradient-to-br from-primary/5 to-accent/5",
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    themeId === "kilimanjaro" &&
                      "text-background hover:bg-background/10",
                  )}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1
                  className={cn(
                    "text-xl font-bold",
                    themeId === "kilimanjaro" && "uppercase tracking-tight",
                  )}
                >
                  Post Your Ad
                </h1>
                <p
                  className={cn(
                    "text-sm text-muted-foreground",
                    themeId === "kilimanjaro" && "text-background/60",
                  )}
                >
                  Reach thousands of buyers across Tanzania
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition-colors",
                index <= currentStepIndex
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
              onClick={() => {
                if (index < currentStepIndex) {
                  setCurrentStep(step.id);
                }
              }}
              disabled={index > currentStepIndex}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  index < currentStepIndex &&
                    "bg-primary border-primary text-primary-foreground",
                  index === currentStepIndex && "border-primary text-primary",
                  index > currentStepIndex &&
                    "border-muted text-muted-foreground",
                  themeId === "kilimanjaro" && "rounded-none",
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="hidden sm:block">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Category */}
          {currentStep === "category" && (
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <CardTitle>Select a Category</CardTitle>
                <CardDescription>
                  Choose the category that best fits your item
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errors.categoryId && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{errors.categoryId}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={cn(
                        "p-4 border-2 text-left transition-all hover:border-primary",
                        formData.categoryId === category.id &&
                          "border-primary bg-primary/5",
                        themeId === "safari" && "rounded-xl",
                        themeId === "ocean" && "rounded-xl",
                        themeId === "kilimanjaro" && "rounded-none",
                        themeId === "serengeti" && "rounded-2xl",
                      )}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          categoryId: category.id,
                          subcategoryId: "",
                        })
                      }
                    >
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.nameSwahili}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="mt-6">
                    <Label className="mb-3 block">Subcategory (Optional)</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.subcategories.map((sub) => (
                        <Badge
                          key={sub.id}
                          variant={
                            formData.subcategoryId === sub.id
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "cursor-pointer",
                            themeId === "kilimanjaro" && "rounded-none",
                          )}
                          onClick={() =>
                            setFormData({ ...formData, subcategoryId: sub.id })
                          }
                        >
                          {sub.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Details */}
          {currentStep === "details" && (
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
                <CardDescription>
                  Provide details about your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 14 Pro Max 256GB - Brand New"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={cn(
                      errors.title && "border-destructive",
                      themeId === "kilimanjaro" && "rounded-none",
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail. Include features, condition, reason for selling, etc."
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={cn(
                      errors.description && "border-destructive",
                      themeId === "kilimanjaro" && "rounded-none",
                    )}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (TZS) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={cn(
                        "pl-9",
                        errors.price && "border-destructive",
                        themeId === "kilimanjaro" && "rounded-none",
                      )}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          negotiable: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="negotiable"
                      className="text-sm cursor-pointer"
                    >
                      Price is negotiable
                    </Label>
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-3">
                  <Label>Condition *</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value: "new" | "used" | "refurbished") =>
                      setFormData({ ...formData, condition: value })
                    }
                    className="flex flex-wrap gap-4"
                  >
                    {[
                      { value: "new", label: "Brand New" },
                      { value: "used", label: "Used" },
                      { value: "refurbished", label: "Refurbished" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label
                          htmlFor={option.value}
                          className="cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Images */}
          {currentStep === "images" && (
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <CardTitle>Add Photos</CardTitle>
                <CardDescription>
                  Add up to 10 photos. The first photo will be the main image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Image grid */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative aspect-square bg-muted overflow-hidden",
                        themeId === "safari" && "rounded-lg",
                        themeId === "ocean" && "rounded-xl",
                        themeId === "kilimanjaro" && "rounded-none",
                        themeId === "serengeti" && "rounded-xl",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 text-xs">
                          Main
                        </Badge>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-6 h-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  {formData.images.length < 10 && (
                    <button
                      className={cn(
                        "aspect-square border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors",
                        themeId === "safari" && "rounded-lg",
                        themeId === "ocean" && "rounded-xl",
                        themeId === "kilimanjaro" && "rounded-none",
                        themeId === "serengeti" && "rounded-xl",
                      )}
                      onClick={addDemoImage}
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Add Photo</span>
                    </button>
                  )}
                </div>

                <Alert>
                  <Camera className="w-4 h-4" />
                  <AlertDescription>
                    For demo purposes, click &quot;Add Photo&quot; to add sample
                    images. In a real app, you would upload your own photos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Location */}
          {currentStep === "location" && (
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where is the item located?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Region */}
                <div className="space-y-2">
                  <Label>Region *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) =>
                      setFormData({ ...formData, region: value })
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        errors.region && "border-destructive",
                        themeId === "kilimanjaro" && "rounded-none",
                      )}
                    >
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-xs text-destructive">{errors.region}</p>
                  )}
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label>District / Area (Optional)</Label>
                  <Input
                    placeholder="e.g., Kinondoni, Ilala, Temeke"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className={cn(themeId === "kilimanjaro" && "rounded-none")}
                  />
                </div>

                {/* Specific location */}
                <div className="space-y-2">
                  <Label>Specific Location (Optional)</Label>
                  <Input
                    placeholder="e.g., Near Mlimani City Mall"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className={cn(themeId === "kilimanjaro" && "rounded-none")}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review */}
          {currentStep === "review" && (
            <Card
              className={cn(
                themeId === "safari" && "rounded-xl",
                themeId === "ocean" && "rounded-2xl",
                themeId === "kilimanjaro" && "rounded-none border-2",
                themeId === "serengeti" && "rounded-3xl",
              )}
            >
              <CardHeader>
                <CardTitle>Review Your Listing</CardTitle>
                <CardDescription>
                  Make sure everything looks good before posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview */}
                <div className="space-y-4">
                  {formData.images.length > 0 && (
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-2xl font-bold text-primary">
                      TZS {Number(formData.price).toLocaleString()}
                    </p>
                    <h3 className="text-xl font-semibold mt-1">
                      {formData.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {formData.condition}
                    </Badge>
                    {formData.negotiable && (
                      <Badge variant="outline">Negotiable</Badge>
                    )}
                    <Badge variant="secondary">{selectedCategory?.name}</Badge>
                  </div>

                  <p className="text-muted-foreground">
                    {formData.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {formData.location && `${formData.location}, `}
                    {formData.district && `${formData.district}, `}
                    {formData.region}
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Your listing will be reviewed and published within 24 hours.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={cn(themeId === "kilimanjaro" && "rounded-none")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === "review" ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  themeId === "kilimanjaro" &&
                    "rounded-none uppercase font-bold",
                )}
              >
                {isSubmitting ? "Posting..." : "Post Ad"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={cn(
                  themeId === "kilimanjaro" &&
                    "rounded-none uppercase font-bold",
                )}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
