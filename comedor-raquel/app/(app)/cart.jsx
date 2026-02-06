import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

export default function Cart() {
    const router = useRouter();

    return (
        <View style={styles.screen}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.userWrap}>
                    <Image
                        source={{ uri: "https://i.pravatar.cc/100" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.user}>Nicolás M.</Text>
                </View>

                <Pressable onPress={() => router.back()}>
                    <Text style={styles.backIcon}>✖</Text>
                </Pressable>
            </View>

            {/* TITULO */}
            <View style={styles.titleRow}>
                <Text style={styles.cartIcon}>👜</Text>
                <Text style={styles.title}>Tu carrito</Text>
            </View>

            {/* ITEM DEL CARRITO */}
            <View style={styles.itemCard}>
                <Image
                    source={{
                        uri: "https://pub-abbf7ac480e44031bc258c3d83e958e5.r2.dev/carneasada.png",
                    }}
                    style={styles.itemImage}
                />

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>Carne Asada</Text>
                    <Text style={styles.itemDesc}>
                        Carne Asada, con gallopinto, tajadas, y así
                    </Text>
                    <Text style={styles.itemPrice}>C$ 150</Text>
                </View>

                <View style={styles.quantityWrap}>
                    <Pressable style={styles.qtyBtn}>
                        <Text style={styles.qtyText}>−</Text>
                    </Pressable>

                    <Text style={styles.qtyNumber}>1</Text>

                    <Pressable style={styles.qtyBtn}>
                        <Text style={styles.qtyText}>+</Text>
                    </Pressable>
                </View>
            </View>

            {/* RESUMEN */}
            <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Resumen de Pedido</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Subtotal</Text>
                    <Text style={styles.value}>C$ 120</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>IVA (15%)</Text>
                    <Text style={styles.value}>C$ 18</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Propina (10%)</Text>
                    <Text style={styles.value}>C$ 12</Text>
                </View>
            </View>

            {/* BOTÓN FINAL */}
            <View style={styles.bottomBar}>
                <Pressable style={styles.payBtn}>
                    <Text style={styles.payText}>✓ Completar de Pedido</Text>
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

    /* HEADER */
    header: {
        backgroundColor: colors.white,
        borderRadius: radius.md,
        padding: spacing.sm,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    userWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },

    user: {
        ...typography.subtitle,
        color: colors.black,
        fontSize: 14,
    },

    backIcon: {
        fontSize: 18,
    },

    /* TITLE */
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },

    cartIcon: {
        fontSize: 20,
    },

    title: {
        ...typography.subtitle,
        color: colors.white,
    },

    /* ITEM */
    itemCard: {
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        padding: spacing.sm,
        flexDirection: "row",
        gap: spacing.sm,
        alignItems: "center",
    },

    itemImage: {
        width: 70,
        height: 70,
        borderRadius: radius.md,
    },

    itemInfo: {
        flex: 1,
    },

    itemName: {
        fontWeight: "700",
        fontSize: 14,
    },

    itemDesc: {
        fontSize: 12,
        color: "#555",
    },

    itemPrice: {
        fontWeight: "700",
        marginTop: 4,
    },

    quantityWrap: {
        alignItems: "center",
        gap: 4,
    },

    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center",
    },

    qtyText: {
        color: colors.white,
        fontWeight: "700",
    },

    qtyNumber: {
        fontWeight: "700",
    },

    /* SUMMARY */
    summary: {
        marginTop: spacing.lg,
    },

    summaryTitle: {
        color: colors.white,
        fontWeight: "700",
        marginBottom: spacing.sm,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    label: {
        color: "#eee",
    },

    value: {
        color: "#eee",
        fontWeight: "600",
    },

    /* BOTTOM */
    bottomBar: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.md,
    },

    payBtn: {
        backgroundColor: colors.success,
        paddingVertical: spacing.md,
        borderRadius: radius.lg,
        alignItems: "center",
    },

    payText: {
        color: colors.white,
        fontWeight: "800",
    },
});
