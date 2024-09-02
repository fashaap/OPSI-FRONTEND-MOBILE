import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { statusForm } from './data/userInfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home/HomeScreen';
import HistoryScreen from './screens/History/HistoryScreen';
import FormScreen from './screens/Form/FormScreen';
import NotificationScreen from './screens/Notification/NotificationScreen';
import SettingScreen from './screens/Setting/SettingScreen';
import LoginScreen from './screens/Authentication/LoginScreen';
import ButtonBottom from './components/ButtonBottom';
import ListTeacherScreen from './screens/List/ListTeacherScreen';
import ListTeacherBKScreen from './screens/List/ListTeacherBKScreen';
import ListTeacherPiketScreen from './screens/List/ListTeacherPiketScreen';
import ListSecurityScreen from './screens/List/ListSecurityScreen';
import HistoryDetailScreen from './screens/History/HistoryDetailScreen';
import FormStep1Screen from './screens/Form/FormStep1Screen';
import FormStep2Screen from './screens/Form/FormStep2Screen';
import FormStep3Screen from './screens/Form/FormStep3Screen';
import SettingProfileScreen from './screens/Setting/SettingProfileScreen';
import SettingPasswordScreen from './screens/Setting/SettingPasswordScreen';
import SettingReportScreen from './screens/Setting/SettingReportScreen';
import QuestionScreen from './screens/Question/QuestionScreen';
import FormStep4Screen from './screens/Form/FormStep4Screen';
import SettingPrivacyScreen from './screens/Setting/SettingPrivacyScreen';
import { jwtDecode } from 'jwt-decode';
import { ActivityIndicator, Alert, View } from 'react-native';
import { AuthContext, AuthProvider } from './screens/Authentication/AuthContext';
import AxiosInstance from './fetch/AxiosInstance';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ListGuruMapel" component={ListTeacherScreen} />
      <Stack.Screen name="ListGuruBK" component={ListTeacherBKScreen} />
      <Stack.Screen name="ListGuruPiket" component={ListTeacherPiketScreen} />
      <Stack.Screen name="ListSecurity" component={ListSecurityScreen} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HistoryMain" options={{ headerLeft: null }} component={HistoryScreen} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
    </Stack.Navigator>
  );
}

function FormStack() {
  const { userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dataTicket, setDataTicket] = useState([]);

  const fetchUserTicketInformation = async () => {
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      try {
        const response = await AxiosInstance.get(
          `/api/v1/tickets?idUser=${decodedToken._id}&expired=false&limit=1`,
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
          Alert.alert("Error", "Session expired, please login again");
          setIsLoading(true);
        } else {
          Alert.alert("Error", "Failed to fetch ticket data");
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
        setIsLoading(false);
      }, 1000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log(error);
      setIsLoading(true);
    }
  }, []);

  const currentForm = () => {
    switch (dataTicket[0]?.codeStatus) {
      case 1111:
        return FormStep1Screen;
      case 2222:
        return FormStep2Screen;
      case 3333:
        return FormStep3Screen;
      case 4444:
        return FormStep4Screen;
      default:
        return FormScreen;
    }
  };
  const FormComponent = currentForm();

  

  return (
    <Stack.Navigator>
      {statusForm.verifForm === 9999 ? (
        <Stack.Screen
          name="Form"
          component={FormComponent}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={SettingProfileScreen} />
      <Stack.Screen name="ChangePassword" component={SettingPasswordScreen} />
      <Stack.Screen name="Report" component={SettingReportScreen} />
      <Stack.Screen name="Privacy" component={SettingPrivacyScreen} />
    </Stack.Navigator>
  );
}

function TabNavigatorStudent() {
  return (
    <Tab.Navigator tabBar={props => <ButtonBottom {...props} />}>
      <Tab.Screen name="HomeTab" options={{ headerShown: false }} component={HomeStack} />
      <Tab.Screen name="History" options={{ headerShown: false }} component={HistoryStack} />
      <Tab.Screen name="LOGO" component={FormStack} />
      <Tab.Screen name="Notification" component={NotificationStack} />
      <Tab.Screen name="Setting" options={{ headerShown: false }} component={SettingStack} />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken !== null ? (
        <Stack.Screen name="Student" component={TabNavigatorStudent} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}

    </Stack.Navigator>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}