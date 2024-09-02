import { View, Text, ScrollView, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Icon, Input } from "@rneui/base";
import { Button } from "@rneui/themed";
import { AuthContext } from "../Authentication/AuthContext";
import { jwtDecode } from "jwt-decode";
import AxiosInstance from "../../fetch/AxiosInstance";

const SettingProfileScreen = () => {
  const { userToken } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState([]);

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
      }
    }
  };

  useEffect(() => {
    fetchUserInformation();
  }, []);
  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Avatar
            size={50}
            rounded
            source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>
              {dataUser.displayName}
            </Text>
            <Text style={{ fontWeight: "400", fontSize: 15 }}>
              {dataUser.nisn} | {dataUser.classGrade}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                marginBottom: 10,
                color: "#333",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Nama Pengguna
            </Text>
            <Input
              placeholder={dataUser.username}
              disabled={true}
              leftIcon={{ type: "feather", name: "user" }}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                marginBottom: 10,
                color: "#333",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Nama
            </Text>
            <Input
              placeholder={dataUser.displayName}
              disabled={true}
              leftIcon={{ type: "feather", name: "user" }}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                marginBottom: 10,
                color: "#333",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Email
            </Text>
            <Input
              placeholder={dataUser.email}
              disabled={true}
              leftIcon={{ type: "feather", name: "mail" }}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                marginBottom: 10,
                color: "#333",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              Code Wali Kelas
            </Text>  
            <Input
              placeholder={dataUser.code}
              disabled={true}
              leftIcon={{ type: "feather", name: "user" }}
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Button
            radius={"sm"}
            type="solid"
            icon={<Icon name="save" color="white" />}
          >
            Save
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingProfileScreen;
