import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState, useCallback } from "react";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../context/CartContext";

const API_BASE = "http://192.168.1.13:5000";


export default function Menu() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const numColumns = width < 380 ? 1 : 2;

  const { totalItems } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchMenu = useCallback(async () => {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/menu`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const platos = Array.isArray(data.platos) ? data.platos : [];
      const bebidas = Array.isArray(data.bebidas) ? data.bebidas : [];

      const normalized = [...platos, ...bebidas].map((x) => ({
        id: x.id,
        nombre: x.nombre,
        categoria: x.categoria || (x.tipo === "bebida" ? "Bebidas" : "Platos"),
        descripcion: x.descripcion || "",
        precio: Number(x.precio || 0),
        badge: x.badge || "",
        image: x.imagenUrl || null,
        tipo: x.tipo,
      }));

      setItems(normalized);
    } catch (e) {
      setError("No pude cargar el menú. Revisa que el backend esté encendido y que la URL sea correcta.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const categories = useMemo(() => [...new Set(items.map((x) => x.categoria))], [items]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenu();
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.loadingText}>Cargando menú...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorTitle}>Ups</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={fetchMenu}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.user}>Nicolás M.</Text>

        <Pressable onPress={() => router.push("/(app)/cart")}>
          <Text style={styles.cartIcon}>
            🛒{totalItems > 0 ? ` (${totalItems})` : ""}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(cat) => cat}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item: cat }) => {
          const data = items.filter((x) => x.categoria === cat);

          return (
            <View style={{ marginBottom: spacing.md }}>
              <Text style={styles.sectionTitle}>{cat}</Text>

              <FlatList
                key={`cols-${numColumns}-${cat}`}
                data={data}
                keyExtractor={(p) => String(p.id)}
                numColumns={numColumns}
                scrollEnabled={false}
                columnWrapperStyle={numColumns === 2 ? styles.columns : undefined}
                renderItem={({ item }) => <ProductCard item={item} />}
              />
            </View>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <Pressable style={styles.goCartBtn} onPress={() => router.push("/(app)/cart")}>
          <Text style={styles.goCartText}>🛒 Ir al Carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  center: { alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.white, marginTop: spacing.sm, fontWeight: "700" },

  errorTitle: { color: colors.white, fontSize: 18, fontWeight: "800", marginBottom: spacing.sm },
  errorText: { color: "rgba(255,255,255,0.9)", textAlign: "center", marginBottom: spacing.md },

  retryBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryText: { color: colors.white, fontWeight: "800" },

  header: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  user: { ...typography.subtitle, color: colors.black, fontSize: 14 },
  cartIcon: { fontSize: 18 },

  sectionTitle: {
    ...typography.subtitle,
    color: colors.white,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  columns: { gap: spacing.md },

  bottomBar: { position: "absolute", left: spacing.md, right: spacing.md, bottom: spacing.md },
  goCartBtn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  goCartText: { color: colors.white, fontWeight: "800", fontSize: 14 },
});
