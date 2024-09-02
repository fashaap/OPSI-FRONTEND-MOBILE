import React from "react";
import { View, ScrollView, Dimensions } from "react-native";

const FormLayout = ({ children }) => {
  return (
    <ScrollView
      style={{
        flexGrow: 1,
        backgroundColor: "#014B7C",
      }}
    >
      <View 
        style={{
          backgroundColor: "#fff",
          padding: 20,
          minHeight: Dimensions.get("window").height * 0.8,
          marginTop: (Dimensions.get("window").height * 1) / 5.5,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            // borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
            paddingHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "#fff",
            transform: [{ translateY: -110 }],
          }}
        >
          {children}
        </View>
      </View>
    </ScrollView>
  );
};

export default FormLayout;
