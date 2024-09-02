import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Skeleton } from "@rneui/themed";
import { AuthContext } from "../Authentication/AuthContext";
import AxiosInstance from "../../fetch/AxiosInstance";
import { jwtDecode } from "jwt-decode";
import categoryTicket from "../../data/category.json";

const HistoryScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dataTicket, setDataTicket] = useState([]);
  const [userData, setUserData] = useState([]);

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
          `/api/v1/tickets?idUser=${decodedToken._id}&expired=true`,
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
        await fetchUserInformation();
        setIsLoading(false);
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  }, []);


  const badgeText = (text) => {
    let backgroundColor = "";
    let textColor = "";
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
      default:
        backgroundColor = "#e0e0e0";
        textColor = "#555";
    }

    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          flex: 1,
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {textDisplay}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
          paddingHorizontal: 25,
        }}
      >
        {dataTicket.length === 0 ? (
          isLoading ? (
            <Text
              style={{ fontSize: 20, color: "#333333", textAlign: "center" }}
            >
              Sedang mencari riwayat izin keluar...
            </Text>
          ) : (
            <Text
              style={{ fontSize: 20, color: "#333333", textAlign: "center" }}
            >
              Anda belum mempunyai riwayat izin keluar
            </Text>
          )
        ) : (
          dataTicket
            .slice()
            .reverse()
            .map((item, idx) => {
              return (
                <View key={idx} style={{ width: "100%", marginBottom: 20 }}>
                  {isLoading ? (
                    <Skeleton
                      style={{ borderRadius: 10 }}
                      height={165}
                    ></Skeleton>
                  ) : (
                    <>
                      <View
                        style={{
                          padding: 7,
                          backgroundColor: "#D0DFED",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                        }}
                      >
                        <Text style={{ fontSize: 15, color: "#333333" }}>
                          Kode Tiket
                        </Text>
                        <Text style={{ fontWeight: "bold", color: "#333333" }}>
                          {item._id}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          borderWidth: 1,
                          borderColor: "#A9E0FF",
                          backgroundColor: "#fff",
                          borderRadius: 13,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15 }}>{item.date}</Text>
                          <View style={{ flexWrap: "wrap", width: "75%" }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#333333",
                              }}
                            >
                              {userData.displayName}
                            </Text>
                          </View>

                          <View
                            style={{
                              padding: 7,
                              marginTop: 10,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <MaterialIcons
                                name="directions-walk"
                                size={30}
                                color={"#333333"}
                              />
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  color: "#333333",
                                }}
                              >
                                {item.startTime}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 20,
                                marginHorizontal: "5%",
                                fontWeight: "bold",
                                color: "#333333",
                              }}
                            >
                              -
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  color: "#333333",
                                }}
                              >
                                {item.endTime}
                              </Text>
                              {item.endTime !== null ? (
                                <MaterialIcons
                                  name="directions-walk"
                                  size={30}
                                  color="#333333"
                                  style={{ transform: [{ rotateY: "180deg" }] }}
                                />
                              ) : null}
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                              justifyContent: "space-between",
                            }}
                          >
                            {badgeText(item.category)}
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("HistoryDetail", {
                                  codeTicket: item._id,
                                })
                              }
                              style={{
                                flex: 1,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#053f5e",
                                padding: 5,
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontSize: 20,
                                  fontWeight: "bold",
                                  color: "#053f5e",
                                }}
                              >
                                Lihat detail
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              );
            })
        )}
      </View>
    </ScrollView>
  );
};

export default HistoryScreen;
