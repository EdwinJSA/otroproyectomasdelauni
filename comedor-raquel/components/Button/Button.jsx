import { Pressable, Text, StyleSheet } from "react-native";
import colors from "../../theme/colors";
import typography from "../../theme/typography";
import radius from "../../theme/radius";
import spacing from "../../theme/spacing";

export default function Button({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    ...typography.button,
  },
});
