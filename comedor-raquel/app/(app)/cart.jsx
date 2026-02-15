import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

// ✅ Ajusta este import a tu ruta real:
import { useCart } from "../context/CartContext";

// ✅ Cambia esto por tu backend real:
const API_BASE = "http://192.168.1.13:5000";

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { itemsArray, totalItems, totalPrice, addOne, removeOne, clearCart } =
    useCart();

  const mesa = params?.mesa ? Number(params.mesa) : null;

  const irAEscanearQR = () => {
    router.push("/(app)/scan");
  };

  const enviarPedido = useCallback(async () => {
    if (!mesa) {
      Alert.alert("Falta mesa", "Primero escanea el QR de la mesa.");
      return;
    }

    if (!itemsArray.length) {
      Alert.alert("Carrito vacío", "Agrega productos antes de pedir.");
      return;
    }

    try {
      const payload = {
        mesa,
        items: itemsArray.map((r) => ({
          tipo: r.item.tipo, // "plato" | "bebida"
          id: r.item.id,
          cantidad: r.qty,
        })),
      };

      const res = await fetch(`${API_BASE}/realizarPedido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.alert("Error", json?.message || "No se pudo crear pedido");
        return;
      }

      Alert.alert("✅ Pedido enviado", `Mesa ${mesa}`);
      clearCart();
      router.replace("/(app)");
    } catch (err) {
      Alert.alert("Error conexión", err?.message || "No se pudo conectar");
    }
  }, [mesa, itemsArray, clearCart, router]);

  const confirmarPedido = () => {
    Alert.alert(
      "Confirmar pedido",
      `Mesa: ${mesa}\nItems: ${totalItems}\nTotal: C$ ${totalPrice.toFixed(
        2
      )}\n\n¿Enviar pedido?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Enviar", onPress: enviarPedido },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.title}>Tu carrito</Text>

        <Text style={styles.right}>{mesa ? `Mesa ${mesa}` : ""}</Text>
      </View>

      {itemsArray.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Carrito vacío</Text>
          <Text style={styles.emptyText}>
            Agrega platos o bebidas desde el menú.
          </Text>
          <Pressable style={styles.btn} onPress={() => router.push("/(app)")}>
            <Text style={styles.btnText}>Ir al Menú</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={itemsArray}
            keyExtractor={(x) => String(x.item.id)}
            contentContainerStyle={{ paddingBottom: 170 }}
            renderItem={({ item: row }) => (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{row.item.nombre}</Text>
                  <Text style={styles.cat}>{row.item.categoria}</Text>
                  <Text style={styles.price}>
                    C$ {Number(row.item.precio || 0).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.qtyWrap}>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => removeOne(row.item.id)}
                  >
                    <Text style={styles.qtyBtnText}>–</Text>
                  </Pressable>

                  <Text style={styles.qty}>{row.qty}</Text>

                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => addOne(row.item)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View style={styles.summary}>
            <Text style={styles.sumText}>Items: {totalItems}</Text>
            <Text style={styles.sumText}>
              Total: C$ {totalPrice.toFixed(2)}
            </Text>

            {!mesa ? (
              <Pressable style={styles.btnGreen} onPress={irAEscanearQR}>
                <Text style={styles.btnText}>📷 Escanear QR de mesa</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.btnGreen} onPress={confirmarPedido}>
                <Text style={styles.btnText}>
                  ✅ Completar pedido (Mesa {mesa})
                </Text>
              </Pressable>
            )}

            <Pressable style={styles.btnClear} onPress={clearCart}>
              <Text style={styles.clearText}>Vaciar carrito</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary, padding: spacing.md },

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
  back: { fontSize: 18, fontWeight: "900" },
  title: { ...typography.subtitle, color: colors.black },
  right: { width: 80, textAlign: "right", fontWeight: "900" },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: spacing.md,
  },

  row: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  name: { ...typography.subtitle, color: colors.black },
  cat: { ...typography.body, color: colors.text },
  price: { marginTop: 6, fontWeight: "900", color: colors.secondary },

  qtyWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { color: colors.white, fontWeight: "900", fontSize: 16 },
  qty: {
    minWidth: 22,
    textAlign: "center",
    fontWeight: "900",
    color: colors.black,
  },

  summary: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  sumText: { color: colors.black, fontWeight: "800", marginBottom: 6 },

  btnGreen: {
    backgroundColor: "#2E9A6E",
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  btn: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  btnText: { color: colors.white, fontWeight: "900" },

  btnClear: { marginTop: spacing.sm, alignItems: "center" },
  clearText: { color: "#b00020", fontWeight: "900" },
});
