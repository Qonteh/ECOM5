"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  ImageIcon,
  Loader2,
  Info,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Building2,
  FileText,
  Tag,
  ShieldCheck,
  Sparkles,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { categories, regions } from "@/lib/data";
import { toast } from "sonner";

// Tanzania specific districts by region
const tanzaniaDistricts: Record<string, string[]> = {
  "Dar es Salaam": ["Ilala", "Kinondoni", "Temeke", "Ubungo", "Kigamboni"],
  Arusha: [
    "Arusha City",
    "Arusha District",
    "Karatu",
    "Longido",
    "Meru",
    "Monduli",
    "Ngorongoro",
  ],
  Dodoma: [
    "Dodoma Urban",
    "Bahi",
    "Chamwino",
    "Chemba",
    "Kondoa",
    "Kongwa",
    "Mpwapwa",
  ],
  Mwanza: [
    "Nyamagana",
    "Ilemela",
    "Kwimba",
    "Magu",
    "Misungwi",
    "Sengerema",
    "Ukerewe",
  ],
  Morogoro: [
    "Morogoro Urban",
    "Morogoro Rural",
    "Gairo",
    "Kilombero",
    "Kilosa",
    "Mvomero",
    "Ulanga",
  ],
  Tanga: [
    "Tanga City",
    "Handeni",
    "Kilindi",
    "Korogwe",
    "Lushoto",
    "Mkinga",
    "Muheza",
    "Pangani",
  ],
  Mbeya: ["Mbeya City", "Busokelo", "Chunya", "Kyela", "Mbarali", "Rungwe"],
  Zanzibar: [
    "Zanzibar Urban",
    "Zanzibar North",
    "Zanzibar South",
    "Pemba North",
    "Pemba South",
  ],
  Kilimanjaro: ["Moshi Urban", "Moshi Rural", "Hai", "Rombo", "Same", "Siha"],
  Iringa: ["Iringa Urban", "Iringa Rural", "Kilolo", "Mufindi"],
  Kagera: [
    "Bukoba Urban",
    "Bukoba Rural",
    "Biharamulo",
    "Karagwe",
    "Kyerwa",
    "Missenyi",
    "Muleba",
    "Ngara",
  ],
  Mtwara: [
    "Mtwara Urban",
    "Mtwara Rural",
    "Masasi",
    "Nanyumbu",
    "Newala",
    "Tandahimba",
  ],
  Lindi: [
    "Lindi Urban",
    "Lindi Rural",
    "Kilwa",
    "Liwale",
    "Nachingwea",
    "Ruangwa",
  ],
  Singida: [
    "Singida Urban",
    "Singida Rural",
    "Ikungi",
    "Iramba",
    "Manyoni",
    "Mkalama",
  ],
  Shinyanga: ["Shinyanga Urban", "Shinyanga Rural", "Kahama", "Kishapu"],
  Tabora: [
    "Tabora Urban",
    "Igunga",
    "Kaliua",
    "Nzega",
    "Sikonge",
    "Urambo",
    "Uyui",
  ],
  Rukwa: ["Sumbawanga Urban", "Sumbawanga Rural", "Kalambo", "Nkasi"],
  Kigoma: ["Kigoma Urban", "Buhigwe", "Kakonko", "Kasulu", "Kibondo", "Uvinza"],
  Pwani: [
    "Kibaha Urban",
    "Kibaha Rural",
    "Bagamoyo",
    "Kisarawe",
    "Mafia",
    "Mkuranga",
    "Rufiji",
  ],
  Ruvuma: [
    "Songea Urban",
    "Songea Rural",
    "Mbinga",
    "Namtumbo",
    "Nyasa",
    "Tunduru",
  ],
  Mara: [
    "Musoma Urban",
    "Musoma Rural",
    "Bunda",
    "Butiama",
    "Rorya",
    "Serengeti",
    "Tarime",
  ],
  Geita: ["Geita Urban", "Bukombe", "Chato", "Mbogwe", "Nyang'hwale"],
  Simiyu: ["Bariadi", "Busega", "Itilima", "Maswa", "Meatu"],
  Njombe: [
    "Njombe Urban",
    "Njombe Rural",
    "Ludewa",
    "Makambako",
    "Makete",
    "Wanging'ombe",
  ],
  Katavi: ["Mpanda Urban", "Mpanda Rural", "Mlele", "Nsimbo"],
  Songwe: ["Ileje", "Mbozi", "Momba", "Songwe"],
};

