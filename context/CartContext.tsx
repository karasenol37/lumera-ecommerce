"useClient"; // nextjs client
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  freeShipping?: boolean;
  shippingFee?: number;
  selectedMaterial?: string;
};

export type CartItem = Product & {
  quantity: number;
  selectedMaterial?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number, selectedMaterial?: string) => void;
  increaseQuantity: (id: number, selectedMaterial?: string) => void;
  decreaseQuantity: (id: number, selectedMaterial?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  userId = null,
}: {
  children: ReactNode;
  userId?: number | null;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = userId
    ? `lumera-cart-user-${userId}`
    : "lumera-cart-guest";

  // Kayıtlı kullanıcı sepetini yükle
  useEffect(() => {
    setIsLoaded(false);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const fixedCart = parsed.map((item: CartItem) => ({
          ...item,
          stock: item.stock ?? 0,
        }));
        setCart(fixedCart);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  }, [userId, storageKey]);

  // Sepet değişince ilgili kullanıcının anahtarına kaydet
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {}
  }, [cart, storageKey, isLoaded]);

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      alert("Bu ürün stokta yok.");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.id === product.id &&
          (item.selectedMaterial || "") === (product.selectedMaterial || "")
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Yeterli stok yok.");
          return current;
        }

        return current.map((item) =>
          item.id === product.id &&
          (item.selectedMaterial || "") === (product.selectedMaterial || "")
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id: number, selectedMaterial?: string) {
    setCart((current) =>
      current.filter(
        (item) =>
          !(
            item.id === id &&
            (selectedMaterial === undefined ||
              (item.selectedMaterial || "") === (selectedMaterial || ""))
          )
      )
    );
  }

  function increaseQuantity(id: number, selectedMaterial?: string) {
    setCart((current) =>
      current.map((item) => {
        const matches =
          item.id === id &&
          (selectedMaterial === undefined ||
            (item.selectedMaterial || "") === (selectedMaterial || ""));
        if (matches) {
          if (item.quantity >= item.stock) {
            alert("Stok sınırına ulaştınız.");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  }

  function decreaseQuantity(id: number, selectedMaterial?: string) {
    setCart((current) =>
      current.map((item) => {
        const matches =
          item.id === id &&
          (selectedMaterial === undefined ||
            (item.selectedMaterial || "") === (selectedMaterial || ""));
        if (matches) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      })
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart CartProvider içinde kullanılmalıdır");
  }
  return context;
}