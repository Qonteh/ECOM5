const fs = require('fs');

const path = 'components/product-card.tsx';
let code = fs.readFileSync(path, 'utf-8');

// 1. Imports
code = code.replace(
  "import { Heart, MapPin, Eye, Clock, BadgeCheck, Star, Sparkles } from 'lucide-react';",
  "import { MessageCircle, MapPin, Eye, Clock, BadgeCheck, Star, Sparkles } from 'lucide-react';"
);

// We need useRouter
if (!code.includes("import { useRouter }")) {
  code = code.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';"
  );
}

// Stores
code = code.replace(
  "import { useWishlistStore, useThemeStore } from '@/lib/store';",
  "import { useThemeStore, useChatStore, useAuthStore } from '@/lib/store';"
);

// Store hooks inside component
code = code.replace(
  "  const { isInWishlist, addItem, removeItem } = useWishlistStore();\n  const { themeId } = useThemeStore();\n  const isWishlisted = isInWishlist(product.id);",
  "  const { themeId } = useThemeStore();\n  const router = useRouter();\n  const { user } = useAuthStore();\n  const { addConversation, setActiveConversation, getConversation } = useChatStore();"
);

// handleStartChat replacing handleWishlistToggle
const newHandleFunc = `  const handleStartChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    if (user.id === product.sellerId) {
      // Cannot chat with yourself
      router.push("/messages");
      return;
    }

    const existing = getConversation(product.id, product.sellerId);
    if (existing) {
      setActiveConversation(existing.id);
      router.push("/messages");
      return;
    }

    const conversationId = addConversation({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || "",
      productPrice: product.price,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      sellerVerified: product.sellerVerified,
    });

    setActiveConversation(conversationId);
    router.push("/messages");
  };`;

// replace handleWishlistToggle
code = code.replace(
  /  const handleWishlistToggle = \([^)]*\) => {[\s\S]*?  };/,
  newHandleFunc
);

// Replace onClick={handleWishlistToggle} with onClick={handleStartChat}
code = code.replace(/onClick=\{handleWishlistToggle\}/g, "onClick={handleStartChat}");

code = code.replace(/<Heart className=\{cn\('w-4 h-4', isWishlisted && 'fill-current'\)\} \/>/g, '<MessageCircle className="w-4 h-4" />');
code = code.replace(/<Heart className=\{cn\('w-5 h-5', isWishlisted && 'fill-current'\)\} \/>/g, '<MessageCircle className="w-5 h-5" />');

code = code.replace(/className=\{cn\('([^']*)', isWishlisted \&\& '([^']*)'\)\}/g, 'className="$1"');

fs.writeFileSync(path, code);
console.log('Fixed components/product-card.tsx');
