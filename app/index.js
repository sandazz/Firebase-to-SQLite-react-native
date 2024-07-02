import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View className="flex-1 bg-gray-200 pt-20 items-center justify-center">
      <View className="w-full h-2/3">
        <Image className="w-full h-full object-cover" source={require("../assets/images/background.png")} />
      </View>
      <View className="h-1/3 w-full bg-black p-6 flex flex-col items-center justify-center">
        <Text className="text-white text-3xl font-bold mb-4">Welcome</Text>
        <Text className="text-white font-semibold mb-20">Data Dynamos & Co</Text>
        <Link href="/signIn" asChild>
          <Pressable
            className="w-3/5 bg-white py-3 rounded-full mb-10 active:bg-gray-800 transition duration-100">
            <Text className="text-black text-center text-xl font-bold">NEXT</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
} 