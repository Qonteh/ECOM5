const fs = require('fs');

const path = 'components/layout/header.tsx';
let code = fs.readFileSync(path, 'utf-8');

// 1. Imports
code = code.replace(
  "import { MessageSquare, Bell, Search, Menu, ShoppingCart, User, Heart, Settings, LogOut } from 'lucide-react';",
  "import { MessageSquare, Bell, Search, Menu, ShoppingCart, User, MessageCircle, Settings, LogOut } from 'lucide-react';"
);

// We need useChatStore inside Header
if (!code.includes("useChatStore")) {
  code = code.replace(
    "import { useAuthStore, useThemeStore, useCartStore, useWishlistStore } from '@/lib/store';",
    "import { useAuthStore, useThemeStore, useCartStore, useWishlistStore, useChatStore } from '@/lib/store';"
  );
}

// 3. inside Header function: add useChatStore to get unread count
code = code.replace(
  "  const cartItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));\n  const wishlistItems = useWishlistStore((state) => state.items.length);",
  "  const cartItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));\n  const { conversations, user } = useChatStore((state) => ({\n    conversations: state.conversations,\n    user: useAuthStore.getState().user\n  }));\n  const unreadMessages = user ? conversations.reduce((acc, c) => acc + (user.id === c.sellerId ? c.unreadCountSeller : c.unreadCountBuyer), 0) : 0;"
);

// We need to replace the user variable getter. Wait, `useAuthStore` already gives `user` earlier.
// Let's check how `useAuthStore` is used.
code = fs.readFileSync(path, 'utf-8');
