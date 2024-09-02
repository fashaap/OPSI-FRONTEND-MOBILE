import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Skeleton } from "@rneui/themed";
import categoryTicket from "../../data/category.json";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";
import { jwtDecode } from "jwt-decode";

const HistoryDetailScreen = () => {
  const { userToken } = useContext(AuthContext);
  const route = useRoute();
  const { codeTicket } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataTicket, setDataTicket] = useState({});
  const [dataUser, setDataUser] = useState({});

  const fetchUserInformation = async () => {
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      try {
        const response = await AxiosInstance.get(
          `/api/v1/auth/users/${decodedToken._id}`,
          { headers: { token: userToken } }
        );

        if (response.status === 200) {
          setDataUser(response.data.data);
        } else {
          setDataUser({});
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Alert.alert("Error", "Session expired, please login again");
        } else {
          Alert.alert("Error", "Failed to fetch user data");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchUserTicketInformation = async () => {
    if (userToken) {
      try {
        const response = await AxiosInstance.get(
          `/api/v1/tickets/${codeTicket}`,
          { headers: { token: userToken } }
        );

        if (response.status === 200) {
          setDataTicket(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          Alert.alert("Error", "Session expired, please login again");
        } else {
          Alert.alert("Error", "Failed to fetch ticket data");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserTicketInformation();
    fetchUserInformation();

    // No need for interval here; fetching once on mount
  }, []);

  const imageUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRET-vdSZCUGSZHPHY0TBpQW-Nqu9ZeZ5KNjg`;

  const badgeText = (text) => {
    let backgroundColor = "#e0e0e0";
    let textColor = "#555";
    let textDisplay = "";

    switch (text) {
      case categoryTicket.dispen:
        backgroundColor = "#A9E0FF";
        textColor = "#053f5e";
        textDisplay = "DISPEN";
        break;
      case categoryTicket.izin:
        backgroundColor = "#ffd587";
        textColor = "#f9a813";
        textDisplay = "IZIN";
        break;
      case categoryTicket.izin_Pulang:
        backgroundColor = "#ff8587";
        textColor = "#d91d1d";
        textDisplay = "IZIN PULANG";
        break;
    }

    return (
      <View
        style={{
          backgroundColor,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {textDisplay}
        </Text>
      </View>
    );
  };

  const formatDate = (date) => {
    const convert = new Date(date);
    return `${convert.getDate()} ${
      [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ][convert.getMonth()]
    } ${convert.getFullYear()}`;
  };

  const formatTime = (time) => {
    const convert = new Date(time);
    return `${convert.getHours()}:${convert.getMinutes()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.ticketInfo}>
        {isLoading ? (
          <Skeleton width={90} height={16} />
        ) : (
          <Text style={styles.label}>Kode Tiket</Text>
        )}
        {isLoading ? (
          <Skeleton style={styles.skeleton} width={200} height={18} />
        ) : (
          <Text style={styles.ticketCode}>{dataTicket._id}</Text>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <View>
            {isLoading ? (
              <Skeleton width={100} height={16} />
            ) : (
              <Text style={styles.dateText}>{dataTicket.date}</Text>
            )}
            {isLoading ? (
              <Skeleton style={styles.skeleton} width={170} height={20} />
            ) : (
              <Text style={styles.userName}>{dataUser.displayName}</Text>
            )}
          </View>

          {isLoading ? (
            <Skeleton style={styles.skeleton} width={56} height={35} />
          ) : (
            <View>{badgeText(dataTicket.category)}</View>
          )}
        </View>

        <View style={styles.timeContainer}>
          {isLoading ? (
            <Skeleton width={150} height={25} />
          ) : (
            <>
              <Text style={styles.timeText}>{dataTicket.startTime}</Text>
              <Text style={styles.separator}>-</Text>
              <Text style={styles.timeText}>{dataTicket.endTime}</Text>
            </>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          {isLoading ? (
            <Skeleton style={styles.skeleton} width={100} height={15} />
          ) : (
            <Text style={styles.descriptionLabel}>Alasan:</Text>
          )}
          {isLoading ? (
            <Skeleton width={"100%"} height={200} />
          ) : (
            <Text style={styles.descriptionText}>{dataTicket.description}</Text>
          )}
        </View>

        {/* Image section commented out */}
        {/* <View style={styles.imageContainer}>
          {isLoading ? (
            <Skeleton style={styles.skeleton} width={100} height={15} />
          ) : (
            <Text style={styles.imageLabel}>Bukti:</Text>
          )}
          {isLoading ? (
            <Skeleton width={"100%"} height={200} />
          ) : (
            <View style={styles.imageWrapper}>
              {dataTicket.image ? (
                <>
                  <Image
                    source={{ uri: dataTicket.image }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  {!modalVisible && (
                    <TouchableOpacity
                      style={styles.viewImageButton}
                      onPress={() => setModalVisible(true)}
                    >
                      <Text style={styles.viewImageText}>View Image</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.noImageText}>No Image</Text>
              )}
            </View>
          )}
        </View> */}
      </View>

      {/* Modal commented out */}
      {/* {dataTicket.image && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: imageUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#F7F8FA",
  },
  ticketInfo: {
    marginBottom: 20,
  },
  label: {
    color: "#555",
    fontSize: 16,
    marginBottom: 5,
  },
  skeleton: {
    marginTop: 5,
  },
  ticketCode: {
    color: "#333",
    fontSize: 15,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
    marginBottom: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    color: "#666",
    fontSize: 16,
  },
  userName: {
    color: "#444",
    fontSize: 18,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    color: "#666",
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageLabel: {
    color: "#666",
    fontSize: 16,
    marginBottom: 5,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  viewImageButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  viewImageText: {
    color: "#fff",
    fontSize: 14,
  },
  noImageText: {
    color: "#999",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 100,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#333",
  },
});

export default HistoryDetailScreen;
