import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";
const ListTeacherPiketScreen = () => {
  return (
    <ScrollView style={{ flexGrow: 1, backgroundColor: "#F7F8FA" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
          paddingHorizontal: 25,
        }}
      >
        <View
          style={{
            width: "100%",
            borderRadius: 10,
            // borderWidth: 1,
            // borderColor: "#9DDCFF",

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
            backgroundColor: "#fff",
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              size={43}
              rounded
              source={{
                uri: "https://randomuser.me/api/portraits/men/36.jpg",
              }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "#333333" }}
              >
                Yayat Hidayat, S.Kom
              </Text>
              <Text style={{ fontSize: 17, color: "#333333" }}>
                Informatika
              </Text>
            </View>
            <View
              style={{
                marginLeft: "auto",
                marginRight: 10,
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#B8DDFF",
              }}
            >
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "#0075FF" }}
              >
                YYT
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ListTeacherPiketScreen;
