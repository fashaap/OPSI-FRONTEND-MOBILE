import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const CountdownTimer = ({ countdown }) => {
  const targetTime = new Date("2024-09-02T20:20:00Z");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
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

    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, []);

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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  timeBlock: {
    alignItems: "center",
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333",
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
});

export default CountdownTimer;
