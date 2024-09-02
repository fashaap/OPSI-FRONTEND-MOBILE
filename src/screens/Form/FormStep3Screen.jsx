import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import FormLayout from "../../layouts/FormLayout";
import ProgressStepBar from "../../components/ProgressStepBar";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { statusForm } from "../../data/userInfo";
import getLocation from "../../tracking/getLocation";
import { jwtDecode } from "jwt-decode";
import { Audio } from "expo-av";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";

const FormStep3Screen = () => {
  const { userToken } = useContext(AuthContext);

  const [alertShown, setAlertShown] = useState(false);
  const [dataTicket, setDataTicket] = useState([]);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState({
    coords: {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      speed: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../../assets/level-up-191997.mp3")
    );

    console.log("Playing Sound");
    await sound.playAsync();
  }

  const fetchUserInformation = async () => {
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      try {
        const response = await AxiosInstance.get(
          `/api/v1/auth/users/${decodedToken._id}`,
          { headers: { token: userToken } }
        );

        if (response && response.status === 200) {
          setIsLoading(false);
          setUserData(response.data.data);
        } else {
          setUserData(null);
          setIsLoading(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Alert.alert("Error", "Session expired, please login again");
          setIsLoading(true);
        } else {
          Alert.alert("Error", "Failed to fetch user data");
          setIsLoading(true);
        }
      }
    }
  };

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
          setDataTicket(response.data.data[0]);
        } else {
          setIsLoading(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsLoading(true);
        } else {
          setIsLoading(true);
        }
      }
    }
  };

  const handleEditTicket = async () => {
    if (userToken && dataTicket._id) {
      try {
        const formData = {
          codeStatus: 4444,
        };

        const response = await AxiosInstance.put(
          `/api/v1/tickets/${dataTicket._id}`,
          formData,
          {
            headers: { token: userToken },
          }
        );

        if (response.status === 200) {
          setAlertShown(true);
          playSound();
        }
      } catch (error) {
        console.error("Error editing ticket:", error);
        if (error.response && error.response.status === 403) {
          Alert.alert("Error", "Session expired, please login again");
          setIsLoading(true);
        } else {
          Alert.alert("Error", "Failed to edit ticket");
          setIsLoading(true);
        }
      }
    } else {
      Alert.alert("Error", "Ticket ID not found");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await getLocation();
        if (location) {
          setLocation(location);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    const interval = setInterval(() => {
      fetchLocation();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  console.log(dataTicket._id);

  const locationHistoryPushDB = async () => {
    if (dataTicket._id) {
      const formData = {
        idUser: userData._id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
      };

      try {
        const response = await AxiosInstance.post(
          `/api/v1/location-history/${dataTicket._id}`,
          formData,
          {
            headers: { token: userToken },
          }
        );

        if (response.status === 200) {
          console.log(
            "Location history data sent successfully:",
            response.data
          );
        }
      } catch (error) {
        console.log("Error sending location history data:", error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await locationHistoryPushDB();

      setIsLoading(false);
    }, 3000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location && userData && dataTicket._id) {
      const informationLocation = {
        idUser: userData._id,
        idTicket: dataTicket._id,
        username: userData.username,
        nisn: userData.nisn,
        displayName: userData.displayName,
        classGrade: userData.classGrade,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
      };

      // console.log(informationLocation);

      AxiosInstance.put(
        `/api/v1/location/${userData._id}`,
        informationLocation,
        {
          headers: {
            token: userToken,
          },
        }
      )
        .then((response) => {
          // console.log("Location data sent successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending location data:", error);
        });
    }
  }, [location, userData, dataTicket]);

  useEffect(() => {
    try {
      setIsLoading(true);

      const interval = setInterval(async () => {
        await fetchUserInformation();
        await fetchUserTicketInformation();

        setIsLoading(false);
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  }, [alertShown]);

  const targetTime = new Date(dataTicket.TimeCountdown);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  function getTimeLeft() {
    if (!dataTicket.TimeCountdown) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const now = new Date();
    const timeDiff = targetTime - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(timeDiff / 1000) % 60;
    const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [dataTicket.TimeCountdown]);

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>00</Text>
          <Text style={styles.label}>Jam</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>00</Text>
          <Text style={styles.label}>Menit</Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>00</Text>
          <Text style={styles.label}>Detik</Text>
        </View>
      </View>
    );
  }

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
            Jika waktu telah habis dimohon verifikasi kembali dengan penjaga
            keamanan. Jika tidak, Anda kemungkinan dianggap tidak pulang.
          </Text>
        </View>
        <ProgressStepBar step={3} />
      </View>

      <View style={{ marginTop: 40 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 17 }}>
          Kode Tiket
        </Text>
        <TouchableOpacity>
          <Text
            style={{ textAlign: "center", fontWeight: "400", fontSize: 15 }}
          >
            {dataTicket._id} <AntDesign name="copy1" size={15} color="black" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 40 }}>
        <View style={{ marginBottom: 40 }}>
          <View style={styles.container}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>
                {String(timeLeft.hours).padStart(2, "0")}
              </Text>
              <Text style={styles.label}>Jam</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>
                {String(timeLeft.minutes).padStart(2, "0")}
              </Text>
              <Text style={styles.label}>Menit</Text>
            </View>
            <View style={styles.timeBlock}>
              <Text style={styles.timeText}>
                {String(timeLeft.seconds).padStart(2, "0")}
              </Text>
              <Text style={styles.label}>Detik</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#DAF0FF",
            padding: 15,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
          }}
          onPress={handleEditTicket}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#014B7C",
              textAlign: "center",
              marginLeft: 10,
            }}
          >
            SELESAI
          </Text>
        </TouchableOpacity>

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
            Jika Anda menghadapi masalah, jangan ragu untuk menghubungi guru
            piket atau wali kelas Anda.
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
          <Text
            style={{ marginLeft: 10, color: "#FFFFFF", fontWeight: "bold" }}
          >
            Hubungi Guru Piket
          </Text>
        </TouchableOpacity>
      </View>
    </FormLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeBlock: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#014B7C",
  },
  label: {
    fontSize: 16,
    color: "#014B7C",
  },
});

export default FormStep3Screen;
