import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "@datafood_cart_v1";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}); // { [id]: { item, qty } }
  const [ready, setReady] = useState(false);

  // cargar
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_KEY);
        if (raw) setCart(JSON.parse(raw));
      } catch {}
      setReady(true);
    })();
  }, []);

  // guardar
  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch {}
    })();
  }, [cart, ready]);

  const addOne = (item) => {
    if (!item?.id) return;
    setCart((prev) => {
      const id = String(item.id);
      const curr = prev[id];
      const qty = (curr?.qty || 0) + 1;
      return { ...prev, [id]: { item: curr?.item || item, qty } };
    });
  };

  const removeOne = (idOrItemId) => {
    const id = String(idOrItemId);
    setCart((prev) => {
      const curr = prev[id];
      if (!curr) return prev;
      const qty = (curr.qty || 0) - 1;
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { ...curr, qty } };
    });
  };

  const getQty = (idOrItemId) => {
  const id = String(idOrItemId);
    return cart?.[id]?.qty || 0;
  };

  const clearCart = () => setCart({});

  const itemsArray = useMemo(() => Object.values(cart), [cart]);

  const totalItems = useMemo(
    () => itemsArray.reduce((acc, x) => acc + (x.qty || 0), 0),
    [itemsArray]
  );

  const totalPrice = useMemo(
    () =>
      itemsArray.reduce((acc, x) => acc + (Number(x.item?.precio || 0) * (x.qty || 0)), 0),
    [itemsArray]
  );

  const value = {
    ready,
    cart,
    itemsArray,
    totalItems,
    totalPrice,
    addOne,
    removeOne,
    clearCart,
    getQty, // ✅ AQUI
  };


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
