"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { type Product } from "@/constants/products";
import { type Kit } from "@/constants/kits";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics";
import { fbTrackAddToCart } from "@/lib/meta-pixel";
import { useAuth } from "@/hooks/useAuth";
import * as cartService from "@/lib/cart-service";
import { getProductByVariantId } from "@/lib/application/products/product-query-service";

const CART_STORAGE_KEY = "benangbaju_cart";
export interface CartItem {
  id: string;
  name: string;
  base_price: number;
  quantity: number;
  image_url: string;
  variantId?: string;
  category_id?: string | null;
  tagline?: string | null;
  collection_id?: string | null;
  isKit?: boolean;
  kitProducts?: string[];
  // Legacy support
  price?: number;
  image?: string;
}

// ============================================================================
// Storage helpers
// ============================================================================
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    
    // Basic validation only, deep validation happens during DB sync
    return parsed.filter((item) => {
      return item?.id && typeof item.quantity === "number" && item.quantity >= 1;
    });
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Ignore failures (quota exceeded, private, etc.)
  }
}

// ============================================================================
// Hook: cart operations + persistence
// ============================================================================
function useCartStore() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());
  const [sessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    let sid = localStorage.getItem("bb_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("bb_session_id", sid);
    }
    return sid;
  });
  const [dbCartId, setDbCartId] = useState<string | null>(null);
  const hasHydratedRef = React.useRef(false);
  const safeSyncCartMutation = useCallback((operation: Promise<unknown>) => {
    void operation.catch((error) => {
      console.error("[CART DB SYNC] Failed to sync cart mutation:", error);
    });
  }, []);

  useEffect(() => {
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    saveCartToStorage(cart);
  }, [cart]);

  // Fetch/Sync Cart from DB
  useEffect(() => {
    if (!sessionId || !hasHydratedRef.current) return;

    async function syncFromDB() {
      const dbCart = await cartService.getOrCreateCart(user?.id, sessionId || undefined);
      if (dbCart) {
        setDbCartId(dbCart.id);
        // If DB has items, prioritize them over local storage on initial load
        if (dbCart.cart_items?.length > 0) {
          const mappedItems = await Promise.all(
            dbCart.cart_items.map(async (item: any) => {
              const productData = await getProductByVariantId(item.variant_id);
              return productData ? { ...productData, quantity: item.quantity, variantId: item.variant_id } : null;
            })
          );
          setCart(mappedItems.filter(Boolean) as CartItem[]);
        }
      }
    }
    syncFromDB();
  }, [user, sessionId]);

  const addToCart = useCallback((product: Product, variantId?: string) => {
    setCart((prev) => {
      const targetVariantId = variantId || (product as any).variantId;
      const existing = prev.find(
        (item) => (targetVariantId ? item.variantId === targetVariantId : item.id === product.id) && !item.isKit,
      );
      const quantityAdded = 1;
      const newQty = existing ? existing.quantity + quantityAdded : quantityAdded;
      
      // DB Sync
      if (dbCartId && targetVariantId) {
        safeSyncCartMutation(cartService.addToCartDB(dbCartId, targetVariantId, newQty));
      }

      if (existing) {
        return prev.map((item) =>
          (targetVariantId ? item.variantId === targetVariantId : item.id === product.id) && !item.isKit
            ? { ...item, quantity: newQty }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1, isKit: false, variantId: targetVariantId }];
    });
  }, [dbCartId, safeSyncCartMutation]);

  const addKitToCart = useCallback((kit: Kit) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === kit.id && item.isKit);
      const quantityAdded = 1;
      const newQty = existing ? existing.quantity + quantityAdded : quantityAdded;
      
      // Kits in v6.6 would eventually need their own kit_id mapping in cart_items
      // For now, we keep them local or map to a specific kit variant if available

      if (existing) {
        return prev.map((item) =>
          item.id === kit.id && item.isKit
            ? { ...item, quantity: newQty }
            : item,
        );
      }
      const kitAsCartItem: CartItem = {
        id: kit.id,
        name: kit.name,
        base_price: kit.price,
        image_url: kit.image || "/images/products/glow.jpeg",
        description: kit.description,
        category_id: kit.badge === "kit" ? "Kit" : "Protocol",
        quantity: 1,
        kitProducts: kit.products,
        isKit: true,
      } as any;
      return [...prev, kitAsCartItem];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) => {
      if (dbCartId && variantId) {
        safeSyncCartMutation(cartService.removeFromCartDB(dbCartId, variantId));
      }

      return prev.filter((i) => variantId ? i.variantId !== variantId : i.id !== productId);
    });
  }, [dbCartId, safeSyncCartMutation]);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    if (dbCartId && variantId) {
      safeSyncCartMutation(cartService.updateCartItemQtyDB(dbCartId, variantId, quantity));
    }

    setCart((prev) =>
      prev.map((item) =>
        (variantId ? item.variantId === variantId : item.id === productId) ? { ...item, quantity } : item,
      ),
    );
  }, [dbCartId, removeFromCart, safeSyncCartMutation]);

  const clearCart = useCallback(() => {
    setCart([]);
    // DB cleanup could be added here
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + (item.base_price || 0) * item.quantity, 0),
    [cart],
  );

  return {
    cart,
    addToCart,
    addKitToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}

