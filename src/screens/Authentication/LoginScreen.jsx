import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again."
      );
      console.error("Login Error:", error);
    }
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#053f5e" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SI MIKA</Text>
        <Text style={styles.subtitle}>
          Sistem Informasi Manajemen Izin Keluar Siswa
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        onChangeText={(e) => setEmail(e)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        secureTextEntry
        onChangeText={(e) => setPassword(e)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Jika anda lupa password hubungi pengembang
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#053f5e",
    justifyContent: "center",
  },
  header: {
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#093149",
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#053f5e",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default LoginScreen;
