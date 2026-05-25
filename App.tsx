import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import BrowseScreen from './src/screens/BrowseScreen';
import ModeDetailScreen from './src/screens/ModeDetailScreen';
import LearnScreen from './src/screens/LearnScreen';
import LessonScreen from './src/screens/LessonScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Onboarding, { hasSeenOnboarding } from './src/components/Onboarding';
import { colors } from "./src/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const BrowseStack = createNativeStackNavigator();
const LearnStack = createNativeStackNavigator();

function BrowseNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="BrowseList" component={BrowseScreen} />
      <BrowseStack.Screen name="ModeDetail" component={ModeDetailScreen} />
    </BrowseStack.Navigator>
  );
}

function LearnNavigator() {
  return (
    <LearnStack.Navigator screenOptions={{ headerShown: false }}>
      <LearnStack.Screen name="LearnHome" component={LearnScreen} />
      <LearnStack.Screen name="Lesson" component={LessonScreen} />
    </LearnStack.Navigator>
  );
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    hasSeenOnboarding().then((seen) => setShowOnboarding(!seen));
  }, []);

  if (showOnboarding === null) return null; // loading

  return (
    <SafeAreaProvider><NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.bgCard,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            letterSpacing: 0.5,
          },
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, string> = {
              Browse: 'grid-outline',
              Learn: 'book-outline',
              Practice: 'ear-outline',
              Profile: 'person-outline',
            };
            return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Browse" component={BrowseNavigator} />
        <Tab.Screen name="Learn" component={LearnNavigator} />
        <Tab.Screen name="Practice" component={PracticeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </NavigationContainer></SafeAreaProvider>
  );
}
