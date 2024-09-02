import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import ProgressStepBar from "../../components/ProgressStepBar";
import FormLayout from "../../layouts/FormLayout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Audio } from "expo-av";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";

const FormStep1Screen = () => {
  const { userToken } = useContext(AuthContext);
  const [stepStatus, setStepStatus] = useState(1);
  const [alertShown, setAlertShown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataTicket, setDataTicket] = useState([]);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/level-up-191997.mp3")
    );

    console.log("Playing Sound");
    await sound.playAsync();
  }

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
          setIsLoading(false);

          setDataTicket(response?.data?.data);
        } else {
          setIsLoading(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Alert.alert("Error", "Session expired, please login again");
          setIsLoading(true);
        } else {
          // Alert.alert("Error", "Failed to fetch ticket data");
          setIsLoading(true);
        }
      }
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);

      const interval = setInterval(async () => {
        await fetchUserTicketInformation();
        setIsLoading(false);
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  }, [alertShown]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleDeleteTicket = async () => {
    if (userToken) {
      try {
        await AxiosInstance.delete(`/api/v1/tickets/${dataTicket[0]?._id}`, {
          headers: { token: userToken },
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Alert.alert("Error", "Session expired, please login again");
          setIsLoading(true);
        } else {
          // Alert.alert("Error", "Failed to fetch ticket data");
          setIsLoading(true);
        }
      }
    }
  };

  const confirmDeletion = () => {
    Alert.alert("Peringatan", "Apakah Anda yakin ingin menghapus tiket ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Ya",
        onPress: () => handleDeleteTicket(),
      },
    ]);
  };

  return (
    <FormLayout>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            padding: 10,

            marginTop: 20,
            borderRadius: 10,
            backgroundColor: "#DAF0FF",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#014B7C",
            }}
          >
            Mohon tunggu sampai piket mengizinkan anda
          </Text>
        </View>
        <ProgressStepBar step={stepStatus} />
      </View>

      <View style={{ marginTop: 100, marginBottom: 100 }}>
        <Text style={{ textAlign: "center", fontWeight: 500, fontSize: 17 }}>
          STATUS ANDA MASIH DALAM PROSES IZIN PIKET
        </Text>
      </View>

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#FFCF87",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{ textAlign: "center", color: "#BE7200", fontWeight: 500 }}
        >
          Jika Anda masih menunggu izin piket dengan waktu yang lama, silakan
          datangi guru Piket.
        </Text>
      </View>

      <TouchableOpacity
        onPress={confirmDeletion}
        style={{
          marginTop: 20,
          alignSelf: "center",
          padding: 15,
          backgroundColor: "#C14747",
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
          Batalkan Izin Keluar
        </Text>
      </TouchableOpacity>
    </FormLayout>
  );
};

export default FormStep1Screen;
