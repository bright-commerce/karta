"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface StoreContextType {
  cart: string[];
  wishlist: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
}

const StoreContext = createContext<StoreContextType>({
  cart: [],
  wishlist: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('karta_cart');
    const savedWishlist = localStorage.getItem('karta_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const addToCart = (id: string) => {
    setCart((prev) => {
      if (prev.includes(id)) return prev;
      const newCart = [...prev, id];
      localStorage.setItem('karta_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter(item => item !== id);
      localStorage.setItem('karta_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('karta_cart');
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('karta_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  return (
    <StoreContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, clearCart, toggleWishlist }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
