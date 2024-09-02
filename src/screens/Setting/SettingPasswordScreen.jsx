import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Input, Icon } from "@rneui/themed";
import { Button } from "@rneui/base";

const SettingPasswordScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.instructionText}>
        Untuk menjaga keamanan data Anda, tolong jangan berbagi kata sandi Anda
        kepada siapapun.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password Lama</Text>
        <Input
          placeholder="Masukkan password lama"
          leftIcon={{ type: "feather", name: "lock" }}
          containerStyle={styles.input}
        />
        <Text style={styles.label}>Password Baru</Text>
        <Input
          placeholder="Masukkan password baru"
          leftIcon={{ type: "feather", name: "lock" }}
          containerStyle={styles.input}
        />
        <Text style={styles.label}>Verifikasi Password Baru</Text>
        <Input
          placeholder="Verifikasi password baru"
          leftIcon={{ type: "feather", name: "lock" }}
          containerStyle={styles.input}
        />
      </View>
      <Button
        radius={"sm"}
        type="solid"
        icon={<Icon name="save" color="white" />}
      >
        Save
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
  instructionText: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6C6C6C",
  },
  inputContainer: {
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    marginBottom: 20,
  },
});

export default SettingPasswordScreen;
