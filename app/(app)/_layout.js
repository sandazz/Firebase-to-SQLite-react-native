import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack 
      screenOptions={{
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
    }}>
      <Stack.Screen 
        name="home"
        options={{
          title: ""
        }} />
        <Stack.Screen 
        name="devices"
        options={{
          title: ""
        }} />
        <Stack.Screen 
        name="addDevice"
        options={{
          title: ""
        }} />
        <Stack.Screen 
        name="preferences"
        options={{
          title: ""
        }} />
    </Stack>)
}