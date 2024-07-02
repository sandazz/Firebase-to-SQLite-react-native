import { View, Text, Pressable, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../context/authContext';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { devicesRef, preferencesRef } from '../../firebaseConfig';
import { addDoc, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import Loading from '../../components/Loading';
import Background from '../../components/Background';

export default function addDevice({}) {
    const router = useRouter();
    const {user} = useAuth();
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Image picker functionality
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };
    const addDevice = async () => {
        if (user && name && image) {
            const device = {
                user_id: user.uid,
                name: name,
                image: image, //app only saves image path. You can view images from only same device
            };

            try {
                setLoading(true);
                const deviceRef = await addDoc(devicesRef, device);

                // Create a corresponding preference for the device
                const preference = {
                    user_id: user.uid,
                    device_id: deviceRef.id,
                    day: false,
                    night: false,
                };
                await setDoc(doc(preferencesRef, deviceRef.id), preference);
                setLoading(false);
                router.replace('devices');

            } catch (error) {
                Alert.alert("Error", "Failed to add the device");
                console.error("Error adding device: ", error);
            }
        }
    };
    

  return (
    <Background>
        <View className="flex items-center mt-12 gap-11 h-1/5">
            <Text className="text-white text-s font-semibold">Data Dynamos & Co</Text>
            <View className="flex-1 justify-center">
                <Text style={{fontSize: hp(4)}} className="text-black font-bold">Add Device</Text>
            </View>
        </View>
        <View className="flex-1 items-center justify-center p-6">
            <View className="w-full space-y-8 gap-5">
                <TextInput
                    style={{height: hp(7), fontSize: hp(2)}}
                    id="device_name"
                    name="device_name"
                    value= {name}
                    onChangeText={setName}
                    placeholder="Device Name"
                    placeholderTextColor={'gray'}
                    className="p-4 bg-white bg-opacity-60 rounded-full text-neutral-700"
                />
                <TouchableOpacity onPress={pickImage} style={{height: hp(7), width: wp(88)}}>
                    <Text style={{fontSize: hp(2.2)}} className="text-neutral-700 font-bold text-center tracking-wider">Pick an Image</Text>
                </TouchableOpacity>
                <View className="items-center">
                {image && <Image source={{ uri: image }} style={{height: hp(20), width: wp(40)}} className="rounded-2xl border-4 border-white" />}
                </View>
                <View>
                    {
                        loading? (
                            <View className="flex-row justify-center">
                            <Loading size={hp(10)} />
                            </View>
                        ):(
                        <Pressable onPress={addDevice} style={{height: hp(7), width: wp(88)}} className="bg-gray-800 active:bg-gray-200 rounded-full justify-center items-center">
                            <Text style={{fontSize: hp(2.2)}} className="text-white font-bold tracking-wider">Add Device</Text>
                        </Pressable>
                        )
                    }        
                </View>
            </View>
        </View>
    </Background>

  )
}