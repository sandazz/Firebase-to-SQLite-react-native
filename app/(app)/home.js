import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Background from '../../components/Background';

export default function Home() {
  const router = useRouter();
  const {logout, user} = useAuth();

  const handleLogout = async()=> {
    await logout();
  }

  return (
    <Background>
            <View className="flex items-center mt-12 gap-11 h-1/5">
              <Text className="text-white text-s font-semibold">Data Dynamos & Co</Text>
              <View className="flex-1 justify-center">
                <Text style={{fontSize: hp(4)}} className="text-black font-bold">Welcome</Text>
              </View>
            </View>
            <View className="flex-1 items-center justify-center gap-10">
              <Pressable onPress={() => router.push('devices')} style={{height: hp(7), width: wp(88)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
                <Text style={{fontSize: hp(2.2)}} className="text-white font-bold tracking-wider">Devices</Text>
              </Pressable>
              <Pressable onPress={() => router.push('preferences')} style={{height: hp(7), width: wp(88)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
                <Text style={{fontSize: hp(2.2)}} className="text-white font-bold tracking-wider">Preferences</Text>
              </Pressable>
            </View>
            <View className="flex-1 items-center justify-start">
              <Pressable onPress={handleLogout} className="justify-center items-center">
                <Text style={{fontSize: hp(2.5)}} className="text-neutral-800 font-bold tracking-wider">LOGOUT</Text>
              </Pressable>
            </View>
            </Background>
  )
}