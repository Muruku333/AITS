import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { View, Text } from "@/components/Themed";
import { Divider } from "react-native-paper";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Divider />
      <Text style={styles.title}>Log Out</Text>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 10,
    fontSize: 20,
    fontWeight: "300",
  },
});
