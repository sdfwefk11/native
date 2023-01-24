import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.style1}></View>
        <View style={styles.style2}></View>
        <View style={styles.style3}></View>
        <View></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  style1: {
    flex: 1,
    backgroundColor: "red",
  },
  style2: {
    flex: 1,
    backgroundColor: "green",
  },
  style3: {
    flex: 1,
    backgroundColor: "blue",
  },
});
