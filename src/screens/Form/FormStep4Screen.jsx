import { Text, View, Dimensions } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import FormLayout from "../../layouts/FormLayout";
import ProgressStepBar from "../../components/ProgressStepBar";
import { TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";
import { jwtDecode } from "jwt-decode";
import { FontAwesome } from "@expo/vector-icons";

const FormStep4Screen = () => {
  const { userToken } = useContext(AuthContext);
  const [stepStatus, setStepStatus] = useState(4);
  const [dataTicket, setDataTicket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserTicketInformation = async () => {
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      try {
        const response = await AxiosInstance.get(
          `/api/v1/tickets?idUser=${decodedToken._id}&expired=false&limit=1`,
          {
            headers: { token: userToken },
          }
        );

        if (response && response.status === 200) {
          setDataTicket(response?.data?.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserTicketInformation();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const ticket = dataTicket[0]; // Access the first item if available

  return (
    <FormLayout>
      <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
        <View style={{ padding: 10, marginTop: 20, borderRadius: 10, backgroundColor: "#DAF0FF" }}>
          <Text style={{ fontWeight: "bold", textAlign: "center", color: "#014B7C" }}>
            Segera pulang untuk verifikasi kembali. Jika tidak, anda akan dinyatakan tidak pulang
          </Text>
        </View>
        <ProgressStepBar step={stepStatus} />
      </View>

      {ticket ? (
        <View style={{ marginTop: 20, marginBottom: 20, alignSelf: "center" }}>
          <QRCode
            size={(Dimensions.get("window").width * 3) / 5}
            value={ticket._id}
          />
        </View>
      ) : (
        <View style={{ marginTop: 20, marginBottom: 20, alignSelf: "center" }}>
          <Text>No ticket data available</Text>
        </View>
      )}

      <View style={{ marginTop: 20, backgroundColor: "#FFCF87", padding: 10, borderRadius: 10 }}>
        <Text style={{ textAlign: "center", color: "#BE7200", fontWeight: "500" }}>
          Jika Anda menghadapi masalah, jangan ragu untuk menghubungi guru piket atau wali kelas Anda.
        </Text>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          marginBottom: 20,
          alignSelf: "center",
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: "#16A34A",
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          // Add contact teacher functionality here
        }}
      >
        <FontAwesome name="whatsapp" size={24} color="white" />
        <Text style={{ marginLeft: 10, color: "#FFFFFF", fontWeight: "bold" }}>
          Hubungi Guru Piket
        </Text>
      </TouchableOpacity>
    </FormLayout>
  );
};

export default FormStep4Screen;
