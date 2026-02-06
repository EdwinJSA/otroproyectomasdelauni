import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

import ProductCard from "../../components/ProductCard/ProductCard";
import { menuData } from "../../mocks/menu.mock";

export default function Menu() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    // ✅ Si la pantalla es pequeña, 1 columna; si es normal, 2 columnas
    const numColumns = width < 380 ? 1 : 2;

    const categories = [...new Set(menuData.map((x) => x.categoria))];

    return (
        <View style={styles.screen}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.user}>Nicolás M.</Text>

                {/* ✅ Ir al carrito */}
                <Pressable onPress={() => router.push("/(app)/cart")}>
                    <Text style={styles.cartIcon}>🛒</Text>
                </Pressable>
            </View>

            {/* LISTA DE CATEGORÍAS */}
            <FlatList
                data={categories}
                keyExtractor={(cat) => cat}
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: cat }) => {
                    const data = menuData.filter((x) => x.categoria === cat);

                    return (
                        <View style={{ marginBottom: spacing.md }}>
                            <Text style={styles.sectionTitle}>{cat}</Text>

                            <FlatList
                                key={`cols-${numColumns}-${cat}`} // ✅ fuerza recalculo por columna + categoría
                                data={data}
                                keyExtractor={(p) => String(p.id)}
                                numColumns={numColumns}
                                scrollEnabled={false}
                                columnWrapperStyle={numColumns === 2 ? styles.columns : undefined}
                                renderItem={({ item }) => (
                                    <ProductCard item={item} onAdd={() => { }} />
                                )}
                            />
                        </View>
                    );
                }}
            />

            {/* BOTÓN FIJO ABAJO */}
            <View style={styles.bottomBar}>
                <Pressable
                    style={styles.goCartBtn}
                    onPress={() => router.push("/(app)/cart")}
                >
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

    columns: {
        gap: spacing.md,
    },

    bottomBar: {
        position: "absolute",
        left: spacing.md,
        right: spacing.md,
        bottom: spacing.md,
    },

    goCartBtn: {
        backgroundColor: colors.secondary,
        borderRadius: radius.lg,
        paddingVertical: spacing.md,
        alignItems: "center",
    },

    goCartText: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 14,
    },
});
