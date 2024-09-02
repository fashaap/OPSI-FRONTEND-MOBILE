import { Button } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const QuestionScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId,
    });
  };

  // console.log(selectedOptions);

  const questions = [
    {
      id: 1,
      question:
        "Menurut kamu seberapa efisien aplikasi ini diterapkan di sekolah?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 2,
      question:
        "Apakah kamu lebih nyaman menggunakan sistem Dispen secara digital atau sistem Dispen yang dahulu?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 3,
      question:
        "Sejauh mana kamu merasa aplikasi ini memudahkan proses Dispen dibandingkan dengan Dispen yang dulu?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 4,
      question:
        "Apakah kamu merasa lebih bertanggung jawab menggunakan dispen setelah adanya aplikasi SI MIKA ini?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 5,
      question:
        "Seberapa efektif menurut kamu fitur GPS tracking dalam aplikasi ini untuk memantau status izin keluar kamu?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 6,
      question:
        "Apakah kamu merasa nyaman menggunakan Dispen dengan adanya fitur GPS Trackingnya?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 7,
      question:
        "Bagaimana tingkat kepercayaan kamu terhadap keamanan data pribadimu yang terkait dengan penggunaan aplikasi ini?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
    {
      id: 8,
      question:
        "Bagaimana tingkat kepuasan kamu dengan penggunaan aplikasi ini secara keseluruhan?",
      options: [
        { id: 1, text: "Tidak" },
        { id: 2, text: "Baik" },
        { id: 3, text: "Cukup Baik" },
        { id: 4, text: "Ragu Ragu" },
      ],
    },
  ];

  const collectData = () => {
    const result = questions.map((question) => ({
      id: question.id,
      question: question.question,
      option: question.options.find(
        (option) => option.id === selectedOptions[question.id]
      ),
    }));
    console.log(JSON.stringify(result, null, 2));
    // kirim data disini
  };

  return (
    <ScrollView
      style={{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        backgroundColor: "#F7F8FA",
      }}
    >
      <View style={{ marginBottom: 50 }}>
        <View
          style={{ backgroundColor: "#DAF0FF", marginBottom: 15, padding: 10 }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
              color: "#014B7C",
            }}
          >
            Harap jawab semua pertanyaan dibawah ini agar anda dapat menggunakan
            fitur izin keluar.
          </Text>
        </View>
        {questions.map((question) => (
          <View
            key={question.id}
            style={{
              backgroundColor: "#DAF0FF",
              marginBottom: 15,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              {question.question}
            </Text>
            <View style={{ padding: 10, borderRadius: 8 }}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                  onPress={() =>
                    handleOptionSelect(question.id, option.id, option.text)
                  }
                >
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: "#007AFF",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                      backgroundColor:
                        selectedOptions[question.id] === option.id
                          ? "#007AFF"
                          : "transparent",
                    }}
                  >
                    {selectedOptions[question.id] === option.id && (
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 5,
                          backgroundColor: "#fff",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedOptions[question.id] === option.id
                          ? "#007AFF"
                          : "#000",
                      fontWeight:
                        selectedOptions[question.id] === option.id
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <Button
          disabled={Object.keys(selectedOptions).length !== questions.length}
          title="Submit"
          onPress={collectData}
        />
      </View>
    </ScrollView>
  );
};

export default QuestionScreen;
