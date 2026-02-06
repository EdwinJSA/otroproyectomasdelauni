import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export default function Login() {
    const router = useRouter();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={require("../../assets/images/logo.png")}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Bienvenido a DataFood</Text>
                <Text style={styles.subtitle}>Comedor Raquel</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Inicio de Sesión</Text>

                    <Input placeholder="Ingresa tu nombre de usuario" />
                    <Input placeholder="Ingresa tu contraseña" secureTextEntry />

                    <Text style={styles.link} onPress={() => router.push("/(auth)/register")}>
                        Registrarse
                    </Text>

                    {/* ✅ AQUÍ: Entrar → Menú */}
                    <Button title="Entrar" onPress={() => router.replace("/(app)")} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
    },
    image: { width: 160, height: 160, marginBottom: spacing.md },
    title: { ...typography.title, color: colors.black },
    subtitle: { ...typography.body, color: colors.text, marginBottom: spacing.lg },
    card: {
        width: "90%",
        backgroundColor: colors.primary,
        borderRadius: radius.xl,
        padding: spacing.lg,
    },
    cardTitle: {
        ...typography.subtitle,
        color: colors.white,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    link: {
        color: colors.white,
        textAlign: "right",
        marginVertical: spacing.sm,
        textDecorationLine: "underline",
    },
});
