import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MerchantDetailScreen from './screens/MerchantDetailScreen';
import SearchScreen from './screens/SearchScreen';
import AboutScreen from './screens/AboutScreen';
import FormsScreen from './screens/FormsScreen';
import TemplesScreen from './screens/TemplesScreen';
import TempleDetailScreen from './screens/TempleDetailScreen';
import DaysEventsScreen from './screens/DaysEventsScreen';
import DaysNewsScreen from './screens/DaysNewsScreen';
import SuvidhaCardRegistrationScreen from './screens/SuvidhaCardRegistrationScreen';
import SuvidhaCardSuccessScreen from './screens/SuvidhaCardSuccessScreen';
import SuvidhaCardFailureScreen from './screens/SuvidhaCardFailureScreen';
import { StatusBar } from 'react-native';
import Colors from './constants/Colors';

type RootStackParamList = {
  Home: undefined;
  Category: { categoryId: string; categoryName: string };
  MerchantDetail: { merchant: any };
  Search: undefined;
  About: undefined;
  Forms: undefined;
  Temples: undefined;
  TempleDetail: { temple: any };
  DaysEvents: undefined;
  DaysNews: undefined;
  SuvidhaCardRegistration: undefined;
  SuvidhaCardSuccess: { applicationData?: any; submittedData?: any };
  SuvidhaCardFailure: { error?: string; errorDetails?: any; submittedData?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Forms" component={FormsScreen} />
          <Stack.Screen name="Temples" component={TemplesScreen} />
          <Stack.Screen name="TempleDetail" component={TempleDetailScreen} />
          <Stack.Screen name="DaysEvents" component={DaysEventsScreen} />
          <Stack.Screen name="DaysNews" component={DaysNewsScreen} />
          <Stack.Screen name="SuvidhaCardRegistration" component={SuvidhaCardRegistrationScreen} />
          <Stack.Screen name="SuvidhaCardSuccess" component={SuvidhaCardSuccessScreen} />
          <Stack.Screen name="SuvidhaCardFailure" component={SuvidhaCardFailureScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
