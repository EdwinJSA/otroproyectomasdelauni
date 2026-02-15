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
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";


// ✅ IMPORTANTE: IP de tu PC
const API_BASE = "http://192.168.1.13:5000";



export default function Login() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async () => {

    const u = username.trim();
    const p = password;

    if (!u || !p) {
      Alert.alert("Error", "Ingresa username y password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: u,
          password: p,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // error del backend
      if (!response.ok || !data.success) {

        Alert.alert(
          "Error",
          data.message || "Credenciales incorrectas"
        );

        return;
      }

      // =========================
      // GUARDAR SESIÓN
      // =========================

      await AsyncStorage.setItem(
        "id_usuario",
        String(data.id_usuario)
      );

      await AsyncStorage.setItem(
        "username",
        u
      );

      router.replace("/(app)");

    }
    catch (error) {

      console.log(error);

      Alert.alert(
        "Error de conexión",
        "No se pudo conectar al servidor"
      );

    }
    finally {

      setLoading(false);

    }

  };

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

        {/* LOGO */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.image}
          resizeMode="contain"
        />


        {/* TITULO */}
        <Text style={styles.title}>
          Bienvenido a DataFood
        </Text>

        <Text style={styles.subtitle}>
          Comedor Raquel
        </Text>



        {/* CARD */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Inicio de Sesión
          </Text>


          {/* USERNAME */}
          <Input
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />


          {/* PASSWORD */}
          <Input
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />


          {/* LINK REGISTER */}
          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/register")}
          >
            Registrarse
          </Text>


          {/* BUTTON LOGIN */}
          <Button
            title={loading ? "Entrando..." : "Entrar"}
            onPress={iniciarSesion}
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
