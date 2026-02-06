import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

export default function ProductCard({ item, onAdd }) {
    const hasImage = !!item.image;

    return (
        <View style={styles.card}>
            {/* Imagen */}
            <View style={styles.imageWrap}>
                {hasImage ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.noImage}>
                        <Text style={styles.noImageText}>🍽️</Text>
                    </View>
                )}

                {/* Badge */}
                {!!item.badge && item.badge.trim() !== "" && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.category}>{item.categoria}</Text>

            <View style={styles.bottomRow}>
                <Pressable style={styles.addBtn} onPress={onAdd}>
                    <Text style={styles.addText}>+ Agregar</Text>
                </Pressable>

                <View style={styles.pricePill}>
                    <Text style={styles.priceText}>
                        Precio: C$ {Number(item.precio).toFixed(2)}
                    </Text>
                </View>
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

    imageWrap: {
        borderRadius: radius.md,
        overflow: "hidden",
        marginBottom: spacing.sm,
        position: "relative",
        backgroundColor: "rgba(0,0,0,0.06)",
    },

    image: { width: "100%", height: 95 },

    noImage: {
        width: "100%",
        height: 95,
        alignItems: "center",
        justifyContent: "center",
    },
    noImageText: { fontSize: 22 },

    badge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: colors.secondary,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: radius.md,
    },
    badgeText: { color: colors.white, fontWeight: "700", fontSize: 11 },

    name: {
        ...typography.subtitle,
        color: colors.black,
        fontSize: 14,
    },
    category: {
        ...typography.body,
        color: "rgba(0,0,0,0.65)",
        fontSize: 12,
        marginBottom: spacing.sm,
    },

    bottomRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.sm,
    },

    addBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.md,
    },
    addText: { color: colors.white, fontWeight: "700", fontSize: 12 },

    pricePill: {
        backgroundColor: colors.success,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: radius.md,
    },
    priceText: { color: colors.white, fontWeight: "700", fontSize: 12 },
});
