import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker"; // Ensure this library is installed
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";

const FormScreen = () => {
  const { userToken } = useContext(AuthContext);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [date, setDate] = useState(() => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [showPicker, setShowPicker] = useState(false);
  const [valueText, setValueText] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

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

  useEffect(() => {
    try {
      setIsLoading(true);

      const interval = setInterval(async () => {
        await fetchUserInformation();
        setIsLoading(false);
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  }, []);

  const toggleCheckbox1 = () => {
    setChecked1(true);
    setChecked2(false);
    setChecked3(false);
  };

  const toggleCheckbox2 = () => {
    setChecked1(false);
    setChecked2(true);
    setChecked3(false);
  };

  const toggleCheckbox3 = () => {
    setChecked1(false);
    setChecked2(false);
    setChecked3(true);
  };

  // const handleDateChange = (event, selectedDate) => {
  //   setDate(selectedDate);
  // };

  // const showDatePicker = () => {
  //   setShowPicker(true);
  // };

  const handleSelect = (selectedItems) => {
    setSelected(selectedItems);
  };

  const handleHour = (hour) => {
    const value = Number(hour);
    if (value < 1 || value > 10) {
      Alert.alert("Error", "Hour must be between 1 and 10");
      setSelectedHour(0); // Reset hour to 0
      return;
    }
    setSelectedHour(value); // Set the valid hour
  };

  const handleMinute = (minute) => {
    const value = Number(minute);
    if (value < 0 || value > 59) {
      Alert.alert("Error", "Minute must be between 0 and 59");
      setSelectedMinute(0); // Reset minute to 0
      return;
    }
    setSelectedMinute(value); // Set the valid minute
  };

  // const formatTime = (date) => {
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   hours = hours < 10 ? `0${hours}` : hours;
  //   minutes = minutes < 10 ? `0${minutes}` : minutes;
  //   return `${hours}:${minutes}`;
  // };

  // const formatTimeToDB = (date) => {
  //   let year = date.getFullYear();
  //   let month = date.getMonth() + 1;
  //   let day = date.getDate();
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();

  //   month = month < 10 ? `0${month}` : month;
  //   day = day < 10 ? `0${day}` : day;
  //   hours = hours < 10 ? `0${hours}` : hours;
  //   minutes = minutes < 10 ? `0${minutes}` : minutes;

  //   return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  // };

  const now = new Date();
  console.log("Current Date:", now.toUTCString());

  // Extract year, month, and day from the current date
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // getUTCMonth() returns 0-based index, so add 1
  const day = now.getUTCDate();

  // Extract current hour and minute in UTC
  let hour = now.getUTCHours(); // get current hour in UTC
  let minute = now.getUTCMinutes(); // get current minute in UTC

  // Custom addition to hour and minute
  // const selectedHour = 6; // Example value, replace with actual input
  // const selectedMinute = 0; // Example value, replace with actual input
  let hourCustom = hour + parseInt(selectedHour); // add selected hours to current time
  let minuteCustom = minute + parseInt(selectedMinute); // keep minutes as is

  // Handle minute overflow
  if (minuteCustom >= 60) {
    hourCustom += Math.floor(minuteCustom / 60); // Add extra hour(s) if minutes exceed 60
    minuteCustom = minuteCustom % 60; // Get remaining minutes
  }

  // Handle hour overflow (rolling over midnight)
  if (hourCustom >= 24) {
    hourCustom = hourCustom % 24; // Keep the hour within 0-23 range
  }

  const second = 0; // Set seconds to 0 or as desired

  const formatTime = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hourCustom).padStart(2, "0")}:${String(
    minuteCustom
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}Z`;

  // const formatTimeToDB = (date) => {
  //   // Implement your own formatTimeToDB logic if different from the above format
  //   return date.toISOString(); // Example implementation
  // };

  const handleFormSubmit = async () => {
    try {
      const category = checked1
        ? 7010
        : checked2
        ? 7020
        : checked3
        ? 7030
        : null;

      if (!category) {
        Alert.alert(
          "Peringatan",
          "Pilih salah satu jenis (Dispen/Izin/Izin Pulang)"
        );
        return;
      }

      if ((checked1 || checked2) && formatTime === "00:00") {
        Alert.alert(
          "Peringatan",
          "Isi form waktu yang dibutuhkan dengan benar"
        );
        return;
      }

      if (valueText === "Alasan Saya Ingin Dispen...") {
        Alert.alert("Peringatan", "Isi form alasan izin keluar");
        return;
      }

      // Additional validation
      if (
        !userData._id ||
        !userData.username ||
        !userData.nisn ||
        !userData.classGrade ||
        !userData.email
      ) {
        Alert.alert("Peringatan", "User data is incomplete");
        return;
      }

      if (!selected || selected.length === 0) {
        Alert.alert("Peringatan", "Pilih mata pelajaran");
        return;
      }

      const formData = {
        idUser: userData._id,
        username: userData.username,
        nisn: userData.nisn,
        classGrade: userData.classGrade,
        email: userData.email,
        TimeCountdown: category === 7030 ? "00:00:00" : formatTime,
        startTime: "00:00:00",
        endTime: "00:00:00",
        category,
        subjects: selected, // Ensure selected is correctly set
        description: valueText,
        codeStatus: 1111,
        date: new Date().toLocaleDateString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        image: null,
        expired: false,
      };

      // console.log("Form data:", formData);`

      try {
        const response = await AxiosInstance.post(
          "/api/v1/tickets/create",
          formData,
          {
            headers: { token: userToken },
          }
        );

        console.log("Response:", response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error response data:", error.response?.data);
        Alert.alert(
          "Error",
          "Failed to submit form. Please check your input and try again."
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("General Error:", error.message);
      Alert.alert("Error", "Failed to retrieve token. Please try again later.");
    }
  };

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0.5,
  //     base64: true,
  //   });

  //   if (!result.canceled) {
  //     const base64 = `data:image/jpg;base64,${result.assets[0].base64}`;

  //     setImage(result.assets[0].uri);
  //     setImageBase64(base64);
  //   }
  // };

  // const cancelUpload = () => {
  //   setImage(null);
  // };

  const data = [
    { key: "1", value: "Indonesia", code: "YYT", name: "yayat hidayat, S.KOM" },
    { key: "2", value: "Fisika", code: "YYT", name: "yayat hidayat, S.KOM" },
    {
      key: "3",
      value: "Matematika Wajib",
      code: "YYT",
      name: "yayat hidayat, S.KOM",
    },
    {
      key: "4",
      value: "Matematika Minat",
      code: "YYT",
      name: "yayat hidayat, S.KOM",
    },
    { key: "5", value: "Biologi", code: "YYT", name: "yayat hidayat, S.KOM" },
    { key: "6", value: "Kimia", code: "YYT", name: "yayat hidayat, S.KOM" },
    {
      key: "7",
      value: "Informatika",
      code: "YYT",
      name: "yayat hidayat, S.KOM",
    },
    {
      key: "8",
      value: "Seni Budaya",
      code: "YYT",
      name: "yayat hidayat, S.KOM",
    },
    {
      key: "9",
      value: "Sejarah Wajib",
      code: "YYT",
      name: "yayat hidayat, S.KOM",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#386A9E" />
        </View>
      )}
      <ScrollView
        style={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          backgroundColor: "#F7F8FA",
        }}
      >
        <View style={{ flexDirection: "column", gap: 10 }}>
          <View>
            <Text style={styles.textHeadingForm}>Jenis Izin Keluar</Text>
            <View style={styles.checkBoxContainer}>
              <CheckBox
                checked={checked1}
                onPress={toggleCheckbox1}
                title="Dispen"
                iconType="material-community"
                checkedIcon="checkbox-marked-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#386A9E"
                containerStyle={styles.checkBox}
                textStyle={styles.checkBoxText}
              />
              <CheckBox
                checked={checked2}
                onPress={toggleCheckbox2}
                title="Izin"
                iconType="material-community"
                checkedIcon="checkbox-marked-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#386A9E"
                containerStyle={styles.checkBox}
                textStyle={styles.checkBoxText}
              />
              <CheckBox
                checked={checked3}
                onPress={toggleCheckbox3}
                title="Izin Pulang"
                iconType="material-community"
                checkedIcon="checkbox-marked-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor="#386A9E"
                containerStyle={styles.checkBox}
                textStyle={styles.checkBoxText}
              />
            </View>
          </View>
          {!checked3 ? (
            <View>
              <Text style={styles.textHeadingForm}>Waktu Yang Dibutuhkan</Text>

              <TextInput
                editable
                multiline
                numberOfLines={3}
                maxLength={100}
                keyboardType="numeric"
                onChangeText={handleHour}
                style={styles.input}
                placeholder="Enter hour"
              />

              <TextInput
                editable
                multiline
                numberOfLines={3}
                maxLength={100}
                keyboardType="numeric"
                onChangeText={handleMinute}
                style={styles.input}
                placeholder="Enter minute"
              />
            </View>
          ) : null}

          <View>
            <Text style={styles.textHeadingForm}>Mata Pelajaran</Text>
            <MultipleSelectList
              boxStyles={{
                backgroundColor: "#FFFFFF",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#D9D9D9",
              }}
              badgeStyles={{ backgroundColor: "#386A9E" }}
              dropdownItemStyles={{ backgroundColor: "#FFFFFF" }}
              dropdownStyles={{ backgroundColor: "#FFFFFF" }}
              inputStyles={{ backgroundColor: "#FFFFFF", color: "#000000" }}
              setSelected={handleSelect}
              onSelect={() => console.log(selected)}
              data={data}
              label="Mata pelajaran yang tidak hadir"
              save="value"
            />
          </View>

          <View>
            <Text style={styles.textHeadingForm}>Alasan Izin Keluar</Text>
            <TextInput
              editable
              multiline
              numberOfLines={3}
              maxLength={100}
              onChangeText={(text) => setValueText(text)}
              value={valueText}
              style={{
                paddingHorizontal: 15,
                backgroundColor: "#FFFFFF",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#D9D9D9",
                height: Platform.OS === "ios" ? 100 : 40,
              }}
            />
          </View>

          {/* <View style={{ flexDirection: "column", gap: 10 }}>
            <Text style={styles.textHeadingForm}>Bukti Kuat (jika ada)</Text>
            <View style={styles.imagePickerContainer}>
              {!image ? (
                <TouchableOpacity
                  title="Upload Gambar Disini"
                  style={styles.imagePickerButton}
                  onPress={pickImage}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Upload Gambar Disini
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity
                    title="Ganti Gambar"
                    style={styles.imagePickerButton}
                    onPress={pickImage}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Ganti Gambar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    title="Batalkan Mengirim Gambar"
                    style={[
                      styles.imagePickerButton,
                      { backgroundColor: "red", marginTop: 10 },
                    ]}
                    onPress={cancelUpload}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Batalkan Mengirim Gambar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
          </View> */}

          <TouchableOpacity
            style={{
              backgroundColor: "#386A9E",
              paddingVertical: 15,
              borderRadius: 5,
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleFormSubmit}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Kirim Formulir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  checkBox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  checkBoxText: {
    marginLeft: 10,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  timeText: {
    marginLeft: 10,
    color: "#386A9E",
    fontSize: 16,
  },
  textHeadingForm: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerButton: {
    backgroundColor: "#386A9E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  image: {
    marginTop: 10,
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // Warna abu-abu (gray-300)
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default FormScreen;
