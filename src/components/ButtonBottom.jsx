import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { useState } from "react";

const ButtonBottom = ({ state, descriptors, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const buttons = [
    {
      name: "HomeTab",
      icon: "home",
    },
    {
      name: "History",
      icon: "barschart",
    },
    {
      name: "Form",
      icon: "pluscircleo",
    },
    {
      name: "Notification",
      icon: "notification",
    },
    {
      name: "Setting",
      icon: "setting",
    },
  ];

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //     ? options.title
        //     : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={isLoading ? null : onPress}
            onLongPress={onLongPress}
            style={[
              Platform.OS === "ios" ? styles.buttonIOS : styles.buttonAndroid,
              { borderTopWidth: isFocused ? 4 : 0 },
            ]}
          >
            {isLoading ? (
              <Skeleton width={50} height={50}></Skeleton>
            ) : (
              <AntDesign name={buttons[index].icon} size={28} color="#ffffff" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", backgroundColor: "#0F5388" },
  buttonIOS: {
    flex: 1,
    borderTopColor: "#fff",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  buttonAndroid: {
    flex: 1,
    borderTopColor: "#fff",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default ButtonBottom;