// ============================================================================
// Hook: UI overlay/drawer/toast state
// ============================================================================
function useUIStore() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"default" | "error">("default");

  const showToast = useCallback(
    (message: string, type: "default" | "error" = "default") => {
      setToastMessage(message);
      setToastType(type);
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isSearchOpen,
    setIsSearchOpen,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    toastMessage,
    toastType,
    showToast,
    hideToast,
  };
}

// ============================================================================
// Context + Provider
// ============================================================================
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, openDrawer?: boolean, variantId?: string) => void;
  addKitToCart: (kit: Kit) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
  toastType: "default" | "error";
  showToast: (message: string, type?: "default" | "error") => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartStore = useCartStore();
  const uiStore = useUIStore();

  // addToCart exposes openDrawer as second argument and triggers toast + drawer
  const addToCart = useCallback(
    (product: Product, openDrawer = true, variantId?: string) => {
      const targetVariantId = variantId || (product as any).variantId;
      const isExisting = cartStore.cart.some(
        (item) => (targetVariantId ? item.variantId === targetVariantId : item.id === product.id) && !item.isKit,
      );
      cartStore.addToCart(product, targetVariantId);
      uiStore.showToast(
        isExisting
          ? `${product.name} ditambahkan lagi ke tas`
          : `${product.name} ditambahkan ke tas`,
      );
      if (openDrawer) uiStore.setIsCartDrawerOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartStore.cart, cartStore.addToCart, uiStore.showToast, uiStore.setIsCartDrawerOpen],
  );

  // addKitToCart always opens the drawer and triggers toast
  const addKitToCart = useCallback(
    (kit: Kit) => {
      const isExisting = cartStore.cart.some(
        (item) => item.id === kit.id && item.isKit,
      );
      cartStore.addKitToCart(kit);
      uiStore.showToast(
        isExisting
          ? `${kit.name} ditambahkan lagi ke tas`
          : `${kit.name} ditambahkan ke tas`,
      );
      uiStore.setIsCartDrawerOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartStore.cart, cartStore.addKitToCart, uiStore.showToast, uiStore.setIsCartDrawerOpen],
  );

  return (
    <CartContext.Provider
      value={{
        cart: cartStore.cart,
        addToCart,
        addKitToCart,
        removeFromCart: cartStore.removeFromCart,
        updateQuantity: cartStore.updateQuantity,
        clearCart: cartStore.clearCart,
        totalItems: cartStore.totalItems,
        totalPrice: cartStore.totalPrice,
        isMenuOpen: uiStore.isMenuOpen,
        setIsMenuOpen: uiStore.setIsMenuOpen,
        isSearchOpen: uiStore.isSearchOpen,
        setIsSearchOpen: uiStore.setIsSearchOpen,
        isCartDrawerOpen: uiStore.isCartDrawerOpen,
        setIsCartDrawerOpen: uiStore.setIsCartDrawerOpen,
        toastMessage: uiStore.toastMessage,
        toastType: uiStore.toastType,
        showToast: uiStore.showToast,
        hideToast: uiStore.hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
};

