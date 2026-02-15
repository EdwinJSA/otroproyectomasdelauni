import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const API_BASE = "http://192.168.1.13:5000";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registrar = async () => {
    const u = username.trim();
    const e = email.trim();
    const p = password;

    if (!u || !p) {
      Alert.alert("Faltan datos", "Username y password son requeridos.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: u,
          email: e,
          password: p,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.alert("Error", json?.message || "No se pudo registrar.");
        return;
      }

      Alert.alert("✅ Listo", "Usuario registrado con éxito");
      router.replace("/login");
    } catch (err) {
      Alert.alert(
        "Error de conexión",
        "No se pudo conectar al backend. Revisa que Flask esté en 0.0.0.0 y que la IP sea correcta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
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
          <Text style={styles.cardTitle}>Regístrate</Text>

          <Input
            placeholder="Ingresa su nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            placeholder="Ingresa su correo"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Input
            placeholder="Ingresa su contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.link} onPress={() => router.push("/login")}>
            Iniciar Sesión
          </Text>

          <Button
            title={loading ? "Registrando..." : "Registrarse"}
            onPress={registrar}
            disabled={loading}
          />
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
  image: {
    width: 160,
    height: 160,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.black,
  },
  subtitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.lg,
  },
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
