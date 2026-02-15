import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";
import typography from "../../theme/typography";

function extraerMesa(dataRaw) {
  let data = String(dataRaw || "")
    .replace(/\u00A0/g, " ")   // espacio raro
    .replace(/\s+/g, " ")      // tabs/saltos -> 1 espacio
    .trim();

  // solo número
  if (/^\d+$/.test(data)) return Number(data);

  // "Mesa 1", "MESA:1", "mesa=1"
  const m1 = data.match(/mesa\s*[:=]?\s*(\d+)/i);
  if (m1?.[1]) return Number(m1[1]);

  // cualquier número
  const any = data.match(/(\d+)/);
  if (any?.[1]) return Number(any[1]);

  return null;
}

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission, requestPermission]);

  const canScan = useMemo(() => permission?.granted && !scanned, [permission?.granted, scanned]);

  const onBarcodeScanned = ({ data }) => {
    if (!canScan) return;

    // DEBUG si quieres ver qué lee exacto:
    // console.log("QR RAW:", JSON.stringify(data));

    const mesa = extraerMesa(data);

    // Ajusta rango si quieres más mesas
    if (!mesa || mesa < 1 || mesa > 4) {
      setScanned(true);
      Alert.alert("QR inválido", "Ese QR no es una mesa válida (Mesa 1 a Mesa 4).", [
        { text: "Reintentar", onPress: () => setScanned(false) },
        { text: "Salir", style: "cancel", onPress: () => router.back() },
      ]);
      return;
    }

    setScanned(true);
    router.replace({ pathname: "/(app)/cart", params: { mesa: String(mesa) } });
  };

  if (!permission) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.text}>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={[styles.text, { textAlign: "center" }]}>
          Necesito permiso para usar la cámara.
        </Text>

        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Dar permiso</Text>
        </Pressable>

        <Pressable style={[styles.btn, { marginTop: 10 }]} onPress={() => router.back()}>
          <Text style={styles.btnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Escanear mesa</Text>
        <Text style={{ width: 18 }} />
      </View>

      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Marco */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.hint}>Apunta al QR que dice “Mesa 1”, “Mesa 2”…</Text>

          {scanned && (
            <Pressable style={styles.retryBtn} onPress={() => setScanned(false)}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  text: { color: "#fff", marginTop: 10 },

  topBar: {
    paddingTop: 55,
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { color: "#fff", fontSize: 18, fontWeight: "900" },
  title: { ...typography.subtitle, color: "#fff" },

  cameraWrap: { flex: 1, position: "relative" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  frame: {
    width: 240,
    height: 240,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  hint: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 16,
    textAlign: "center",
    fontWeight: "700",
  },

  retryBtn: {
    marginTop: 16,
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: { color: colors.white, fontWeight: "900" },

  btn: {
    marginTop: 12,
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: { color: colors.white, fontWeight: "900" },
});
