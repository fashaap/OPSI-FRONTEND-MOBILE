import React from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";

const SettingReportScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.description}>
        Jika Anda memiliki masukan atau keluhan terkait aplikasi Si Mika kami,
        kami sangat menghargai setiap sudut pandang Anda. Mohon berikan pesan
        Anda dengan detail dan dengan penuh kebaikan. Kami siap mendengarkan dan
        terbuka untuk memperbaiki aplikasi kami agar semakin baik lagi. Terima
        kasih atas kerjasamanya!
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Berikan Pesan</Text>
        <TextInput
          style={styles.textArea}
          multiline={true}
          numberOfLines={4}
          placeholder="Tulis pesan Anda disini..."
        />
      </View>
      <Button radius={"sm"} type="solid">
        Kirim
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F7F8FA",
    flexGrow: 1,
  },
  description: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C6C6C",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 10,
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
  textArea: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default SettingReportScreen;
