import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://mnjkvx93-8000.asse.devtunnels.ms/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default AxiosInstance;