// Tanzania payment methods
const paymentMethods = [
  { id: "mpesa", name: "M-Pesa", description: "Vodacom mobile money" },
  { id: "tigopesa", name: "Tigo Pesa", description: "Tigo mobile money" },
  {
    id: "airtelmoney",
    name: "Airtel Money",
    description: "Airtel mobile money",
  },
  { id: "halopesa", name: "Halo Pesa", description: "Halotel mobile money" },
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct bank transfer (NMB, CRDB, NBC, etc.)",
  },
  { id: "cash", name: "Cash on Delivery", description: "Pay when you receive" },
  {
    id: "installment",
    name: "Lipa Pole Pole",
    description: "Pay in installments",
  },
];

// Shipping options
const shippingOptions = [
  {
    id: "pickup",
    name: "Pickup Only",
    description: "Buyer picks up from your location",
  },
  {
    id: "local",
    name: "Local Delivery",
    description: "Within same city/region",
  },
  {
    id: "nationwide",
    name: "Nationwide Shipping",
    description: "Ship anywhere in Tanzania",
  },
  {
    id: "international",
    name: "International Shipping",
    description: "Ship outside Tanzania",
  },
];

// Product conditions with detailed descriptions
const conditions = [
  {
    value: "brand_new",
    label: "Brand New",
    description: "Sealed, never used, with original packaging",
  },
  {
    value: "new_open_box",
    label: "New - Open Box",
    description: "New item, opened but never used",
  },
  {
    value: "like_new",
    label: "Like New",
    description: "Used briefly, looks and works like new",
  },
  {
    value: "good",
    label: "Good",
    description: "Some signs of wear, fully functional",
  },
  {
    value: "fair",
    label: "Fair",
    description: "Visible wear, still works properly",
  },
  {
    value: "for_parts",
    label: "For Parts/Repair",
    description: "Not fully functional, sold as-is",
  },
];

// Business types for Tanzania
const businessTypes = [
  {
    value: "individual",
    label: "Individual Seller",
    description: "Personal items, no business registration required",
  },
  {
    value: "sole_proprietor",
    label: "Sole Proprietorship",
    description: "Registered business with TRA",
  },
  {
    value: "company",
    label: "Limited Company",
    description: "Registered company with BRELA",
  },
  {
    value: "cooperative",
    label: "Cooperative/SACCOS",
    description: "Registered cooperative society",
  },
];

// Warranty options
const warrantyOptions = [
  { value: "none", label: "No Warranty" },
  { value: "7_days", label: "7 Days" },
  { value: "14_days", label: "14 Days" },
  { value: "30_days", label: "30 Days" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "1_year", label: "1 Year" },
  { value: "2_years", label: "2 Years" },
  { value: "manufacturer", label: "Manufacturer Warranty" },
];

