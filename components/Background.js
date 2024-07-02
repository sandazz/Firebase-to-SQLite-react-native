import React from 'react';
import { View, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

const Background = ({ children }) => {
  return (
    <View className="flex-1 bg-gray-200">
      <StatusBar style='dark' />
      <ImageBackground className="w-full h-full object-cover" source={require("../assets/images/background.png")}>
        <BlurView experimentalBlurMethod='ExperimentalBlurMethod' intensity={15} style={{ flex: 1 }}>
          {children}
        </BlurView>
      </ImageBackground>
    </View>
  );
};
export default Background;