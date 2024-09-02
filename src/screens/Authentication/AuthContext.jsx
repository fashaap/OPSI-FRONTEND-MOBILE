import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import AxiosInstance from "../../fetch/AxiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await AxiosInstance.post("/api/v1/auth/users/signin", {
        email,
        password,
      });
      if (response.data && response.data.token) {
        setIsLoading(false);

        setUserInfo(response.data);
        setUserToken(response.data.token.refreshToken);

        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
        await AsyncStorage.setItem(
          "userToken",
          response.data.token.refreshToken
        );
      } else {
        console.error(
          "login error",
          response.data ? response.data.error : "empty response"
        );
      }
    } catch (error) {
      console.error("login error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      const storedUserToken = await AsyncStorage.getItem("userToken");

      if (storedUserInfo && storedUserToken) {
        setUserInfo(JSON.parse(storedUserInfo));
        setUserToken(storedUserToken);
      }
    } catch (error) {
      console.error("Error retrieving token from storage", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isLoading, userToken, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
