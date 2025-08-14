import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  observacoes: string;
}

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, observacoes: string) => void;
  clearCart: () => void;
  updateQuantity: (id: number, observacoes: string, novaQuantidade: number) => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Função inicial para tentar carregar do localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Sempre que cartItems mudar, atualiza o localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.observacoes === item.observacoes
      );

      if (existingIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex].quantidade += item.quantidade;
        return updatedItems;
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: number, observacoes: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.observacoes === observacoes)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id: number, observacoes: string, novaQuantidade: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.observacoes === observacoes
          ? { ...item, quantidade: novaQuantidade > 0 ? novaQuantidade : 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextData => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
