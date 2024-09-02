import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";

const ProgressStepBar = ({ step }) => {
  return (
    <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
      <TouchableOpacity style={styles.stepContainer}>
        <Avatar
          size={32}
          rounded
          title="1"
          containerStyle={[styles.avatar, step >= 1 && styles.activeAvatar]}
        />
        <Text style={[styles.stepLabel, step >= 1 && styles.activeLabel]}>
          Izin Piket
        </Text>
      </TouchableOpacity>
      <View style={[styles.line, step >= 2 && styles.activeLine]} />
      <TouchableOpacity style={styles.stepContainer}>
        <Avatar
          size={32}
          rounded
          title="2"
          containerStyle={[styles.avatar, step >= 2 && styles.activeAvatar]}
        />
        <Text style={[styles.stepLabel, step >= 2 && styles.activeLabel]}>
          Verifikasi
        </Text>
      </TouchableOpacity>
      <View style={[styles.line, step >= 3 && styles.activeLine]} />
      <TouchableOpacity style={[styles.stepContainer]}>
        <Avatar
          size={32}
          rounded
          title="3"
          containerStyle={[styles.avatar, step >= 3 && styles.activeAvatar]}
        />
        <Text style={[styles.stepLabel, step >= 3 && styles.activeLabel]}>
          Keluar
        </Text>
      </TouchableOpacity>
      <View style={[styles.line, step >= 4 && styles.activeLine]} />
      <TouchableOpacity style={[styles.stepContainer]}>
        <Avatar
          size={32}
          rounded
          title="4"
          containerStyle={[styles.avatar, step >= 4 && styles.activeAvatar]}
        />
        <Text style={[styles.stepLabel, step >= 4 && styles.activeLabel]}>
          Pulang
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  stepContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    marginTop: 17,
  },
  avatar: {
    backgroundColor: "#e0e0e0",
  },
  activeAvatar: {
    backgroundColor: "#014B7C",
  },
  line: {
    height: 4,
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  activeLine: {
    backgroundColor: "#014B7C",
  },
  stepLabel: {
    color: "#bebebe",
    fontWeight: "600",
    marginTop: 5,
    width: 100,
    textAlign: "center",
  },
  activeLabel: {
    color: "#014B7C",
  },
};

export default ProgressStepBar;
