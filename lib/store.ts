'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId } from './themes';

interface ThemeStore {
  themeId: ThemeId;
  darkMode: boolean;
  setThemeId: (id: ThemeId) => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeId: 'safari',
      darkMode: false,
      setThemeId: (id) => set({ themeId: id }),
      setDarkMode: (dark) => set({ darkMode: dark }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'soko-theme-storage',
    }
  )
);

// User types
export type UserRole = 'buyer' | 'seller' | 'developer' | 'admin';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'business';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  verified: boolean;
  createdAt: string;
  subscriptionTier?: SubscriptionTier;
  subscriptionExpiry?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'soko-auth-storage',
    }
  )
);

// Cart store
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, id: crypto.randomUUID() }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'soko-cart-storage',
    }
  )
);

// Wishlist store
interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      isInWishlist: (productId) => get().items.includes(productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'soko-wishlist-storage',
    }
  )
);

// Chat store
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerVerified: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  messages: Message[];
  createdAt: string;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  addConversation: (conversation: Omit<Conversation, 'id' | 'messages' | 'unreadCount' | 'createdAt'>) => string;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'conversationId' | 'isRead' | 'createdAt'>) => void;
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: (conversationId: string) => void;
  openChat: (productId?: string, sellerId?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  getConversation: (productId: string, sellerId: string) => Conversation | undefined;
  getTotalUnread: () => number;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isOpen: false,
      
      addConversation: (conversation) => {
        const id = crypto.randomUUID();
        set((state) => ({
          conversations: [
            {
              ...conversation,
              id,
              messages: [],
              unreadCount: 0,
              createdAt: new Date().toISOString(),
            },
            ...state.conversations,
          ],
        }));
        return id;
      },
      
      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          conversationId,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  lastMessage: message.content,
                  lastMessageAt: newMessage.createdAt,
                  unreadCount: message.senderId !== conv.buyerId ? conv.unreadCount + 1 : conv.unreadCount,
                }
              : conv
          ),
        }));
      },
      
      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
        if (conversationId) {
          get().markAsRead(conversationId);
        }
      },
      
      markAsRead: (conversationId) => {
        const currentUser = useAuthStore.getState().user;
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  unreadCount: 0,
                  messages: conv.messages.map((msg) =>
                    msg.senderId !== currentUser?.id
                      ? { ...msg, isRead: true }
                      : msg
                  ),
                }
              : conv
          ),
        }));
      },
      
      openChat: (productId, sellerId) => {
        const state = get();
        if (productId && sellerId) {
          const existing = state.conversations.find(
            (c) => c.productId === productId && c.sellerId === sellerId
          );
          if (existing) {
            set({ activeConversationId: existing.id, isOpen: true });
          }
        }
        set({ isOpen: true });
      },
      
      closeChat: () => set({ isOpen: false }),
      
      toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getConversation: (productId, sellerId) => {
        return get().conversations.find(
          (c) => c.productId === productId && c.sellerId === sellerId
        );
      },
      
      getTotalUnread: () => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return 0;
        return get().conversations.reduce((total, conv) => {
          const unread = conv.messages.filter(m => !m.isRead && m.senderId !== currentUser.id).length;
          return total + unread;
        }, 0);
      },
    }),
    {
      name: 'soko-chat-storage',
    }
  )
);

// Platform stats for developer dashboard
export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  platformFees: number;
  subscriptionRevenue: number;
  featuredListingRevenue: number;
  adRevenue: number;
  monthlyGrowth: number;
}

export interface RevenueItem {
  id: string;
  type: 'subscription' | 'featured' | 'promoted' | 'transaction_fee' | 'ad';
  amount: number;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// Subscription plans
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  priceYearly: number;
  features: string[];
  limits: {
    listings: number;
    featuredListings: number;
    photoPerListing: number;
    support: string;
  };
  popular?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    features: [
      '5 active listings',
      '3 photos per listing',
      'Basic support',
      'Standard visibility',
    ],
    limits: {
      listings: 5,
      featuredListings: 0,
      photoPerListing: 3,
      support: 'Basic',
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 15000,
    priceYearly: 150000,
    features: [
      '25 active listings',
      '10 photos per listing',
      'Email support',
      'Priority visibility',
      '1 featured listing/month',
    ],
    limits: {
      listings: 25,
      featuredListings: 1,
      photoPerListing: 10,
      support: 'Email',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50000,
    priceYearly: 500000,
    features: [
      '100 active listings',
      '20 photos per listing',
      'Priority support',
      'Top visibility',
      '5 featured listings/month',
      'Analytics dashboard',
      'Verified badge',
    ],
    limits: {
      listings: 100,
      featuredListings: 5,
      photoPerListing: 20,
      support: 'Priority',
    },
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 150000,
    priceYearly: 1500000,
    features: [
      'Unlimited listings',
      '50 photos per listing',
      '24/7 dedicated support',
      'Maximum visibility',
      '20 featured listings/month',
      'Advanced analytics',
      'Verified badge',
      'Custom store page',
      'API access',
    ],
    limits: {
      listings: -1,
      featuredListings: 20,
      photoPerListing: 50,
      support: '24/7 Dedicated',
    },
  },
];
