import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import FormLayout from "../../layouts/FormLayout";
import ProgressStepBar from "../../components/ProgressStepBar";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import CountdownTimer from "../../components/CountdownTimer";
import { statusForm } from "../../data/userInfo";
import getLocation from "../../tracking/getLocation";
import { jwtDecode } from "jwt-decode";
import { Audio } from "expo-av";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";

const FormStep3Screen = () => {
  const { userToken } = useContext(AuthContext);
  if (!userToken) {
    Alert.alert("Error", "User is not authenticated");
    return;
  }

  const [stepStatus, setStepStatus] = useState(3);
  const [alertShown, setAlertShown] = useState(false);
  const [dataTicket, setDataTicket] = useState([]);
  const [userData, setUserData] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userToken) {
          const decodedToken = jwtDecode(userToken);

          // Fetch user information
          const userResponse = await AxiosInstance.get(
            `/api/v1/auth/users/${decodedToken._id}`,
            { headers: { token: userToken }, timeout: 10000 }
          );
          if (userResponse && userResponse.status === 200) {
            setUserData(userResponse.data.data);
          } else {
            setUserData(null);
          }

          // Fetch user ticket information
          const ticketResponse = await AxiosInstance.get(
            `/api/v1/tickets?idUser=${decodedToken._id}&expired=false&limit=1`,
            { headers: { token: userToken }, timeout: 10000 }
          );
          if (ticketResponse && ticketResponse.status === 200) {
            setDataTicket(ticketResponse.data.data);
          }
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            Alert.alert("Error", "Session expired, please login again");
          } else {
            Alert.alert(
              "Error",
              "Failed to fetch data: " + error.response.statusText
            );
          }
        } else {
          Alert.alert("Error", "Network error or server not reachable");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => clearInterval(fetchDataInterval);
  }, [userToken]);

  const playSound = async () => {
    try {
      if (!userData || !dataTicket || !dataTicket[0]) {
        return;
      }

      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/level-up-191997.mp3")
      );
      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.error("Error loading or playing sound:", error);
      Alert.alert("Error", "Failed to play sound");
    }
  };

  useEffect(() => {
    playSound();
  }, [userData, dataTicket]);

  useEffect(() => {
    let intervalId = null;

    const fetchLocation = async () => {
      try {
        const location = await getLocation();
        if (location) {
          setUserLocation(location);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    intervalId = setInterval(fetchLocation, 1000);

    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    const sendLocationData = async () => {
      if (userLocation && userData && dataTicket[0]) {
        const informationLocation = {
          idUser: userData._id,
          idTicket: dataTicket[0]._id,
          username: userData.username,
          nisn: userData.nisn,
          displayName: userData.displayName,
          classGrade: userData.classGrade,
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          timestamp: Date.now(),
          speed: userLocation.coords.speed,
          accuracy: userLocation.coords.accuracy,
        };

        console.log("Sending location data:", informationLocation);

        try {
          await AxiosInstance.put(
            `/api/v1/location/${userData._id}`,
            informationLocation,
            { headers: { token: userToken }, timeout: 10000 }
          );
          console.log("Location data sent successfully");

          await AxiosInstance.post(
            `/api/v1/location-history/${dataTicket[0]._id}`,
            informationLocation,
            { headers: { token: userToken }, timeout: 10000 }
          );
          console.log("Location history data sent successfully");
        } catch (error) {
          console.error("Error sending location data:", error);
          Alert.alert(
            "Error",
            "There was a problem sending your location data. Please try again later."
          );
          // Optional: Implement retry logic here if necessary
        }
      }
    };

    sendLocationData();
  }, [userLocation, userData, dataTicket, userToken]);

  const dateString = "2024-07-14T00:03:00";
  const dateObject = new Date(dateString);

  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  const second = dateObject.getSeconds();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FormLayout>
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
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
            Jika waktu telah habis dimohon verifikasi kembali dengan penjaga
            keamanan. Jika tidak, Anda kemungkinan dianggap tidak pulang.
          </Text>
        </View>
        <ProgressStepBar step={stepStatus} />
      </View>

      <View style={{ marginTop: 40 }}>
        <View style={{ marginBottom: 40 }}>
          <CountdownTimer
            hourValue={hour}
            minuteValue={minute}
            secondValue={second}
          />
        </View>

        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 17 }}>
          Kode Tiket
        </Text>
        <Text style={{ textAlign: "center", fontWeight: "400", fontSize: 15 }}>
          {statusForm.code}
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 20,
            alignSelf: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AntDesign name="copy1" size={20} color="black" />
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 20 }}>
            Salin Kode
          </Text>
        </TouchableOpacity>
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
          style={{ textAlign: "center", color: "#BE7200", fontWeight: "500" }}
        >
          Jika Anda menghadapi masalah, jangan ragu untuk menghubungi guru piket
          atau wali kelas Anda.
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

export default FormStep3Screen;
