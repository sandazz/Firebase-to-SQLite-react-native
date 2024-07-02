import { View, Text, ImageBackground, TextInput, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const router = useRouter();
  const {login, resetPassword} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("")
  const passwordRef = useRef("")

  const handleLogin = async()=> {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert("Sign In", "Please fill all the details")
      return;
    }
    // Login Process
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    console.log("sign in response", response);
    if(!response.success){
      Alert.alert("Sign In", response.msg);
    }
  }
  const handleForgotPassword = async () => {
    if (!emailRef.current) {
        Alert.alert("Forgot Password", "Please enter your email address");
        return;
    }
    // Reset Password Process
    setLoading(true);
    const response = await resetPassword(emailRef.current);
    setLoading(false);
    if (response.success) {
        Alert.alert("Forgot Password", "Password reset email sent");
    } else {
        Alert.alert("Forgot Password", response.msg);
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
                <Text className="text-black text-3xl font-bold">Login</Text>
          </View>
        </View>
        {/* Login details fields */}
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-full space-y-8 gap-5">
              <TextInput
                onChangeText={value=> emailRef.current = value}
                style={{height: hp(7), fontSize: hp(2)}}
                id="email"
                name="email"
                placeholder="Email Address"
                placeholderTextColor={'gray'}
                className="p-4 bg-white bg-opacity-60 rounded-full text-neutral-700"
              />
            <View className="mb-6">
              <TextInput
                onChangeText={value=> passwordRef.current = value}
                style={{height: hp(7), fontSize: hp(2)}}
                id="password"
                name="password"
                placeholder="Password"
                placeholderTextColor={'gray'}
                className="p-4 bg-white bg-opacity-60 rounded-full text-neutral-700"
                secureTextEntry
              />
            </View>
          </View>
          <View className="gap-5">
          <View>
            {/* Show the loading indicator when button is pressed */}
            {
              loading? (
                <View className="flex-row justify-center">
                  <Loading size={hp(10)} />
                </View>
              ):(
                <Pressable onPress={handleLogin} style={{height: hp(7), width: wp(88)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
                  <Text style={{fontSize: hp(2.2)}} className="text-white font-bold text-center tracking-wider">LOGIN</Text>
                </Pressable>
              )
            }
          </View>
            <Pressable onPress={handleForgotPassword}>
              <Text style={{fontSize: hp(1.8)}} className="font-semibold text-center text-neutral-300 mt-11">Forgot Password ?</Text>
            </Pressable>
          </View>
        </View>
        </BlurView>
        </ImageBackground>
      </View>
      {/* Footer */}
      <View className="absolute bottom-8 w-full flex-row justify-center">
          <Text style={{ fontSize: hp(1.8) }} className="text-neutral-600">Don't have an account?  </Text>
          <Pressable onPress={() => router.push('signUp')}>
            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-800">Sign Up</Text>
          </Pressable>
      </View>
    </View>
  )
}