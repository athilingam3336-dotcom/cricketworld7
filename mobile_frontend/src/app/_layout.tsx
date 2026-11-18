import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { CricketPreloader } from '../components/common/CricketPreloader';
import '../utils/sweetalert';

export default function RootLayout() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  useEffect(() => {
    // Show cricket preloader first on initial app launch
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: isAppLoading ? '#f6f2e9' : '#020612' }}>
      <ErrorBoundary>
        <StatusBar
          barStyle={isAppLoading ? 'dark-content' : 'light-content'}
          backgroundColor={isAppLoading ? '#f6f2e9' : '#040a1b'}
        />

        {/* Main Application Container */}
        <View style={{ flex: 1, backgroundColor: isAppLoading ? '#f6f2e9' : '#020612' }}>
          
          {/* Stack is completely hidden (opacity 0) while preloader is active so Home page never flashes first */}
          <View style={{ flex: 1, opacity: isAppLoading ? 0 : 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#020612' }
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="admin-login" />
              <Stack.Screen name="admin/index" />
              <Stack.Screen name="team/index" />
              <Stack.Screen name="player/index" />
              <Stack.Screen name="umpire/index" />
              <Stack.Screen name="scorer/index" />
              <Stack.Screen name="scorecard/index" />
            </Stack>
          </View>

          {/* FIRST & FOREMOST: The Cricket Circle Preloader (Plays ONLY ONCE) */}
          {isAppLoading && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: '#f6f2e9',
                  zIndex: 999999,
                  elevation: 999999,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <CricketPreloader
                visible={true}
                fullscreen={true}
                loop={false}
                onComplete={() => setIsAppLoading(false)}
              />
            </View>
          )}

        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

