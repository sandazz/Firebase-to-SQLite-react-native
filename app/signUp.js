import { View, Text, ImageBackground, TextInput, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';

export default function SignUp() {
  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("")
  const passwordRef = useRef("")

  const handleRegister = async()=> {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert("Sign Up", "Please fill in all the fields");
      return;
    }
    // Register Process
    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current)
    setLoading(false)

    console.log("got results", response);
    if(!response.success){
      Alert.alert("Sign Up", response.msg)
    }
  }

  return (
    <View className="flex-1">
      <StatusBar style='dark' />
      <View className="items-center justify-center bg-gray-200">
        <ImageBackground className="w-full h-full object-cover" source={require("../assets/images/background.png")}>
        <BlurView experimentalBlurMethod='ExperimentalBlurMethod' intensity={15} style={{ flex: 1}}> 
        <View className="gap-10">
          <View className="flex items-center mt-12">
            <Text className="text-white text-s font-semibold">Data Dynamos & Co</Text>
          </View>
          <View className="flex items-center">
              <Text className="text-black text-3xl font-bold">Create Profile</Text>
          </View>
        </View>
        {/* Profile details fields */}
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-full space-y-8 gap-5">
              <TextInput
                onChangeText={value=> emailRef.current = value}
                style={{height: hp(7), fontSize: hp(2)}}
                id="email"
                name="email"
                placeholder="Email Address"
                placeholderTextColor={'gray'}
                className="p-4 bg-white bg-opacity-80 rounded-full text-neutral-700"
              />
            <View className="mb-6">
              <TextInput
                onChangeText={value=> passwordRef.current = value}
                style={{height: hp(7), fontSize: hp(2)}}
                id="password"
                name="password"
                placeholder="Password"
                placeholderTextColor={'gray'}
                className="p-4 bg-white bg-opacity-80 rounded-full text-neutral-700"
                secureTextEntry
              />
            </View>
          </View>
          <View className="gap-5">
            <View>
                {
                  loading? (
                    <View className="flex-row justify-center">
                      <Loading size={hp(10)} />
                    </View>
                  ):(
                    <Pressable onPress={handleRegister} style={{height: hp(7), width: wp(88)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
                      <Text style={{fontSize: hp(2.2)}} className="text-white font-bold text-center tracking-wider">SIGN UP</Text>
                    </Pressable>
                  )
                }
            </View>
          </View>
        </View>
        </BlurView>
        </ImageBackground>
      </View>
      <View className="absolute bottom-8 w-full flex-row justify-center">
          <Text style={{ fontSize: hp(1.8) }} className="text-neutral-600">Have an account?  </Text>
          <Pressable onPress={() => router.push('signIn')}>
            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">Log In</Text>
          </Pressable>
        </View>
    </View>
  )
}