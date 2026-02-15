import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";
import { useCart } from "../../app/context/CartContext";

export default function ProductCard({ item }) {
  const { addOne, removeOne, getQty } = useCart();

  const qty = getQty(item.id);
  const img = item?.image || item?.imagenUrl || null;

  return (
    <View style={styles.card}>
      {/* Imagen */}
      {img ? (
        <Image source={{ uri: img }} style={styles.img} resizeMode="cover" />
      ) : (
        <View style={styles.imgPlaceholder}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}

      {/* Info */}
      <Text style={styles.name} numberOfLines={1}>
        {item.nombre}
      </Text>
      <Text style={styles.cat} numberOfLines={1}>
        {item.categoria}
      </Text>

      <View style={styles.bottom}>
        <Text style={styles.price}>C$ {Number(item.precio || 0).toFixed(2)}</Text>

        {/* Controles */}
        {qty === 0 ? (
          <Pressable style={styles.addBtn} onPress={() => addOne(item)}>
            <Text style={styles.addText}>+ Agregar</Text>
          </Pressable>
        ) : (
          <View style={styles.qtyWrap}>
            <Pressable style={styles.qtyBtn} onPress={() => removeOne(item.id)}>
              <Text style={styles.qtyBtnText}>–</Text>
            </Pressable>

            <Text style={styles.qty}>{qty}</Text>

            <Pressable style={styles.qtyBtn} onPress={() => addOne(item)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },

  img: {
    width: "100%",
    height: 110,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },

  imgPlaceholder: {
    width: "100%",
    height: 110,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: { fontSize: 26 },

  name: { ...typography.subtitle, color: colors.black },
  cat: { ...typography.body, color: colors.text, marginTop: 2 },

  bottom: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  price: { fontWeight: "900", color: colors.secondary },

  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  addText: { color: colors.white, fontWeight: "900", fontSize: 12 },

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

  qty: { minWidth: 18, textAlign: "center", fontWeight: "900", color: colors.black },
});
