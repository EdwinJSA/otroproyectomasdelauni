import { View, TextInput, StyleSheet } from "react-native";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import radius from "../../theme/radius";

export default function Input(props) {
    return (
        <View style={styles.wrapper}>
            <TextInput
                {...props}
                style={styles.input}
                placeholderTextColor="rgba(255,255,255,0.6)"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: spacing.md,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        borderRadius: radius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        color: colors.white,
    },
});