import { useAuthStore } from "@/lib/store";

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Smart (photo-only) listing mode — seller just uploads a photo and the AI
  // fills in every detail automatically. Manual full form stays available.
  const [smartMode, setSmartMode] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [smartStatus, setSmartStatus] = useState("");
  const [productName, setProductName] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) {
          setDbCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories");
      }
    }
    loadCategories();
  }, []);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    price: "",
    compareAtPrice: "", // Original price for showing discounts
    currency: "TZS",
    categoryId: "",
    subcategoryId: "",
    condition: "brand_new",
    quantity: "1",
    sku: "", // Stock Keeping Unit
    barcode: "", // Product barcode (optional)

    // Pricing Options
    negotiable: true,
    allowOffers: true,
    minimumOffer: "", // Minimum acceptable offer percentage
    bulkPricing: false,
    bulkMinQuantity: "",
    bulkPrice: "",

    // Location (Tanzania specific)
    region: "",
    district: "",
    ward: "",
    street: "",
    landmark: "", // Nearby landmark for easier location

    // Business Info (Tanzania specific)
    businessType: "individual",
    tinNumber: "", // Tax Identification Number (TRA)
    brelaNumber: "", // BRELA registration number
    businessName: "",
    businessLicense: "",

    // Shipping & Delivery
    shippingOptions: ["pickup"] as string[],
    localDeliveryFee: "",
    nationwideDeliveryFee: "",
    internationalDeliveryFee: "",
    freeShippingMinimum: "", // Free shipping above this amount
    estimatedDeliveryDays: "",
    weight: "", // in kg
    dimensions: { length: "", width: "", height: "" },

    // Payment Methods
    acceptedPayments: ["mpesa", "cash"] as string[],
    mpesaNumber: "",
    tigoPesaNumber: "",
    airtelMoneyNumber: "",
    haloPesaNumber: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    swiftCode: "",

    // Product Details
    brand: "",
    model: "",
    color: "",
    size: "",
    material: "",
    yearOfManufacture: "",
    countryOfOrigin: "",
    warranty: "none",
    warrantyDetails: "",

    // Certifications & Compliance
    tbsCertified: false, // Tanzania Bureau of Standards
    tfda: false, // Tanzania Food and Drugs Authority (for applicable products)
    halal: false,
    organic: false,
    fairTrade: false,

    // SEO & Visibility
    tags: [] as string[],
    metaTitle: "",
    metaDescription: "",

    // Additional Options
    featured: false,
    urgent: false,
    allowReviews: true,
    showPhoneNumber: true,
    showWhatsApp: true,
    whatsappNumber: "",

    // Return Policy
    acceptReturns: false,
    returnPeriod: "7",
    returnConditions: "",
  });

  const [tagInput, setTagInput] = useState("");

  // Fallback to static categories if db is empty for some reason, but they have string IDs which will crash UUID column.
  // Ideally, the DB is seeded.
  const categoriesToUse = dbCategories.length > 0 ? dbCategories : categories;
  const selectedCategory = categoriesToUse.find(
    (c) => c.id === formData.categoryId,
  );
  const selectedRegionDistricts = formData.region
    ? tanzaniaDistricts[formData.region] || []
    : [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const readAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const filePromises = Array.from(files).map(readAsDataURL);
      const newBase64Images = await Promise.all(filePromises);
      setImages((prev) => [...prev, ...newBase64Images]);
      toast.success(`${files.length} Image(s) added`);
    } catch (err) {
      toast.error("Failed to read images");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const togglePaymentMethod = (methodId: string) => {
    const current = formData.acceptedPayments;
    if (current.includes(methodId)) {
      setFormData({
        ...formData,
        acceptedPayments: current.filter((m) => m !== methodId),
      });
    } else {
      setFormData({ ...formData, acceptedPayments: [...current, methodId] });
    }
  };

  const toggleShippingOption = (optionId: string) => {
    const current = formData.shippingOptions;
    if (current.includes(optionId)) {
      setFormData({
        ...formData,
        shippingOptions: current.filter((o) => o !== optionId),
      });
    } else {
      setFormData({ ...formData, shippingOptions: [...current, optionId] });
    }
  };

  // Smart listing: analyze the uploaded photo with AI, auto-fill all fields,
  // then publish to the SAME /api/products endpoint used by the manual form.
  const handleSmartList = async () => {
    if (!user) {
      toast.error("You must be logged in to create a product.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product photo first.");
      return;
    }

    setAnalyzing(true);
    try {
      setSmartStatus("Analyzing your photo with AI...");
      const res = await fetch("/api/products/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: images[0],
          name: productName,
          categories: dbCategories.map((c) => ({
            name: c.name,
            slug: c.slug,
          })),
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Failed to analyze image");
      }

      const { product } = await res.json();

      // Map AI category slug to a real category id from the database
      const matchedCategory =
        dbCategories.find((c) => c.slug === product.categorySlug) ||
        dbCategories.find(
          (c) =>
            c.name?.toLowerCase() ===
            String(product.categorySlug || "").toLowerCase(),
        );
      const categoryId = matchedCategory?.id || dbCategories[0]?.id;

      const price =
        Number(product.estimatedPriceTzs) > 0
          ? Math.round(Number(product.estimatedPriceTzs))
          : 1;

      // Keep the manual form state in sync so the seller can review/edit later
      setFormData((prev) => ({
        ...prev,
        title: product.title || prev.title,
        description: product.description || prev.description,
        price: String(price),
        categoryId: categoryId || prev.categoryId,
        condition:
          product.condition === "new"
            ? "brand_new"
            : product.condition === "refurbished"
              ? "good"
              : "like_new",
        brand: product.brand || "",
        model: product.model || "",
        color: product.color || "",
        size: product.size || "",
        material: product.material || "",
        yearOfManufacture: product.yearOfManufacture || "",
        countryOfOrigin: product.countryOfOrigin || "",
        tags: Array.isArray(product.tags) ? product.tags : prev.tags,
      }));

      setSmartStatus("Publishing your listing...");

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_id: user.id,
          category_id:
            categoryId || "12345678-1234-1234-1234-123456789012",
          title: product.title || productName || "Untitled Product",
          description: product.description || "No description provided",
          price,
          condition: product.condition || "new",
          region: formData.region || "Dar es Salaam",
          district: formData.district || "Unknown",
          ward: formData.ward || "",
          street: formData.street || "",
          images,
          currency: "TZS",
          quantity: 1,
          features: Array.isArray(product.tags) ? product.tags : [],
          attributes: {
            brand: product.brand || "",
            model: product.model || "",
            color: product.color || "",
            size: product.size || "",
            material: product.material || "",
            yearOfManufacture: product.yearOfManufacture || "",
            countryOfOrigin: product.countryOfOrigin || "",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create product");
      }

      toast.success("Product listed successfully!");
      router.push("/seller/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to list product. Please try again.");
    } finally {
      setAnalyzing(false);
      setSmartStatus("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create a product.");
      return;
    }

    setIsLoading(true);

    try {
      // Map frontend conditions to DB ENUM ('new', 'used', 'refurbished')
      const conditionMap: Record<string, string> = {
        brand_new: "new",
        new_open_box: "new",
        like_new: "used",
        good: "used",
        fair: "used",
        for_parts: "used",
      };

      const dbCondition = conditionMap[formData.condition] || "new";

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Spread first, so explicitly mapped fields below override these
          // Map frontend names to backend requirements
          seller_id: user.id,
          category_id:
            formData.categoryId ||
            dbCategories[0]?.id ||
            "12345678-1234-1234-1234-123456789012",
          subcategory_id: formData.subcategoryId || undefined,
          title: formData.title || "Untitled Product",
          description: formData.description || "No description provided",
          price:
            parseFloat(formData.price) > 0 ? parseFloat(formData.price) : 1,
          condition: dbCondition,
          region: formData.region || "Dar es Salaam",
          district: formData.district || "Unknown",
          ward: formData.ward || "",
          street: formData.street || "",
          images,
          currency: formData.currency || "TZS",
          quantity: parseInt(formData.quantity) || 1,
          features: formData.tags || [],
          attributes: {
            brand: formData.brand || "",
            model: formData.model || "",
            color: formData.color || "",
            size: formData.size || "",
            material: formData.material || "",
            yearOfManufacture: formData.yearOfManufacture || "",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      toast.success("Product listed successfully!");
      router.push("/seller/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to list product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateListingFee = () => {
    const price = parseFloat(formData.price) || 0;
    const baseFee = 500; // TZS 500 base fee
    const percentageFee = price * 0.02; // 2% of price
    const urgentFee = formData.urgent ? 5000 : 0;
    const featuredFee = formData.featured ? 10000 : 0;
    return baseFee + percentageFee + urgentFee + featuredFee;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            List your item for sale on the marketplace
          </p>
        </div>
        {!smartMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSmartMode(true)}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Smart Upload
          </Button>
        )}
        <Badge variant="outline" className="text-sm">
          Listing Fee: TZS {calculateListingFee().toLocaleString()}
        </Badge>
      </div>

      <form onSubmit={handleSubmit}>
        {smartMode && (
          <div className="space-y-6 pb-24">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Smart Listing
                </CardTitle>
                <CardDescription>
                  Just upload a photo. Our AI reads the image and fills in the
                  title, description, price, category and all other details for
                  you automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo upload */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-border overflow-hidden"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          Main
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center px-2">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={analyzing}
                      />
                    </label>
                  )}
                </div>

                {/* Optional product name */}
                <div className="space-y-2">
                  <Label htmlFor="smart-name">
                    Product name{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional — helps the AI be more accurate)
                    </span>
                  </Label>
                  <Input
                    id="smart-name"
                    placeholder="e.g. iPhone 13 Pro, Toyota Vitz, Nike Air Max..."
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    disabled={analyzing}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSmartList}
                  disabled={analyzing || images.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {smartStatus || "Working..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Listing from Photo
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setSmartMode(false)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mx-auto"
                >
                  <Pencil className="w-4 h-4" />
                  Prefer to fill everything in manually?
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {!smartMode && (
          <>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
            <TabsTrigger value="basic" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2">
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Shipping</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Add up to 10 high-quality images. The first image will be the
                  main photo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-border overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          Main
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Tip: Use clear, well-lit photos from multiple angles. Include
                  photos of any defects or wear.
                </p>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Samsung Galaxy S24 Ultra 256GB - Titanium Black"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.title.length}/150 characters. Be specific: include
                    brand, model, size, color
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product in detail. Include:
- Key features and specifications
- Condition details (any scratches, dents, etc.)
- What's included (accessories, original box, etc.)
- Reason for selling
- Any other relevant information"
                    rows={8}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          categoryId: value,
                          subcategoryId: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesToUse.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedCategory && selectedCategory.subcategories && (
                    <div className="space-y-2">
                      <Label>Subcategory</Label>
                      <Select
                        value={formData.subcategoryId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subcategoryId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.subcategories.map((sub: any) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Optional)</Label>
                    <Input
                      id="sku"
                      placeholder="Your internal code"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {conditions.map((condition) => (
                      <div
                        key={condition.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            condition: condition.value,
                          })
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.condition === condition.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{condition.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {condition.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (TZS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 500000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">
                      Compare at Price (TZS)
                    </Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      placeholder="Original price (for discounts)"
                      value={formData.compareAtPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compareAtPrice: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Shows as crossed-out original price
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumOffer">Minimum Offer (%)</Label>
                    <Input
                      id="minimumOffer"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 80"
                      value={formData.minimumOffer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumOffer: e.target.value,
                        })
                      }
                      disabled={!formData.allowOffers}
                    />
                    <p className="text-xs text-muted-foreground">
                      Auto-decline offers below this %
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Price Negotiable</p>
                      <p className="text-sm text-muted-foreground">
                        Show &quot;Negotiable&quot; badge
                      </p>
                    </div>
                    <Switch
                      checked={formData.negotiable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, negotiable: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Allow Offers</p>
                      <p className="text-sm text-muted-foreground">
                        Let buyers make offers
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowOffers}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allowOffers: checked })
                      }
                    />
                  </div>
                </div>

                {/* Bulk Pricing */}
                <div className="p-4 rounded-lg border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bulk Pricing</p>
                      <p className="text-sm text-muted-foreground">
                        Offer discounts for larger quantities
                      </p>
                    </div>
                    <Switch
                      checked={formData.bulkPricing}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, bulkPricing: checked })
                      }
                    />
                  </div>
                  {formData.bulkPricing && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulkMinQuantity">
                          Minimum Quantity
                        </Label>
                        <Input
                          id="bulkMinQuantity"
                          type="number"
                          min="2"
                          placeholder="e.g., 10"
                          value={formData.bulkMinQuantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bulkMinQuantity: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bulkPrice">
                          Bulk Price per Unit (TZS)
                        </Label>
                        <Input
                          id="bulkPrice"
                          type="number"
                          placeholder="e.g., 450000"
                          value={formData.bulkPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bulkPrice: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags & Keywords
                </CardTitle>
                <CardDescription>
                  Add tags to help buyers find your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g., smartphone, electronics)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Samsung, Nike, Toyota"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Galaxy S24 Ultra"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      placeholder="e.g., Black, Blue, Red"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      placeholder="e.g., Large, 42, 256GB"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      placeholder="e.g., Cotton, Leather, Aluminum"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfManufacture">
                      Year of Manufacture
                    </Label>
                    <Input
                      id="yearOfManufacture"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 2024"
                      value={formData.yearOfManufacture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearOfManufacture: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                    <Input
                      id="countryOfOrigin"
                      placeholder="e.g., Tanzania, China, USA"
                      value={formData.countryOfOrigin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryOfOrigin: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode/UPC (Optional)</Label>
                    <Input
                      id="barcode"
                      placeholder="e.g., 012345678901"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warranty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Warranty & Returns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Warranty Period</Label>
                    <Select
                      value={formData.warranty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, warranty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {warrantyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.warranty !== "none" && (
                    <div className="space-y-2">
                      <Label htmlFor="warrantyDetails">Warranty Details</Label>
                      <Input
                        id="warrantyDetails"
                        placeholder="What does the warranty cover?"
                        value={formData.warrantyDetails}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            warrantyDetails: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Accept Returns</p>
                    <p className="text-sm text-muted-foreground">
                      Allow buyers to return items
                    </p>
                  </div>
                  <Switch
                    checked={formData.acceptReturns}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, acceptReturns: checked })
                    }
                  />
                </div>

                {formData.acceptReturns && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Return Period</Label>
                      <Select
                        value={formData.returnPeriod}
                        onValueChange={(value) =>
                          setFormData({ ...formData, returnPeriod: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnConditions">
                        Return Conditions
                      </Label>
                      <Input
                        id="returnConditions"
                        placeholder="e.g., Unopened, original packaging"
                        value={formData.returnConditions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnConditions: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Compliance</CardTitle>
                <CardDescription>
                  Select applicable certifications for your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id="tbsCertified"
                      checked={formData.tbsCertified}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, tbsCertified: !!checked })
                      }
                    />
                    <div>
                      <Label htmlFor="tbsCertified" className="font-medium">
                        TBS Certified
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Tanzania Bureau of Standards
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id="tfda"
                      checked={formData.tfda}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, tfda: !!checked })
                      }
                    />
                    <div>
                      <Label htmlFor="tfda" className="font-medium">
                        TFDA Approved
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Food & Drugs Authority
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id="halal"
                      checked={formData.halal}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, halal: !!checked })
                      }
                    />
                    <div>
                      <Label htmlFor="halal" className="font-medium">
                        Halal Certified
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Islamic certification
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id="organic"
                      checked={formData.organic}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, organic: !!checked })
                      }
                    />
                    <div>
                      <Label htmlFor="organic" className="font-medium">
                        Organic
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Certified organic product
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id="fairTrade"
                      checked={formData.fairTrade}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, fairTrade: !!checked })
                      }
                    />
                    <div>
                      <Label htmlFor="fairTrade" className="font-medium">
                        Fair Trade
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Fair trade certified
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Product Location
                </CardTitle>
                <CardDescription>
                  Where is the product located? This helps buyers find local
                  items.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          region: value,
                          district: "",
                        })
                      }
                    >
                      <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label>District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        setFormData({ ...formData, district: value })
                      }
                      disabled={!formData.region}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.region
                              ? "Select district"
                              : "Select region first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRegionDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward</Label>
                    <Input
                      id="ward"
                      placeholder="e.g., Msasani, Mikocheni"
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData({ ...formData, ward: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      placeholder="e.g., Haile Selassie Road"
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Nearby Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g., Near Mlimani City Mall, Opposite Shoppers Plaza"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Help buyers find you easily by mentioning a well-known
                    nearby location
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Show Phone Number</p>
                      <p className="text-sm text-muted-foreground">
                        Let buyers call you directly
                      </p>
                    </div>
                    <Switch
                      checked={formData.showPhoneNumber}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, showPhoneNumber: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Show WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        Enable WhatsApp messaging
                      </p>
                    </div>
                    <Switch
                      checked={formData.showWhatsApp}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, showWhatsApp: checked })
                      }
                    />
                  </div>
                </div>
                {formData.showWhatsApp && (
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="e.g., +255 712 345 678"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whatsappNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Options
                </CardTitle>
                <CardDescription>
                  Select how you can deliver this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => toggleShippingOption(option.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.shippingOptions.includes(option.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.shippingOptions.includes(option.id)}
                        />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Shipping Fees */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.shippingOptions.includes("local") && (
                    <div className="space-y-2">
                      <Label htmlFor="localDeliveryFee">
                        Local Delivery Fee (TZS)
                      </Label>
                      <Input
                        id="localDeliveryFee"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.localDeliveryFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            localDeliveryFee: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                  {formData.shippingOptions.includes("nationwide") && (
                    <div className="space-y-2">
                      <Label htmlFor="nationwideDeliveryFee">
                        Nationwide Delivery Fee (TZS)
                      </Label>
                      <Input
                        id="nationwideDeliveryFee"
                        type="number"
                        placeholder="e.g., 15000"
                        value={formData.nationwideDeliveryFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nationwideDeliveryFee: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                  {formData.shippingOptions.includes("international") && (
                    <div className="space-y-2">
                      <Label htmlFor="internationalDeliveryFee">
                        International Delivery Fee (TZS)
                      </Label>
                      <Input
                        id="internationalDeliveryFee"
                        type="number"
                        placeholder="e.g., 50000"
                        value={formData.internationalDeliveryFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            internationalDeliveryFee: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingMinimum">
                      Free Shipping Above (TZS)
                    </Label>
                    <Input
                      id="freeShippingMinimum"
                      type="number"
                      placeholder="e.g., 100000"
                      value={formData.freeShippingMinimum}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          freeShippingMinimum: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty if no free shipping
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryDays">
                      Estimated Delivery (Days)
                    </Label>
                    <Input
                      id="estimatedDeliveryDays"
                      type="number"
                      min="1"
                      placeholder="e.g., 3"
                      value={formData.estimatedDeliveryDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedDeliveryDays: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Package Dimensions (Optional)</CardTitle>
                <CardDescription>
                  Help calculate accurate shipping costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 1.5"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.dimensions.length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            length: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="e.g., 20"
                      value={formData.dimensions.width}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            width: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.dimensions.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            height: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Accepted Payment Methods
                </CardTitle>
                <CardDescription>
                  Select how buyers can pay for this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => togglePaymentMethod(method.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.acceptedPayments.includes(method.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.acceptedPayments.includes(
                            method.id,
                          )}
                        />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Money Numbers */}
            {(formData.acceptedPayments.includes("mpesa") ||
              formData.acceptedPayments.includes("tigopesa") ||
              formData.acceptedPayments.includes("airtelmoney") ||
              formData.acceptedPayments.includes("halopesa")) && (
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Money Numbers</CardTitle>
                  <CardDescription>
                    Enter your mobile money numbers for selected payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {formData.acceptedPayments.includes("mpesa") && (
                      <div className="space-y-2">
                        <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
                        <Input
                          id="mpesaNumber"
                          placeholder="e.g., 0754 123 456"
                          value={formData.mpesaNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mpesaNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {formData.acceptedPayments.includes("tigopesa") && (
                      <div className="space-y-2">
                        <Label htmlFor="tigoPesaNumber">Tigo Pesa Number</Label>
                        <Input
                          id="tigoPesaNumber"
                          placeholder="e.g., 0713 123 456"
                          value={formData.tigoPesaNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tigoPesaNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {formData.acceptedPayments.includes("airtelmoney") && (
                      <div className="space-y-2">
                        <Label htmlFor="airtelMoneyNumber">
                          Airtel Money Number
                        </Label>
                        <Input
                          id="airtelMoneyNumber"
                          placeholder="e.g., 0785 123 456"
                          value={formData.airtelMoneyNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              airtelMoneyNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {formData.acceptedPayments.includes("halopesa") && (
                      <div className="space-y-2">
                        <Label htmlFor="haloPesaNumber">Halo Pesa Number</Label>
                        <Input
                          id="haloPesaNumber"
                          placeholder="e.g., 0622 123 456"
                          value={formData.haloPesaNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              haloPesaNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bank Details */}
            {formData.acceptedPayments.includes("bank") && (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Select
                        value={formData.bankName}
                        onValueChange={(value) =>
                          setFormData({ ...formData, bankName: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CRDB">CRDB Bank</SelectItem>
                          <SelectItem value="NMB">NMB Bank</SelectItem>
                          <SelectItem value="NBC">NBC Bank</SelectItem>
                          <SelectItem value="Stanbic">Stanbic Bank</SelectItem>
                          <SelectItem value="Exim">Exim Bank</SelectItem>
                          <SelectItem value="DTB">
                            Diamond Trust Bank
                          </SelectItem>
                          <SelectItem value="BOA">Bank of Africa</SelectItem>
                          <SelectItem value="Azania">Azania Bank</SelectItem>
                          <SelectItem value="AccessBank">
                            Access Bank
                          </SelectItem>
                          <SelectItem value="Equity">Equity Bank</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountName">Account Name</Label>
                      <Input
                        id="bankAccountName"
                        placeholder="Account holder name"
                        value={formData.bankAccountName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankAccountName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                      <Input
                        id="bankAccountNumber"
                        placeholder="e.g., 0150123456789"
                        value={formData.bankAccountNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankAccountNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">SWIFT Code (Optional)</Label>
                      <Input
                        id="swiftCode"
                        placeholder="For international transfers"
                        value={formData.swiftCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            swiftCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Optional: Add your business details to build trust with buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {businessTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() =>
                          setFormData({ ...formData, businessType: type.value })
                        }
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.businessType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.businessType !== "individual" && (
                  <>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your registered business name"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              businessName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tinNumber">TIN Number (TRA)</Label>
                        <Input
                          id="tinNumber"
                          placeholder="Tax Identification Number"
                          value={formData.tinNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tinNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      {(formData.businessType === "company" ||
                        formData.businessType === "cooperative") && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="brelaNumber">
                              BRELA Registration No.
                            </Label>
                            <Input
                              id="brelaNumber"
                              placeholder="BRELA registration number"
                              value={formData.brelaNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  brelaNumber: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessLicense">
                              Business License No.
                            </Label>
                            <Input
                              id="businessLicense"
                              placeholder="Business license number"
                              value={formData.businessLicense}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  businessLicense: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Listing Boost Options */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Boost Options</CardTitle>
                <CardDescription>
                  Increase visibility and sell faster
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Featured Listing</p>
                    <p className="text-sm text-muted-foreground">
                      Appear at the top of search results (+TZS 10,000)
                    </p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Urgent Sale</p>
                    <p className="text-sm text-muted-foreground">
                      Show &quot;Urgent&quot; badge to attract quick buyers
                      (+TZS 5,000)
                    </p>
                  </div>
                  <Switch
                    checked={formData.urgent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, urgent: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Allow Reviews</p>
                    <p className="text-sm text-muted-foreground">
                      Let buyers leave reviews after purchase
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowReviews}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowReviews: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Listing Fee Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Listing Fee</span>
                    <span>TZS 500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee (2%)</span>
                    <span>
                      TZS{" "}
                      {(
                        parseFloat(formData.price || "0") * 0.02
                      ).toLocaleString()}
                    </span>
                  </div>
                  {formData.featured && (
                    <div className="flex justify-between text-sm">
                      <span>Featured Listing</span>
                      <span>TZS 10,000</span>
                    </div>
                  )}
                  {formData.urgent && (
                    <div className="flex justify-between text-sm">
                      <span>Urgent Badge</span>
                      <span>TZS 5,000</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Listing Fee</span>
                    <span>TZS {calculateListingFee().toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  <Info className="w-3 h-3 inline mr-1" />
                  Fee is deducted when your item sells. No upfront payment
                  required.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Listing Fee:{" "}
              <span className="font-bold">
                TZS {calculateListingFee().toLocaleString()}
              </span>{" "}
              (deducted on sale)
            </p>
            <div className="flex items-center gap-4">
              <Link href="/seller/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="min-w-32">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Publish Listing
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
          </>
        )}
      </form>
    </div>
  );
}
